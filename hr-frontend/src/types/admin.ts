export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "invited" | "suspended";
}

export interface AuditLogItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  metadata: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface Invoice {
  id: string;
  period: string;
  amount: string;
  status: "paid" | "open";
  issuedAt: string;
}

export interface ProductUpdate {
  id: string;
  title: string;
  summary: string;
  releasedAt: string;
}

export const TEAM_ROLE_OPTIONS = [
  "Owner Admin",
  "HR Manager",
  "Recruiter",
  "Interviewer",
  "Analytics Viewer",
] as const;
