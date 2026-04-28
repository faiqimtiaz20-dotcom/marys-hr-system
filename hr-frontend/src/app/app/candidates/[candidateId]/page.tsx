import { CandidateProfile } from "@/components/candidates/candidate-profile";

export default async function CandidateProfilePage({
  params,
}: {
  params: Promise<{ candidateId: string }>;
}) {
  const { candidateId } = await params;
  return <CandidateProfile candidateId={candidateId} />;
}
