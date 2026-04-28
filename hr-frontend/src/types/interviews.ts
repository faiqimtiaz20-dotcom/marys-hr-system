export type InterviewStatus = "scheduled" | "completed" | "cancelled";
export type InterviewType = "screening" | "technical" | "behavioral" | "managerial" | "final";

export interface InterviewItem {
  id: string;
  candidateName: string;
  jobTitle: string;
  interviewer: string;
  type: InterviewType;
  startAt: string;
  endAt: string;
  status: InterviewStatus;
  notes: string;
}

export interface Scorecard {
  interviewId: string;
  communication: number;
  problemSolving: number;
  technicalDepth: number;
  cultureFit: number;
  recommendation: "hire" | "no_hire" | "hold";
  comments: string;
}

/** Persisted scorecard row for mock history / audit. */
export interface ScorecardRecord extends Scorecard {
  id: string;
  submittedAt: string;
  interviewerName: string;
}
