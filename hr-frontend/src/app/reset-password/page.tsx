import { AuthShell } from "@/components/shared/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Set a new password"
      description="Use a strong password to secure your recruiting account."
      form={<ResetPasswordForm />}
      footerLink={{ href: "/login", label: "Back to login" }}
    />
  );
}
