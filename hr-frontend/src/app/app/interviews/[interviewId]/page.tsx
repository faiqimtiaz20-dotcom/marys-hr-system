import { InterviewDetail } from "@/components/interviews/interview-detail";

export default async function InterviewDetailPage({
  params,
}: {
  params: Promise<{ interviewId: string }>;
}) {
  const { interviewId } = await params;
  return <InterviewDetail interviewId={interviewId} />;
}
