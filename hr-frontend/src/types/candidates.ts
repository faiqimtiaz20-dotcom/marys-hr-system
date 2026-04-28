export type CandidateStage =
  | "applied"
  | "screening"
  | "assessment"
  | "interview"
  | "offer"
  | "hired"
  | "rejected";

export interface CandidateItem {
  id: string;
  name: string;
  email: string;
  title: string;
  experience: string;
  location: string;
  skills: string[];
  status: "active" | "on_hold" | "hired";
  source: "linkedin" | "referral" | "career_page" | "agency" | "other";
  currentStage: CandidateStage;
  assignedRecruiter: string;
  talentPool: "engineering" | "product" | "hr" | "operations";
  tags: string[];
}

export interface ApplicationItem {
  id: string;
  candidateId: string;
  jobId: string;
  candidateName: string;
  jobTitle: string;
  stage: CandidateStage;
  source: CandidateItem["source"];
  score: number;
  appliedDate: string;
  assignedRecruiter: string;
  slaStatus: "on_track" | "at_risk" | "overdue";
}
