import { OnboardingWizard } from "@/components/auth/onboarding-wizard";

export default function OnboardingPage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background p-6 md:p-10">
      <OnboardingWizard />
    </main>
  );
}
