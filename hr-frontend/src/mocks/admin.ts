import { AuditLogItem, FaqItem, Invoice, ProductUpdate, TeamMember } from "@/types/admin";

export const mockTeamMembers: TeamMember[] = [
  { id: "tm_001", name: "Mary Johnson", email: "mary@maryshr.com", role: "Owner Admin", status: "active" },
  { id: "tm_002", name: "Areej Malik", email: "areej@maryshr.com", role: "Recruiter", status: "active" },
  { id: "tm_003", name: "Hira Shah", email: "hira@maryshr.com", role: "HR Manager", status: "active" },
  { id: "tm_004", name: "Ali Rehman", email: "ali@maryshr.com", role: "Interviewer", status: "invited" },
];

export const mockAuditLogs: AuditLogItem[] = [
  {
    id: "log_001",
    actor: "Mary Johnson",
    action: "updated role permissions",
    target: "roles-permissions",
    timestamp: "2026-04-27 10:22",
    metadata: "role=Recruiter, permission=analytics:view",
  },
  {
    id: "log_002",
    actor: "Hira Shah",
    action: "created job",
    target: "Backend Engineer",
    timestamp: "2026-04-27 09:14",
    metadata: "department=Engineering",
  },
  {
    id: "log_003",
    actor: "Areej Malik",
    action: "scheduled interview",
    target: "Noor Fatima",
    timestamp: "2026-04-26 16:40",
    metadata: "type=technical",
  },
];

export const mockInvoices: Invoice[] = [
  { id: "inv_001", period: "April 2026", amount: "$499.00", status: "paid", issuedAt: "2026-04-01" },
  { id: "inv_002", period: "March 2026", amount: "$499.00", status: "paid", issuedAt: "2026-03-01" },
  { id: "inv_003", period: "February 2026", amount: "$499.00", status: "paid", issuedAt: "2026-02-01" },
  { id: "inv_004", period: "May 2026", amount: "$499.00", status: "open", issuedAt: "2026-04-27" },
];

export const mockProductUpdates: ProductUpdate[] = [
  {
    id: "pu_001",
    title: "Analytics export improvements",
    summary: "CSV and PDF exports now include applied filters and date range in the filename.",
    releasedAt: "2026-04-20",
  },
  {
    id: "pu_002",
    title: "Interview room status panel",
    summary: "Pre-check, live, and summary states are available on interview detail for better coordination.",
    releasedAt: "2026-04-15",
  },
];

export const mockFaqs: FaqItem[] = [
  {
    id: "faq_001",
    question: "How do I invite a recruiter?",
    answer: "Go to Team, click Invite Member, assign role, and send invitation.",
  },
  {
    id: "faq_002",
    question: "How can I export analytics?",
    answer: "Open Analytics reports and use Export CSV or Export PDF controls.",
  },
  {
    id: "faq_003",
    question: "How do I adjust role permissions?",
    answer: "Navigate to Settings > Roles & Permissions and update capability matrix.",
  },
];
