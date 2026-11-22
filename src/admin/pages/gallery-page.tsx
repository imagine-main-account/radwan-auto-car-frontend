import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { AdminForm } from "@/admin/components/admin-form";
import { ImageField, TextField } from "@/admin/components/form-fields";
import { FormSection } from "@/admin/components/form-section";
import { PageHeader } from "@/admin/components/page-header";
import { QueryState } from "@/admin/components/query-state";
import { gallerySchema, type GalleryPhoto } from "@/schemas/content";
import { useGetGallery, useUpdateGallery } from "@/services/gallery";

type GalleryValues = z.infer<typeof gallerySchema>;

/** Shape of each slot on the site, so the preview crops like the real page. */
const slots: Record<GalleryPhoto["layout"], { title: string; aspectRatio: string }> = {
  feature: { title: "الصورة الكبيرة", aspectRatio: "4 / 3" },
  tile: { title: "صورة صغيرة", aspectRatio: "4 / 3" },
  wide: { title: "الصورة العريضة", aspectRatio: "2 / 1" },
};

export default function GalleryPage() {
  const query = useGetGallery();

  return (
    <>
      <PageHeader
        title="صور الورشة"
        description="الـ 4 صور اللي في قسم «شغلنا بيتكلم». الأفضل صور حقيقية من جوه الورشة."
      />
      <QueryState query={query}>{(photos) => <GalleryForm photos={photos} />}</QueryState>
    </>
  );
}

function GalleryForm({ photos }: { photos: GalleryPhoto[] }) {
  const update = useUpdateGallery();
  const form = useForm<GalleryValues>({ resolver: zodResolver(gallerySchema), defaultValues: { photos } });
  const { control } = form;

  return (
    <AdminForm
      form={form}
      pending={update.isPending}
      onSubmit={(values) => update.mutate(values.photos, { onSuccess: (saved) => form.reset({ photos: saved }) })}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {photos.map((photo, index) => (
          <FormSection key={photo.id} title={slots[photo.layout].title}>
            <ImageField
              control={control}
              name={`photos.${index}.image`}
              label="الصورة"
              aspectRatio={slots[photo.layout].aspectRatio}
            />
            <TextField control={control} name={`photos.${index}.caption`} label="الوصف" counter={80} />
          </FormSection>
        ))}
      </div>
    </AdminForm>
  );
}
