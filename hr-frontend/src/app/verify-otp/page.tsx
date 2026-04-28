import { AuthShell } from "@/components/shared/auth-shell";
import { VerifyOtpForm } from "@/components/auth/verify-otp-form";

export default function VerifyOtpPage() {
  return (
    <AuthShell
      title="Confirm one-time passcode"
      description="Enter the six-digit code to complete secure sign in."
      form={<VerifyOtpForm />}
      footerLink={{ href: "/login", label: "Back to login" }}
    />
  );
}
