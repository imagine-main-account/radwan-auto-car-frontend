import { useEffect, useState, type RefObject } from "react";

/**
 * For "animate when it comes into view" effects on a prerendered page:
 * - `null`: not decided yet (server HTML, first render, or reduced motion): show the final state.
 * - `false`: the element is still below the screen: show the start state, ready to animate.
 * - `true`: the element came into view: animate to the final state.
 */
export function useScrollReveal(ref: RefObject<HTMLElement | null>, threshold = 0.4) {
  const [revealed, setRevealed] = useState<boolean | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Only animate if it was reset while below the screen; if it was already visible, keep the final state.
          setRevealed((current) => (current === false ? true : current));
          observer.disconnect();
        } else if (entry.boundingClientRect.top > 0) {
          // Still below the screen: reset so it can animate in. (Already scrolled past: leave it as is.)
          setRevealed((current) => current ?? false);
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return revealed;
}

/** Counts from 0 up to `target` once `revealed` is true (see `useScrollReveal`). */
export function useCountUp(target: number, revealed: boolean | null, duration = 1600) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (revealed !== true) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * (1 - (1 - t) ** 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, revealed, duration]);

  if (revealed === null) return target;
  return revealed ? value : 0;
}
