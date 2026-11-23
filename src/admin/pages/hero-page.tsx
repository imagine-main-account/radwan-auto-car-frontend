import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AdminForm } from "@/admin/components/admin-form";
import { TextareaField, TextField } from "@/admin/components/form-fields";
import { FormSection } from "@/admin/components/form-section";
import { ImageUploadField } from "@/admin/components/image-upload";
import { PageHeader } from "@/admin/components/page-header";
import { QueryState } from "@/admin/components/query-state";
import { heroInputSchema, type Hero, type HeroInput } from "@/schemas/content";
import { useGetHero, useUpdateHero, useUploadHeroImage } from "@/services/hero";

export default function HeroPage() {
  const query = useGetHero();

  return (
    <>
      <PageHeader title="الواجهة" description="أول حاجة الزبون بيشوفها لما يفتح الموقع." />
      <QueryState query={query}>{(hero) => <HeroForm hero={hero} />}</QueryState>
    </>
  );
}

function HeroForm({ hero }: { hero: Hero }) {
  const update = useUpdateHero();
  const uploadImage = useUploadHeroImage();
  const form = useForm<HeroInput>({
    resolver: zodResolver(heroInputSchema),
    defaultValues: { description: hero.description, imageAlt: hero.imageAlt },
  });
  const { control } = form;

  return (
    <AdminForm
      form={form}
      pending={update.isPending}
      onSubmit={(values) =>
        update.mutate(values, {
          onSuccess: (saved) => form.reset({ description: saved.description, imageAlt: saved.imageAlt }),
        })
      }
    >
      <FormSection title="النص">
        <TextareaField
          control={control}
          name="description"
          label="الوصف تحت اسم الورشة"
          counter={300}
          description="جملتين بالكتير: بتعملوا إيه وإزاي الزبون يكلمكم"
        />
      </FormSection>

      <FormSection title="الصورة">
        <ImageUploadField
          id="hero-image"
          label="صورة الواجهة"
          src={hero.image}
          onSelect={(file) => uploadImage.mutate(file)}
          pending={uploadImage.isPending}
          aspectRatio="3 / 2"
          description="صورة عرضية بجودة عالية. على الكمبيوتر بتظهر على الشمال وعلى الموبايل فوق النص."
        />
        <TextField
          control={control}
          name="imageAlt"
          label="وصف الصورة"
          description="جملة قصيرة بتوصف الصورة، بتساعد جوجل والمكفوفين"
        />
      </FormSection>
    </AdminForm>
  );
}
