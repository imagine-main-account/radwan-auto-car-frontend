import { Megaphone } from "lucide-react";

import type { Banner } from "@/schemas/content";
import { cn } from "@/lib/utils";

/** Thin strip above the header for temporary notices (holidays, offers). Rendered only when active. */
export function AnnouncementBanner({ banner }: { banner: Pick<Banner, "text" | "variant"> }) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-center justify-center gap-2 px-5 py-2.5 text-center text-sm font-semibold",
        banner.variant === "warning" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
      )}
    >
      <Megaphone aria-hidden="true" className="size-4 shrink-0" />
      <p>{banner.text}</p>
    </div>
  );
}
