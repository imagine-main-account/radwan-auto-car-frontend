import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AdminForm } from "@/admin/components/admin-form";
import { ImageField, TextareaField, TextField } from "@/admin/components/form-fields";
import { FormSection } from "@/admin/components/form-section";
import { PageHeader } from "@/admin/components/page-header";
import { QueryState } from "@/admin/components/query-state";
import { heroSchema, type Hero } from "@/schemas/content";
import { useGetHero, useUpdateHero } from "@/services/hero";

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
  const form = useForm<Hero>({ resolver: zodResolver(heroSchema), defaultValues: hero });
  const { control } = form;

  return (
    <AdminForm
      form={form}
      pending={update.isPending}
      onSubmit={(values) => update.mutate(values, { onSuccess: (saved) => form.reset(saved) })}
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
        <ImageField
          control={control}
          name="image"
          label="صورة الواجهة"
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
