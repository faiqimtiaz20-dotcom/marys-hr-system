import { JobsList } from "@/components/jobs/jobs-list";

export default async function JobsPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const sp = await searchParams;
  return <JobsList simulateLoadError={sp.error === "1"} />;
}
