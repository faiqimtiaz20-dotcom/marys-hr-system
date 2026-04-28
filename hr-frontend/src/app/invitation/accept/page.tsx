import { AuthShell } from "@/components/shared/auth-shell";
import { AcceptInvitationForm } from "@/components/auth/accept-invitation-form";

export default function AcceptInvitationPage() {
  return (
    <AuthShell
      title="Accept team invitation"
      description="Activate your invited access and continue to your assigned workspace."
      form={<AcceptInvitationForm />}
      footerLink={{ href: "/login", label: "Already activated? Login" }}
    />
  );
}
