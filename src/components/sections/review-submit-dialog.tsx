/**
 * "Write your review" dialog of the landing page. Loaded only when the visitor opens it,
 * so the form code never slows down the first page load.
 */
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, LoaderCircle, Send } from "lucide-react";
import { useForm } from "react-hook-form";

import { TextareaField, TextField } from "@/admin/components/form-fields";
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
import { getErrorMessage } from "@/lib/api";
import { reviewSubmissionInputSchema, type ReviewSubmissionInput } from "@/schemas/content";
import { useCreateReviewSubmission } from "@/services/review-submissions";

type ReviewSubmitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ReviewSubmitDialog({ open, onOpenChange }: ReviewSubmitDialogProps) {
  const submit = useCreateReviewSubmission();
  const form = useForm<ReviewSubmissionInput>({
    resolver: zodResolver(reviewSubmissionInputSchema),
    defaultValues: { name: "", text: "" },
  });
  const { control } = form;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {submit.isSuccess ? (
          <>
            <DialogHeader className="items-center text-center">
              <CircleCheck aria-hidden="true" className="size-10 text-primary" />
              <DialogTitle>شكراً على رأيك!</DialogTitle>
              <DialogDescription>رأيك وصلنا، وهيظهر في الصفحة بعد ما نراجعه.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button>تمام</Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <form noValidate onSubmit={form.handleSubmit((values) => submit.mutate(values))} className="grid gap-6">
            <DialogHeader>
              <DialogTitle>اكتب رأيك</DialogTitle>
              <DialogDescription>اتعاملت معانا قبل كده؟ قولنا رأيك بصراحة.</DialogDescription>
            </DialogHeader>

            <TextField control={control} name="name" label="اسمك" autoComplete="name" counter={60} autoFocus />
            <TextareaField control={control} name="text" label="رأيك" rows={4} counter={400} />

            {submit.isError && (
              <p role="alert" className="text-sm text-destructive">
                {getErrorMessage(submit.error)}
              </p>
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  إلغاء
                </Button>
              </DialogClose>
              <Button type="submit" disabled={submit.isPending}>
                {submit.isPending ? <LoaderCircle className="animate-spin" /> : <Send />}
                ابعت رأيك
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
