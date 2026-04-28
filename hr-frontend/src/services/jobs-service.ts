import { mockJobApplications, mockJobs } from "@/mocks/jobs";
import { JobApplicationItem, JobItem } from "@/types/jobs";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getJobs(): Promise<JobItem[]> {
  await wait(450);
  return mockJobs;
}

export async function getJobById(jobId: string): Promise<JobItem | null> {
  await wait(300);
  return mockJobs.find((job) => job.id === jobId) ?? null;
}

export async function getJobApplications(jobId: string): Promise<JobApplicationItem[]> {
  await wait(300);
  return mockJobApplications[jobId] ?? [];
}

export async function saveJob(values: Record<string, unknown>): Promise<{ success: boolean; message: string }> {
  await wait(700);
  if (!values.title || !values.department) {
    return { success: false, message: "Title and department are required." };
  }
  return { success: true, message: "Job saved successfully." };
}
