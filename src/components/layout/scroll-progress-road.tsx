import { useEffect, useRef } from "react";

const CAR_WIDTH = 28;

/**
 * Reading progress on the header's bottom border: the border is the road, a red line fills it in
 * and a small car drives from right to left (RTL) as the page scrolls. Decorative only.
 */
export function ScrollProgressRoad() {
  const roadRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);

  // Written straight to the DOM once per frame: no React re-render per scroll event.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const road = roadRef.current;
      if (!road || !fillRef.current || !carRef.current) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      const distance = progress * (road.clientWidth - CAR_WIDTH);
      fillRef.current.style.width = `${distance + CAR_WIDTH / 2}px`;
      carRef.current.style.transform = `translateX(${-distance}px)`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // The page height changes when images or late content load.
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={roadRef} aria-hidden="true" className="pointer-events-none absolute inset-x-0 -bottom-px h-px">
      <div ref={fillRef} className="absolute top-0 right-0 h-0.5 w-0 bg-primary" />
      <div ref={carRef} className="absolute right-0 bottom-0 will-change-transform">
        {/* Drawn facing right (hood + headlight on the right), mirrored so it faces left: the way it drives (RTL). */}
        <svg viewBox="0 0 40 16" width={CAR_WIDTH} height={11} className="-scale-x-100">
          <path
            d="M39 12 Q39 9 36 8.5 L29 7.5 Q26 3.5 22 3.2 L14 3.2 Q10.5 3.4 8 7 L3 8 Q1 8.5 1 10.6 L1 12 Z"
            fill="var(--color-primary)"
          />
          <path d="M27 7.4 Q24.6 4.6 21.6 4.4 L19 4.4 L19 7.4 Z" fill="#fff" fillOpacity=".5" />
          <path d="M17.6 4.4 L14.4 4.4 Q11.8 4.6 10 7.4 L17.6 7.4 Z" fill="#fff" fillOpacity=".5" />
          <rect x="37" y="8.6" width="2" height="1.4" rx=".6" fill="#ffe9a8" />
          <rect x="1" y="9" width="1.6" height="1.4" rx=".6" fill="#ff5a4f" />
          <circle cx="10" cy="12.4" r="2.8" fill="#111" />
          <circle cx="31" cy="12.4" r="2.8" fill="#111" />
          <circle cx="10" cy="12.4" r="1.1" fill="#6b7078" />
          <circle cx="31" cy="12.4" r="1.1" fill="#6b7078" />
        </svg>
      </div>
    </div>
  );
}
