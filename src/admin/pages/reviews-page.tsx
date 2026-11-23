import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquareQuote, Plus } from "lucide-react";
import { useForm } from "react-hook-form";

import { EmptyState } from "@/admin/components/empty-state";
import { SwitchField, TextareaField, TextField } from "@/admin/components/form-fields";
import { ITEM_FORM_ID, ItemFormDialog } from "@/admin/components/item-form-dialog";
import { ListItemCard } from "@/admin/components/list-item-card";
import { PageHeader } from "@/admin/components/page-header";
import { QueryState } from "@/admin/components/query-state";
import { Button } from "@/components/ui/button";
import { move } from "@/lib/array";
import { reviewInputSchema, type Review, type ReviewInput } from "@/schemas/content";
import {
  useCreateReview,
  useDeleteReview,
  useGetAllReviews,
  useIsReorderingReviews,
  useReorderReviews,
  useUpdateReview,
} from "@/services/reviews";

const emptyReview: ReviewInput = { name: "", text: "", visible: true };

export default function ReviewsPage() {
  const query = useGetAllReviews();
  const create = useCreateReview();
  const [creating, setCreating] = useState(false);

  const addButton = (
    <Button onClick={() => setCreating(true)}>
      <Plus />
      إضافة رأي
    </Button>
  );

  return (
    <>
      <PageHeader
        title="آراء العملاء"
        description="انسخ التقييمات من صفحة فيسبوك زي ما هي. نسبة الترشيح وعدد التقييمات في «بيانات التواصل»."
        actions={addButton}
      />

      <QueryState query={query}>
        {(reviews) =>
          reviews.length === 0 ? (
            <EmptyState icon={MessageSquareQuote} title="لسه مفيش آراء" action={addButton} />
          ) : (
            <ul className="grid gap-3">
              {reviews.map((review, index) => (
                <ReviewRow key={review.id} review={review} index={index} reviews={reviews} />
              ))}
            </ul>
          )
        }
      </QueryState>

      <ItemFormDialog open={creating} onOpenChange={setCreating} title="إضافة رأي" pending={create.isPending}>
        <ReviewForm
          defaultValues={emptyReview}
          onSubmit={(values) => create.mutate(values, { onSuccess: () => setCreating(false) })}
        />
      </ItemFormDialog>
    </>
  );
}

type ReviewRowProps = { review: Review; index: number; reviews: Review[] };

function ReviewRow({ review: { id, ...review }, index, reviews }: ReviewRowProps) {
  const update = useUpdateReview(id);
  const remove = useDeleteReview(id);
  const reorder = useReorderReviews();
  const reordering = useIsReorderingReviews();
  const [editing, setEditing] = useState(false);

  return (
    <>
      <ListItemCard
        index={index}
        total={reviews.length}
        onMove={(to) => reorder.mutate(move(reviews, index, to).map((item) => item.id))}
        visible={review.visible}
        onVisibleChange={(visible) => update.mutate({ visible })}
        onEdit={() => setEditing(true)}
        onDelete={() => remove.mutate()}
        deleteTitle={`تمسح رأي ${review.name}؟`}
        busy={update.isPending || remove.isPending}
        moveLocked={reordering}
      >
        <p className="leading-7">«{review.text}»</p>
        <p className="mt-1 text-sm text-muted-foreground">{review.name}</p>
      </ListItemCard>

      <ItemFormDialog open={editing} onOpenChange={setEditing} title="تعديل الرأي" pending={update.isPending}>
        <ReviewForm
          defaultValues={review}
          onSubmit={(values) => update.mutate(values, { onSuccess: () => setEditing(false) })}
        />
      </ItemFormDialog>
    </>
  );
}

type ReviewFormProps = {
  defaultValues: ReviewInput;
  onSubmit: (values: ReviewInput) => void;
};

function ReviewForm({ defaultValues, onSubmit }: ReviewFormProps) {
  const form = useForm<ReviewInput>({ resolver: zodResolver(reviewInputSchema), defaultValues });
  const { control } = form;

  return (
    <form id={ITEM_FORM_ID} noValidate onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
      <TextField control={control} name="name" label="اسم العميل" autoFocus />
      <TextareaField control={control} name="text" label="الرأي" rows={4} counter={400} />
      <SwitchField control={control} name="visible" label="يظهر في الصفحة" />
    </form>
  );
}
