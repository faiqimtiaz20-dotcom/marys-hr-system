export type JobStatus = "draft" | "open" | "paused" | "closed";
export type EmploymentType = "full_time" | "part_time" | "contract" | "internship";

export interface JobItem {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  status: JobStatus;
  applicantsCount: number;
  createdAt: string;
  owner: string;
  salaryRange: string;
  experienceLevel: string;
}

export interface JobApplicationItem {
  id: string;
  candidateName: string;
  stage: "applied" | "screening" | "assessment" | "interview" | "offer";
  score: number;
  appliedAt: string;
}
