import { ScorecardForm } from "@/components/interviews/scorecard-form";

export default async function InterviewScorecardPage({
  params,
}: {
  params: Promise<{ interviewId: string }>;
}) {
  const { interviewId } = await params;
  return <ScorecardForm interviewId={interviewId} />;
}
