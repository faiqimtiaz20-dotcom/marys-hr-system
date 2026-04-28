import { AuthShell } from "@/components/shared/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Sign in with your work email to access jobs, pipeline, interviews, and team settings in one secure workspace."
      features={[]}
      form={<LoginForm />}
      footerLink={{ href: "/verify-otp", label: "Verify with OTP instead" }}
      footerEndLink={null}
    />
  );
}
