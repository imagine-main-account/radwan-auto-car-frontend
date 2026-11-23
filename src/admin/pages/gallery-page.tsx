import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Images, Plus } from "lucide-react";
import { useForm } from "react-hook-form";

import { EmptyState } from "@/admin/components/empty-state";
import { ImageFileField, SwitchField, TextField } from "@/admin/components/form-fields";
import { ITEM_FORM_ID, ItemFormDialog } from "@/admin/components/item-form-dialog";
import { ListItemCard } from "@/admin/components/list-item-card";
import { PageHeader } from "@/admin/components/page-header";
import { QueryState } from "@/admin/components/query-state";
import { Button } from "@/components/ui/button";
import { move } from "@/lib/array";
import {
  galleryPhotoInputSchema,
  galleryPhotoPatchSchema,
  type GalleryPhoto,
  type GalleryPhotoInput,
  type GalleryPhotoPatch,
} from "@/schemas/content";
import {
  useCreateGalleryPhoto,
  useDeleteGalleryPhoto,
  useGetGallery,
  useIsReorderingGallery,
  useReorderGallery,
  useUpdateGalleryPhoto,
} from "@/services/gallery";

export default function GalleryPage() {
  const query = useGetGallery();
  const create = useCreateGalleryPhoto();
  const [creating, setCreating] = useState(false);

  const addButton = (
    <Button onClick={() => setCreating(true)}>
      <Plus />
      إضافة صورة
    </Button>
  );

  return (
    <>
      <PageHeader
        title="صور الورشة"
        description="الصور اللي في قسم «شغلنا بيتكلم». الأفضل صور حقيقية من جوه الورشة، وأحلى شكل لما تكون 4 أو 8 صور ظاهرة."
        actions={addButton}
      />

      <QueryState query={query}>
        {(photos) =>
          photos.length === 0 ? (
            <EmptyState icon={Images} title="لسه مفيش صور" action={addButton} />
          ) : (
            <ul className="grid gap-3">
              {photos.map((photo, index) => (
                <PhotoRow key={photo.id} photo={photo} index={index} photos={photos} />
              ))}
            </ul>
          )
        }
      </QueryState>

      <ItemFormDialog open={creating} onOpenChange={setCreating} title="إضافة صورة" pending={create.isPending}>
        <NewPhotoForm onSubmit={(values) => create.mutate(values, { onSuccess: () => setCreating(false) })} />
      </ItemFormDialog>
    </>
  );
}

type PhotoRowProps = { photo: GalleryPhoto; index: number; photos: GalleryPhoto[] };

function PhotoRow({ photo: { id, image, ...photo }, index, photos }: PhotoRowProps) {
  const update = useUpdateGalleryPhoto(id);
  const remove = useDeleteGalleryPhoto(id);
  const reorder = useReorderGallery();
  const reordering = useIsReorderingGallery();
  const [editing, setEditing] = useState(false);

  return (
    <>
      <ListItemCard
        index={index}
        total={photos.length}
        onMove={(to) => reorder.mutate(move(photos, index, to).map((item) => item.id))}
        visible={photo.visible}
        onVisibleChange={(visible) => update.mutate({ visible })}
        onEdit={() => setEditing(true)}
        onDelete={() => remove.mutate()}
        deleteTitle="تمسح الصورة دي؟"
        busy={update.isPending || remove.isPending}
        moveLocked={reordering}
      >
        <div className="flex items-center gap-4">
          <img
            src={image}
            alt=""
            width={128}
            height={96}
            loading="lazy"
            className="aspect-4/3 w-32 shrink-0 rounded-md bg-muted object-cover"
          />
          <p className="leading-7">{photo.caption}</p>
        </div>
      </ListItemCard>

      <ItemFormDialog open={editing} onOpenChange={setEditing} title="تعديل الصورة" pending={update.isPending}>
        <EditPhotoForm
          image={image}
          defaultValues={photo}
          onSubmit={(values) => update.mutate(values, { onSuccess: () => setEditing(false) })}
        />
      </ItemFormDialog>
    </>
  );
}

function NewPhotoForm({ onSubmit }: { onSubmit: (values: GalleryPhotoInput) => void }) {
  const form = useForm<GalleryPhotoInput>({
    resolver: zodResolver(galleryPhotoInputSchema),
    defaultValues: { caption: "", visible: true },
  });
  const { control } = form;

  return (
    <form id={ITEM_FORM_ID} noValidate onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
      <ImageFileField control={control} name="file" label="الصورة" aspectRatio="4 / 3" />
      <TextField control={control} name="caption" label="الوصف" counter={80} />
      <SwitchField control={control} name="visible" label="تظهر في الصفحة" />
    </form>
  );
}

type EditPhotoFormProps = {
  image: string;
  defaultValues: GalleryPhotoPatch;
  onSubmit: (values: GalleryPhotoPatch) => void;
};

function EditPhotoForm({ image, defaultValues, onSubmit }: EditPhotoFormProps) {
  const form = useForm<GalleryPhotoPatch>({ resolver: zodResolver(galleryPhotoPatchSchema), defaultValues });
  const { control } = form;

  return (
    <form id={ITEM_FORM_ID} noValidate onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
      <div className="grid gap-2">
        <img src={image} alt="" className="aspect-4/3 w-full rounded-lg bg-muted object-cover" />
        <p className="text-sm text-muted-foreground">عشان تغيّر الصورة نفسها، ضيف صورة جديدة وامسح دي.</p>
      </div>
      <TextField control={control} name="caption" label="الوصف" counter={80} autoFocus />
      <SwitchField control={control} name="visible" label="تظهر في الصفحة" />
    </form>
  );
}
