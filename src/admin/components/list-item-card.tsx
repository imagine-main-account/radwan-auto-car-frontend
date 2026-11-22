import type { ReactNode } from "react";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "./confirm-dialog";

type ListItemCardProps = {
  index: number;
  total: number;
  onMove: (to: number) => void;
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  deleteTitle: string;
  busy?: boolean;
  children: ReactNode;
};

/** One row of an orderable list (services, reviews): move up/down, show/hide, edit, delete. */
export function ListItemCard({
  index,
  total,
  onMove,
  visible,
  onVisibleChange,
  onEdit,
  onDelete,
  deleteTitle,
  busy,
  children,
}: ListItemCardProps) {
  return (
    <li>
      <Card className="gap-0 py-0">
        <div className="flex gap-3 p-4">
          <div className="flex flex-col">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="طلّعه لفوق"
              disabled={index === 0}
              onClick={() => onMove(index - 1)}
            >
              <ChevronUp />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="نزّله لتحت"
              disabled={index === total - 1}
              onClick={() => onMove(index + 1)}
            >
              <ChevronDown />
            </Button>
          </div>
          <div className={cn("min-w-0 flex-1", !visible && "opacity-60")}>
            {children}
            {!visible && (
              <Badge variant="secondary" className="mt-2">
                مخفي من الصفحة
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t px-4 py-2">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Switch checked={visible} onCheckedChange={onVisibleChange} disabled={busy} />
            يظهر في الصفحة
          </label>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Pencil />
              تعديل
            </Button>
            <ConfirmDialog
              title={deleteTitle}
              description="مش هتقدر ترجّعه بعد المسح."
              onConfirm={onDelete}
              trigger={
                <Button variant="ghost" size="sm" className="text-signal hover:text-signal" disabled={busy}>
                  <Trash2 />
                  مسح
                </Button>
              }
            />
          </div>
        </div>
      </Card>
    </li>
  );
}
