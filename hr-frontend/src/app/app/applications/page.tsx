import { ApplicationsList } from "@/components/applications/applications-list";

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  return <ApplicationsList simulateLoadError={sp.error === "1"} />;
}
