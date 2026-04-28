import { StatusPage } from "@/components/shared/status-page";

export default function ErrorPage500() {
  return (
    <StatusPage
      code="500"
      title="Something went wrong"
      description="The system encountered an unexpected issue while loading this page."
    />
  );
}
