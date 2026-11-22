import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { DatabaseBackup, KeyRound, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ConfirmDialog } from "@/admin/components/confirm-dialog";
import { TextField } from "@/admin/components/form-fields";
import { FormSection } from "@/admin/components/form-section";
import { PageHeader } from "@/admin/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { USE_MOCK_API } from "@/lib/api";
import { changePasswordSchema, type ChangePasswordInput } from "@/schemas/content";
import { useChangePassword } from "@/services/auth";

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="الحساب" />
      <div className="grid gap-6">
        <ChangePasswordForm />
        {USE_MOCK_API && <ResetMockData />}
      </div>
    </>
  );
}

function ChangePasswordForm() {
  const changePassword = useChangePassword();
  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });
  const { control } = form;

  const onSubmit = (values: ChangePasswordInput) => changePassword.mutate(values, { onSuccess: () => form.reset() });

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <FormSection title="تغيير كلمة السر">
        <TextField
          control={control}
          name="currentPassword"
          label="كلمة السر الحالية"
          type="password"
          dir="ltr"
          autoComplete="current-password"
        />
        <TextField
          control={control}
          name="newPassword"
          label="كلمة السر الجديدة"
          type="password"
          dir="ltr"
          autoComplete="new-password"
          description="8 حروف على الأقل"
        />
        <TextField
          control={control}
          name="confirmPassword"
          label="اكتب كلمة السر الجديدة تاني"
          type="password"
          dir="ltr"
          autoComplete="new-password"
        />
        <Button type="submit" className="w-fit" disabled={changePassword.isPending}>
          {changePassword.isPending ? <LoaderCircle className="animate-spin" /> : <KeyRound />}
          غيّر كلمة السر
        </Button>
      </FormSection>
    </form>
  );
}

/** Mock mode only: throw away local edits and go back to the JSON files in public/mock-api. */
function ResetMockData() {
  const queryClient = useQueryClient();

  const reset = async () => {
    const { resetMockData } = await import("@/lib/mock-api");
    resetMockData();
    await queryClient.invalidateQueries();
    toast.success("رجعت البيانات التجريبية زي الأول");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>البيانات التجريبية</CardTitle>
        <CardDescription>
          الموقع شغال دلوقتي على API تجريبي، والتعديلات متسجلة في المتصفح ده بس. تقدر ترجّع كل حاجة زي الأول.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <ConfirmDialog
          title="ترجّع كل البيانات زي الأول؟"
          description="كل التعديلات اللي عملتها هتتمسح، وكلمة السر هترجع admin123."
          confirmLabel="رجّع البيانات"
          onConfirm={reset}
          trigger={
            <Button variant="outline">
              <DatabaseBackup />
              رجّع البيانات التجريبية
            </Button>
          }
        />
      </CardFooter>
    </Card>
  );
}
