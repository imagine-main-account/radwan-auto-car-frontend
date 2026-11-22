import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AdminForm } from "@/admin/components/admin-form";
import { NumberField, TextField } from "@/admin/components/form-fields";
import { FormSection } from "@/admin/components/form-section";
import { PageHeader } from "@/admin/components/page-header";
import { QueryState } from "@/admin/components/query-state";
import { siteInfoSchema, type SiteInfo } from "@/schemas/content";
import { useGetSiteInfo, useUpdateSiteInfo } from "@/services/site-info";

export default function SiteInfoPage() {
  const query = useGetSiteInfo();

  return (
    <>
      <PageHeader title="بيانات التواصل" description="الاسم والعنوان وأرقام التليفون ولينكات فيسبوك." />
      <QueryState query={query}>{(siteInfo) => <SiteInfoForm siteInfo={siteInfo} />}</QueryState>
    </>
  );
}

function SiteInfoForm({ siteInfo }: { siteInfo: SiteInfo }) {
  const update = useUpdateSiteInfo();
  const form = useForm<SiteInfo>({ resolver: zodResolver(siteInfoSchema), defaultValues: siteInfo });
  const { control } = form;

  return (
    <AdminForm
      form={form}
      pending={update.isPending}
      onSubmit={(values) => update.mutate(values, { onSuccess: (saved) => form.reset(saved) })}
    >
      <FormSection title="الورشة">
        <TextField control={control} name="name" label="اسم الورشة" description="العنوان الكبير في أول الصفحة" />
        <TextField control={control} name="area" label="المنطقة" description="بتظهر فوق اسم الورشة" />
        <TextField control={control} name="address" label="العنوان بالتفصيل" />
        <TextField control={control} name="footerArea" label="المنطقة في آخر الصفحة" />
      </FormSection>

      <FormSection title="التواصل" description="الأرقام تتكتب 11 رقم زي 01012345678">
        <TextField control={control} name="phone" label="رقم التليفون" type="tel" dir="ltr" inputMode="tel" />
        <TextField control={control} name="whatsapp" label="رقم الواتساب" type="tel" dir="ltr" inputMode="tel" />
        <TextField control={control} name="email" label="الإيميل" type="email" dir="ltr" />
        <TextField
          control={control}
          name="mapUrl"
          label="لينك جوجل ماب"
          type="url"
          dir="ltr"
          description="افتح مكان الورشة على جوجل ماب، دوس «مشاركة» وانسخ اللينك"
        />
      </FormSection>

      <FormSection title="فيسبوك">
        <TextField control={control} name="facebook.page" label="لينك الصفحة" type="url" dir="ltr" />
        <TextField control={control} name="facebook.reviews" label="لينك التقييمات" type="url" dir="ltr" />
        <TextField control={control} name="facebook.photos" label="لينك الصور" type="url" dir="ltr" />
      </FormSection>

      <FormSection title="تقييم فيسبوك" description="الأرقام دي بتظهر في أول الصفحة وفي قسم آراء العملاء">
        <div className="grid gap-6 sm:grid-cols-2">
          <NumberField control={control} name="rating.percent" label="نسبة الترشيح %" min={0} max={100} />
          <NumberField control={control} name="rating.count" label="عدد التقييمات" min={0} />
        </div>
      </FormSection>
    </AdminForm>
  );
}
