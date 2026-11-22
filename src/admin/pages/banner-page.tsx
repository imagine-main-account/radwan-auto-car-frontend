import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type Control } from "react-hook-form";

import { AdminForm } from "@/admin/components/admin-form";
import { DateField, SelectField, SwitchField, TextareaField } from "@/admin/components/form-fields";
import { FormSection } from "@/admin/components/form-section";
import { PageHeader } from "@/admin/components/page-header";
import { QueryState } from "@/admin/components/query-state";
import { AnnouncementBanner } from "@/components/layout/announcement-banner";
import { Badge } from "@/components/ui/badge";
import { isBannerActive } from "@/lib/banner";
import { bannerSchema, type Banner } from "@/schemas/content";
import { useGetBanner, useUpdateBanner } from "@/services/banner";

const variantOptions = [
  { value: "info", label: "رمادي هادي (معلومة)" },
  { value: "warning", label: "أحمر ملفت (تنبيه مهم)" },
];

export default function BannerPage() {
  const query = useGetBanner();

  return (
    <>
      <PageHeader title="شريط الإعلان" description="رسالة قصيرة بتظهر فوق الصفحة: أجازة، تغيير مواعيد، أو عرض." />
      <QueryState query={query}>{(banner) => <BannerForm banner={banner} />}</QueryState>
    </>
  );
}

function BannerForm({ banner }: { banner: Banner }) {
  const update = useUpdateBanner();
  const form = useForm<Banner>({ resolver: zodResolver(bannerSchema), defaultValues: banner });
  const { control } = form;

  return (
    <AdminForm
      form={form}
      pending={update.isPending}
      onSubmit={(values) => update.mutate(values, { onSuccess: (saved) => form.reset(saved) })}
    >
      <FormSection title="الإعلان">
        <SwitchField control={control} name="enabled" label="إظهار الشريط في الصفحة" />
        <TextareaField
          control={control}
          name="text"
          label="نص الإعلان"
          rows={2}
          counter={160}
          description="مثال: مقفولين أول وتاني يوم العيد، وراجعين يوم 3"
        />
        <SelectField control={control} name="variant" label="اللون" options={variantOptions} />
        <DateField
          control={control}
          name="endsAt"
          label="آخر يوم يظهر فيه"
          description="الشريط هيختفي لوحده بعد اليوم ده. سيبه فاضي لو مالوش نهاية."
        />
      </FormSection>

      <BannerPreview control={control} />
    </AdminForm>
  );
}

function BannerPreview({ control }: { control: Control<Banner> }) {
  const [enabled, text, variant, endsAt] = useWatch({ control, name: ["enabled", "text", "variant", "endsAt"] });
  const active = isBannerActive({ enabled, text: text.trim(), variant, endsAt });

  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold">معاينة</h2>
        <Badge variant={active ? "default" : "secondary"}>{active ? "هيظهر في الصفحة" : "مش هيظهر"}</Badge>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <AnnouncementBanner banner={{ variant, text: text || "نص الإعلان هيظهر هنا" }} />
        <div className="h-16 bg-background" />
      </div>
    </div>
  );
}
