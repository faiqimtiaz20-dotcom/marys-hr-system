import { mockInterviews } from "@/mocks/interviews";
import { mockScorecardRecords } from "@/mocks/scorecards";
import { InterviewItem, InterviewStatus, Scorecard, ScorecardRecord } from "@/types/interviews";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getInterviews(): Promise<InterviewItem[]> {
  await wait(300);
  return mockInterviews;
}

export async function getInterviewById(interviewId: string): Promise<InterviewItem | null> {
  await wait(250);
  return mockInterviews.find((item) => item.id === interviewId) ?? null;
}

export async function updateInterviewStatus(
  interviewId: string,
  status: InterviewStatus,
): Promise<{ success: boolean; message: string }> {
  await wait(350);
  const exists = mockInterviews.some((item) => item.id === interviewId);
  if (!exists) return { success: false, message: "Interview not found." };
  return { success: true, message: `Interview marked as ${status}.` };
}

export async function scheduleInterview(): Promise<{ success: boolean; message: string }> {
  await wait(450);
  return { success: true, message: "Interview scheduled and invite sent (mock)." };
}

export async function submitScorecard(scorecard: Scorecard): Promise<{ success: boolean; message: string }> {
  await wait(500);
  if (!scorecard.recommendation) return { success: false, message: "Recommendation is required." };
  return { success: true, message: "Scorecard submitted successfully." };
}

export async function getScorecardRecordsForInterview(interviewId: string): Promise<ScorecardRecord[]> {
  await wait(200);
  return mockScorecardRecords.filter((row) => row.interviewId === interviewId);
}
