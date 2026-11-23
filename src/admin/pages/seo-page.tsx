import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type Control } from "react-hook-form";

import { AdminForm } from "@/admin/components/admin-form";
import { TextareaField, TextField } from "@/admin/components/form-fields";
import { FormSection } from "@/admin/components/form-section";
import { ImageUploadField } from "@/admin/components/image-upload";
import { PageHeader } from "@/admin/components/page-header";
import { QueryState } from "@/admin/components/query-state";
import { seoInputSchema, type Seo, type SeoInput } from "@/schemas/content";
import { useGetSeo, useUpdateSeo, useUploadSeoImage } from "@/services/seo";

export default function SeoPage() {
  const query = useGetSeo();

  return (
    <>
      <PageHeader
        title="جوجل والمشاركة"
        description="إزاي الموقع بيظهر في نتايج جوجل ولما حد يبعت اللينك على واتساب."
      />
      <QueryState query={query}>{(seo) => <SeoForm seo={seo} />}</QueryState>
    </>
  );
}

function SeoForm({ seo }: { seo: Seo }) {
  const update = useUpdateSeo();
  const uploadImage = useUploadSeoImage();
  const form = useForm<SeoInput>({
    resolver: zodResolver(seoInputSchema),
    defaultValues: { title: seo.title, description: seo.description },
  });
  const { control } = form;

  return (
    <AdminForm
      form={form}
      pending={update.isPending}
      onSubmit={(values) =>
        update.mutate(values, {
          onSuccess: (saved) => form.reset({ title: saved.title, description: saved.description }),
        })
      }
    >
      <FormSection title="نتيجة البحث">
        <TextField control={control} name="title" label="العنوان" counter={70} description="اسم الورشة والمنطقة" />
        <TextareaField
          control={control}
          name="description"
          label="الوصف"
          counter={170}
          description="جملة أو اتنين عن الخدمات والمواعيد"
        />
        <SearchPreview control={control} />
      </FormSection>

      <FormSection title="صورة المشاركة">
        <ImageUploadField
          id="seo-image"
          label="الصورة"
          src={seo.image}
          onSelect={(file) => uploadImage.mutate(file)}
          pending={uploadImage.isPending}
          aspectRatio="1200 / 630"
          description="بتظهر لما حد يبعت لينك الموقع على واتساب أو فيسبوك. المقاس المثالي 1200×630."
        />
      </FormSection>
    </AdminForm>
  );
}

/** Rough preview of the Google search result. */
function SearchPreview({ control }: { control: Control<SeoInput> }) {
  const [title, description] = useWatch({ control, name: ["title", "description"] });

  return (
    <div className="rounded-lg bg-white p-4" aria-label="معاينة في جوجل">
      <p className="text-xs text-[#4d5156]">معاينة في جوجل</p>
      <p className="mt-1 text-lg leading-snug text-[#1a0dab]">{title || "العنوان"}</p>
      <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#4d5156]">{description || "الوصف"}</p>
    </div>
  );
}
