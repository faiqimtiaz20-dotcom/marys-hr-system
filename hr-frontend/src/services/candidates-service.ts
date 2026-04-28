import { mockApplications } from "@/mocks/applications";
import { mockCandidates } from "@/mocks/candidates";
import { ApplicationItem, CandidateItem, CandidateStage } from "@/types/candidates";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getCandidates(): Promise<CandidateItem[]> {
  await wait(350);
  return mockCandidates;
}

export async function getCandidateById(candidateId: string): Promise<CandidateItem | null> {
  await wait(250);
  return mockCandidates.find((candidate) => candidate.id === candidateId) ?? null;
}

export async function getApplications(): Promise<ApplicationItem[]> {
  await wait(350);
  return mockApplications;
}

export async function updateCandidateStage(
  candidateId: string,
  stage: CandidateStage,
): Promise<{ success: boolean; message: string }> {
  await wait(500);
  const exists = mockCandidates.some((candidate) => candidate.id === candidateId);
  if (!exists) {
    return { success: false, message: "Candidate not found." };
  }
  return { success: true, message: `Candidate moved to ${stage} stage.` };
}
