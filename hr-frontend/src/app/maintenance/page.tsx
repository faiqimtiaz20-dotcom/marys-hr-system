import { StatusPage } from "@/components/shared/status-page";

export default function MaintenancePage() {
  return (
    <StatusPage
      code="Maintenance"
      title="Scheduled maintenance"
      description="The recruiting platform is temporarily unavailable while improvements are being deployed."
    />
  );
}
