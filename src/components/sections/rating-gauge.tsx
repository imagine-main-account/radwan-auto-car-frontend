import { useRef } from "react";

import { SectionTitle } from "@/components/shared/section";
import { Gauge } from "@/components/shared/gauge";
import { useCountUp, useScrollReveal } from "@/hooks/use-scroll-reveal";

type RatingGaugeProps = { percent: number; count: number };

/**
 * The recommendation rate as a rev counter: the needle sweeps up and the numbers count up
 * when the block scrolls into view. The prerendered HTML shows the real numbers.
 */
export function RatingGauge({ percent, count }: RatingGaugeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useScrollReveal(ref);
  const shownPercent = useCountUp(percent, revealed);
  const shownCount = useCountUp(count, revealed, 2000);

  return (
    <div ref={ref} className="flex items-center gap-4 sm:gap-6">
      <div className="w-20 shrink-0 sm:w-36">
        <Gauge
          value={(revealed === false ? 0 : percent) / 100}
          dangerFrom={0.9}
          needleTransition="transform 1.6s cubic-bezier(.2,1.25,.4,1)"
          className="w-full"
        />
        <p className="text-center font-display text-2xl leading-none font-black text-primary tabular-nums sm:text-5xl">
          {shownPercent}%
        </p>
      </div>
      <div className="min-w-0">
        <SectionTitle className="text-2xl sm:text-4xl">من عملائنا بيرشحونا</SectionTitle>
        <p className="mt-1 text-sm text-muted-foreground sm:mt-2 sm:text-base">
          من <span className="tabular-nums">{shownCount}</span> تقييم على صفحتنا في فيسبوك
        </p>
      </div>
    </div>
  );
}
