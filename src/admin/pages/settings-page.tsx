import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";

import { TextField } from "@/admin/components/form-fields";
import { FormSection } from "@/admin/components/form-section";
import { PageHeader } from "@/admin/components/page-header";
import { Button } from "@/components/ui/button";
import { changePasswordSchema, type ChangePasswordInput } from "@/schemas/content";
import { useChangePassword } from "@/services/auth";

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="الحساب" />
      <ChangePasswordForm />
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
