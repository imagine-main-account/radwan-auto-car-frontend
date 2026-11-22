import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";
import { Container } from "./container";

type SectionProps = ComponentProps<"section"> & { containerClassName?: string };

/** A full-width page section (anchor target) with the standard vertical rhythm. */
export function Section({ className, containerClassName, children, ...props }: SectionProps) {
  return (
    <section className={cn("scroll-mt-20", className)} {...props}>
      <Container className={cn("py-20 lg:py-28", containerClassName)}>{children}</Container>
    </section>
  );
}

export function SectionTitle({ className, ...props }: ComponentProps<"h2">) {
  return <h2 className={cn("font-display text-4xl leading-tight font-extrabold sm:text-5xl", className)} {...props} />;
}
