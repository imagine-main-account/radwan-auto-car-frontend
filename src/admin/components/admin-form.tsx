import type { ReactNode } from "react";
import { LoaderCircle, RotateCcw, Save } from "lucide-react";
import type { FieldValues, SubmitHandler, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { UnsavedChangesGuard } from "./unsaved-changes-guard";

type AdminFormProps<TValues extends FieldValues, TOutput> = {
  form: UseFormReturn<TValues, unknown, TOutput>;
  onSubmit: SubmitHandler<TOutput>;
  pending: boolean;
  children: ReactNode;
};

/** Standard edit form: sticky save / undo bar and a warning before leaving with unsaved changes. */
export function AdminForm<TValues extends FieldValues, TOutput>({
  form,
  onSubmit,
  pending,
  children,
}: AdminFormProps<TValues, TOutput>) {
  const { isDirty } = form.formState;

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
      {children}

      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center justify-end gap-2 border-t bg-background/95 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        {isDirty && <p className="me-auto text-sm text-muted-foreground">فيه تعديلات لسه ما اتحفظتش</p>}
        <Button type="button" variant="outline" disabled={!isDirty || pending} onClick={() => form.reset()}>
          <RotateCcw />
          تراجع
        </Button>
        <Button type="submit" disabled={!isDirty || pending}>
          {pending ? <LoaderCircle className="animate-spin" /> : <Save />}
          حفظ التعديلات
        </Button>
      </div>

      <UnsavedChangesGuard when={isDirty && !pending} />
    </form>
  );
}
