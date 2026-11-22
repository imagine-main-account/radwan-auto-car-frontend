import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router";

import { TextField } from "@/admin/components/form-fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Toaster } from "@/components/ui/sonner";
import { brand } from "@/config/site";
import { USE_MOCK_API } from "@/lib/api";
import { authToken } from "@/lib/auth-token";
import { loginSchema, type LoginInput } from "@/schemas/content";
import { useLogin } from "@/services/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  if (authToken.get()) return <Navigate to="/admin" replace />;

  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/admin";
  const onSubmit = (values: LoginInput) =>
    login.mutate(values, { onSuccess: () => navigate(redirectTo, { replace: true }) });

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="justify-items-center text-center">
          <img src={brand.logo} alt={brand.name} width={600} height={320} className="mb-2 h-16 w-auto" />
          <CardTitle className="text-xl">لوحة التحكم</CardTitle>
          <CardDescription>سجّل دخول عشان تعدّل محتوى الموقع</CardDescription>
        </CardHeader>
        <CardContent>
          <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <TextField
                control={form.control}
                name="email"
                label="الإيميل"
                type="email"
                dir="ltr"
                autoComplete="username"
                autoFocus
              />
              <TextField
                control={form.control}
                name="password"
                label="كلمة السر"
                type="password"
                dir="ltr"
                autoComplete="current-password"
              />
              <Button type="submit" className="w-full" disabled={login.isPending}>
                {login.isPending ? <LoaderCircle className="animate-spin" /> : <LogIn />}
                دخول
              </Button>
            </FieldGroup>
          </form>

          {USE_MOCK_API && (
            <p className="mt-6 rounded-md bg-muted p-3 text-center text-xs leading-6 text-muted-foreground">
              نسخة تجريبية، ادخل بـ
              <br />
              <span dir="ltr">admin@radwan.com / admin123</span>
            </p>
          )}
        </CardContent>
      </Card>
      <Toaster position="top-center" />
    </main>
  );
}
