import { Check } from "lucide-react";

import type { ServiceLamp } from "@/lib/service-lamps";
import { cn } from "@/lib/utils";

type ServiceLightsProps = {
  lamps: ServiceLamp[];
  /** How many services the visitor scrolled past: their lights are off. */
  fixed: number;
};

/** A quiet row of the services' warning lights with a progress line. Decorative: the list has the text. */
export function ServiceLights({ lamps, fixed }: ServiceLightsProps) {
  const total = lamps.length;
  const done = fixed >= total;

  return (
    <div aria-hidden="true" className="max-w-sm border-t border-concrete-ink/15 pt-6">
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <span className="font-semibold">لمبات التابلوه</span>
        <span className="text-concrete-muted tabular-nums">{done ? "كله اتصلح" : `اتصلح ${fixed} من ${total}`}</span>
      </div>

      <ul className="mt-4 flex flex-wrap gap-4">
        {lamps.map((lamp, index) => (
          <li key={index}>
            <ServiceLight icon={lamp.icon} on={index >= fixed} />
          </li>
        ))}
      </ul>

      <div className="mt-5 h-0.5 bg-concrete-ink/10">
        <div
          className={cn(
            "h-full transition-[width,background-color] duration-500",
            done ? "bg-concrete-ink" : "bg-primary",
          )}
          style={{ width: `${total ? (fixed / total) * 100 : 100}%` }}
        />
      </div>
    </div>
  );
}

type ServiceLightProps = { icon: ServiceLamp["icon"]; on: boolean; className?: string };

/** A warning light icon: red and glowing while the problem is "on", grey with a small tick once fixed. */
export function ServiceLight({ icon: Icon, on, className }: ServiceLightProps) {
  return (
    <span aria-hidden="true" className={cn("relative inline-flex shrink-0", className)}>
      <Icon
        className={cn(
          "size-6 transition-all duration-500",
          on ? "text-primary drop-shadow-[0_0_6px_rgb(212_42_32/0.55)]" : "text-concrete-ink/25",
        )}
      />
      <span
        className={cn(
          "absolute -end-1.5 -bottom-1 flex size-3.5 items-center justify-center rounded-full bg-concrete-ink text-concrete transition-all duration-300",
          on ? "scale-0 opacity-0" : "scale-100 opacity-100",
        )}
      >
        <Check className="size-2.5" strokeWidth={4} />
      </span>
    </span>
  );
}
