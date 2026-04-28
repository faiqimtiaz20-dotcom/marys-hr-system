import { StatusPage } from "@/components/shared/status-page";

export default function ForbiddenPage() {
  return (
    <StatusPage
      code="403"
      title="Access denied"
      description="You do not have permission to view this module in the recruiting workspace."
    />
  );
}
