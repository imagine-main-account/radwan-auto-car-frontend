import type { CSSProperties } from "react";
import { CircleCheckIcon, InfoIcon, LoaderCircleIcon, OctagonXIcon, TriangleAlertIcon } from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/** The site is dark-only, so the theme is fixed instead of coming from next-themes. */
function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      dir="rtl"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <LoaderCircleIcon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          fontFamily: "var(--font-sans)",
        } as CSSProperties
      }
      {...props}
    />
  );
}

export { Toaster };
