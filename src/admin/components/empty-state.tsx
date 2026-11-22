import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, title, action }: { icon: LucideIcon; title: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-10 text-center">
      <Icon aria-hidden="true" className="size-8 text-muted-foreground" />
      <p className="text-muted-foreground">{title}</p>
      {action}
    </div>
  );
}
