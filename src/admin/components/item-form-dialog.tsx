import type { ReactNode } from "react";
import { LoaderCircle, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const ITEM_FORM_ID = "item-form";

type ItemFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  pending: boolean;
  /** A `<form id={ITEM_FORM_ID}>`. It mounts fresh every time the dialog opens, so its defaults are always current. */
  children: ReactNode;
};

/** Add / edit dialog for list items. The save button submits the child form by id. */
export function ItemFormDialog({ open, onOpenChange, title, pending, children }: ItemFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">{title}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">إلغاء</Button>
          </DialogClose>
          <Button type="submit" form={ITEM_FORM_ID} disabled={pending}>
            {pending ? <LoaderCircle className="animate-spin" /> : <Save />}
            حفظ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
