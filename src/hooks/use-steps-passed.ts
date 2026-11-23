import { useEffect, useState, type RefObject } from "react";

/** How many `[data-step]` elements inside `ref` have scrolled above the middle of the screen. */
export function useStepsPassed(ref: RefObject<HTMLElement | null>) {
  const [passed, setPassed] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const steps = ref.current?.querySelectorAll<HTMLElement>("[data-step]") ?? [];
      const line = window.innerHeight * 0.55;
      setPassed(Array.from(steps).filter((step) => step.getBoundingClientRect().top < line).length);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref]);

  return passed;
}
