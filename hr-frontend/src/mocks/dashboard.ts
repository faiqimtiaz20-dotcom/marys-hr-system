export type DashboardKpi = {
  key: string;
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
};

export type FunnelPoint = {
  stage: string;
  count: number;
};

export type SourcePoint = {
  source: string;
  quality: number;
};

export type VelocityPoint = {
  week: string;
  hires: number;
};

export type UpcomingInterview = {
  id: string;
  candidate: string;
  role: string;
  interviewer: string;
  time: string;
};

export type ActivityItem = {
  id: string;
  actor: string;
  action: string;
  time: string;
};

export type RecruiterLoad = {
  id: string;
  name: string;
  openJobs: number;
  activeCandidates: number;
};

export const dashboardKpis: DashboardKpi[] = [
  { key: "active_jobs", label: "Active jobs", value: "24", delta: "+4.2%", trend: "up" },
  { key: "new_applicants", label: "New applicants (7d)", value: "182", delta: "+11.8%", trend: "up" },
  { key: "interviews_today", label: "Interviews today", value: "17", delta: "-2.4%", trend: "down" },
  { key: "offers_sent", label: "Offers sent", value: "9", delta: "+6.5%", trend: "up" },
  { key: "hires_month", label: "Hires this month", value: "14", delta: "+8.9%", trend: "up" },
];

export const funnelData: FunnelPoint[] = [
  { stage: "Applied", count: 280 },
  { stage: "Screening", count: 190 },
  { stage: "Assessment", count: 124 },
  { stage: "Interview", count: 88 },
  { stage: "Offer", count: 34 },
  { stage: "Hired", count: 16 },
];

export const sourceData: SourcePoint[] = [
  { source: "Referral", quality: 84 },
  { source: "LinkedIn", quality: 71 },
  { source: "Career Page", quality: 66 },
  { source: "Agency", quality: 58 },
];

export const velocityData: VelocityPoint[] = [
  { week: "W1", hires: 2 },
  { week: "W2", hires: 3 },
  { week: "W3", hires: 4 },
  { week: "W4", hires: 5 },
  { week: "W5", hires: 4 },
  { week: "W6", hires: 6 },
];

export const upcomingInterviews: UpcomingInterview[] = [
  { id: "int_1", candidate: "Areeba Khan", role: "Senior Recruiter", interviewer: "Mary J.", time: "09:30 AM" },
  { id: "int_2", candidate: "Sami Ullah", role: "Product Designer", interviewer: "Hira N.", time: "11:00 AM" },
  { id: "int_3", candidate: "Noor Fatima", role: "Frontend Engineer", interviewer: "Ali R.", time: "02:15 PM" },
];

export const activityTimeline: ActivityItem[] = [
  { id: "act_1", actor: "Areej", action: "moved Bilal to Interview stage", time: "12 min ago" },
  { id: "act_2", actor: "Hira", action: "scheduled panel interview for Noor", time: "28 min ago" },
  { id: "act_3", actor: "Mary", action: "published Backend Engineer role", time: "1 hr ago" },
  { id: "act_4", actor: "Ali", action: "submitted scorecard for Sami", time: "2 hr ago" },
];

export const recruiterWorkload: RecruiterLoad[] = [
  { id: "r1", name: "Areej Malik", openJobs: 6, activeCandidates: 41 },
  { id: "r2", name: "Hira Shah", openJobs: 5, activeCandidates: 36 },
  { id: "r3", name: "Ali Rehman", openJobs: 4, activeCandidates: 30 },
];
