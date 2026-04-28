import type { UserRole } from "@/types/auth";

/** Directory user aligned with blueprint `User` (mock org roster). */
export type OrgUserStatus = "active" | "invited" | "suspended";

export interface OrgUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  status: OrgUserStatus;
}

/** Point-in-time hiring snapshot for dashboards / exports (mock). */
export interface AnalyticsSnapshot {
  id: string;
  capturedAt: string;
  rangeLabel: string;
  newApplicants: number;
  interviewsScheduled: number;
  offersExtended: number;
  hires: number;
  activeOpenJobs: number;
}
