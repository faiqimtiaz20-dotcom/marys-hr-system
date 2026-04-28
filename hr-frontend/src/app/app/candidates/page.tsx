import { CandidateDirectory } from "@/components/candidates/candidate-directory";

export default async function CandidatesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  return <CandidateDirectory simulateLoadError={sp.error === "1"} />;
}
