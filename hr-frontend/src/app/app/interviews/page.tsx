import { InterviewsList } from "@/components/interviews/interviews-list";

export default async function InterviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  return <InterviewsList simulateLoadError={sp.error === "1"} />;
}
