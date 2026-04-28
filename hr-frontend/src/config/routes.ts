export type AppRouteItem = {
  href: string;
  title: string;
  description: string;
};

export const protectedRouteCatalog: AppRouteItem[] = [
  { href: "/app", title: "Dashboard", description: "Overview metrics and hiring activity." },
  { href: "/app/jobs", title: "Jobs", description: "Manage all job postings and statuses." },
  { href: "/app/jobs/create", title: "Create Job", description: "Publish a new role opening." },
  { href: "/app/jobs/[jobId]", title: "Job Detail", description: "Track job-level performance and applicants." },
  { href: "/app/jobs/[jobId]/edit", title: "Edit Job", description: "Update role details and workflow." },
  { href: "/app/applications", title: "Applications", description: "Review and filter all incoming applications." },
  { href: "/app/pipeline", title: "Pipeline", description: "Drag and manage candidate stages." },
  { href: "/app/candidates", title: "Candidates", description: "Browse talent profiles and history." },
  { href: "/app/candidates/[candidateId]", title: "Candidate Profile", description: "Inspect a candidate profile and activity." },
  { href: "/app/interviews", title: "Interviews", description: "Calendar and agenda for interview scheduling." },
  { href: "/app/interviews/schedule", title: "Schedule Interview", description: "Plan interview events and panel members." },
  { href: "/app/interviews/[interviewId]", title: "Interview Detail", description: "Track event details and participants." },
  { href: "/app/interviews/[interviewId]/scorecard", title: "Scorecard", description: "Submit evaluation scores and recommendation." },
  { href: "/app/question-bank", title: "Question Bank", description: "Maintain interview questions by competency." },
  { href: "/app/analytics", title: "Analytics", description: "View hiring insights and trend snapshots." },
  { href: "/app/analytics/funnel", title: "Funnel Analytics", description: "Analyze stage conversion and drop-offs." },
  { href: "/app/analytics/recruiter-performance", title: "Recruiter Performance", description: "Compare recruiter productivity metrics." },
  { href: "/app/analytics/time-to-hire", title: "Time to Hire", description: "Identify process speed and bottlenecks." },
  { href: "/app/messages", title: "Messages", description: "Conversation workspace and templates." },
  { href: "/app/documents", title: "Documents", description: "Recruitment assets and document previews." },
  { href: "/app/team", title: "Team", description: "Manage members, invitations, and role mapping." },
  { href: "/app/settings/profile", title: "Profile Settings", description: "Update account profile and preferences." },
  { href: "/app/settings/company", title: "Company Settings", description: "Control company-level recruiting defaults." },
  { href: "/app/settings/roles-permissions", title: "Roles & Permissions", description: "Define access across modules." },
  { href: "/app/settings/notifications", title: "Notification Settings", description: "Configure delivery preferences." },
  { href: "/app/settings/billing", title: "Billing", description: "Manage subscription details and invoices." },
  { href: "/app/audit-logs", title: "Audit Logs", description: "Review system actions and traceability." },
  { href: "/app/help-center", title: "Help Center", description: "FAQ and support resources." },
  { href: "/app/ui-foundation", title: "UI Foundation", description: "Design tokens and reusable primitive previews." },
];

export const publicAuthRoutes: AppRouteItem[] = [
  { href: "/login", title: "Login", description: "Sign in to access recruiting workspace." },
  { href: "/signup", title: "Sign Up", description: "Create an account for your organization." },
  { href: "/role-select", title: "Role Selection", description: "Select your primary user role before onboarding." },
  { href: "/onboarding", title: "Onboarding", description: "Configure workspace profile and hiring preferences." },
  { href: "/forgot-password", title: "Forgot Password", description: "Recover account credentials." },
  { href: "/reset-password", title: "Reset Password", description: "Set a secure new password." },
  { href: "/verify-otp", title: "Verify OTP", description: "Confirm one-time passcode." },
  { href: "/invitation/accept", title: "Accept Invitation", description: "Activate invited team access." },
];

/** Default destination after successful mock sign-in (email or SSO). */
export const postLoginRedirectPath = "/app";
