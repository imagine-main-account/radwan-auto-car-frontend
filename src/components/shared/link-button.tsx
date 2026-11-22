import type { ComponentProps, ComponentType } from "react";

import { Button } from "@/components/ui/button";
import { linkProps } from "@/lib/links";

export type LinkButtonProps = Omit<ComponentProps<typeof Button>, "asChild"> & {
  href: string;
  icon?: ComponentType<ComponentProps<"svg">>;
};

/** A shadcn `Button` rendered as a link, with an optional leading icon. External URLs open in a new tab. */
export function LinkButton({ href, icon: Icon, children, ...props }: LinkButtonProps) {
  return (
    <Button asChild {...props}>
      <a {...linkProps(href)}>
        {Icon && <Icon aria-hidden="true" />}
        {children}
      </a>
    </Button>
  );
}
