import { AuthShell } from "@/components/shared/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your recruiting workspace"
      description="Set up your organization and invite your team with the onboarding flow."
      form={<SignupForm />}
      footerLink={{ href: "/login", label: "Already have account? Login" }}
    />
  );
}
