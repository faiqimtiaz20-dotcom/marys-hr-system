import { StatusPage } from "@/components/shared/status-page";

export default function Page404() {
  return (
    <StatusPage
      code="404"
      title="Page not found"
      description="The route does not exist or has been moved."
    />
  );
}
