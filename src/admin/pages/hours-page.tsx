import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AdminForm } from "@/admin/components/admin-form";
import { TextField } from "@/admin/components/form-fields";
import { FormSection } from "@/admin/components/form-section";
import { PageHeader } from "@/admin/components/page-header";
import { QueryState } from "@/admin/components/query-state";
import { hoursSchema, type Hours } from "@/schemas/content";
import { useGetHours, useUpdateHours } from "@/services/hours";

export default function HoursPage() {
  const query = useGetHours();

  return (
    <>
      <PageHeader title="المواعيد" description="بتظهر بخط كبير في المربع الأحمر تحت صور الورشة." />
      <QueryState query={query}>{(hours) => <HoursForm hours={hours} />}</QueryState>
    </>
  );
}

function HoursForm({ hours }: { hours: Hours }) {
  const update = useUpdateHours();
  const form = useForm<Hours>({ resolver: zodResolver(hoursSchema), defaultValues: hours });
  const { control } = form;

  return (
    <AdminForm
      form={form}
      pending={update.isPending}
      onSubmit={(values) => update.mutate(values, { onSuccess: (saved) => form.reset(saved) })}
    >
      <FormSection title="مواعيد الشغل">
        <TextField control={control} name="title" label="العنوان" description="مثال: فاتحين كل يوم" />
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField control={control} name="from" label="من" description="مثال: من 11 الصبح" />
          <TextField control={control} name="to" label="لحد" description="مثال: لحد 10 بالليل" />
        </div>
        <TextField control={control} name="note" label="ملاحظة" description="اختياري. مثال: طول أيام الأسبوع" />
      </FormSection>
    </AdminForm>
  );
}
