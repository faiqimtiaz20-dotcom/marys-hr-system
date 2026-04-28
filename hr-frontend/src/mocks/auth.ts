import { AuthUser, UserRole } from "@/types/auth";

export const roleOptions: Array<{ value: UserRole; label: string; note: string }> = [
  { value: "owner_admin", label: "Owner Admin", note: "Full platform ownership and billing control." },
  { value: "hr_manager", label: "HR Manager", note: "Owns hiring workflows and team coordination." },
  { value: "recruiter", label: "Recruiter", note: "Manages candidates, jobs, and outreach." },
  { value: "interviewer", label: "Interviewer", note: "Participates in interviews and scorecards." },
  { value: "viewer_analytics", label: "Analytics Viewer", note: "Read-only access to reports and insights." },
];

export const mockUsers: AuthUser[] = [
  {
    id: "usr_001",
    fullName: "Admin User",
    email: "admin@maryshr.com",
    companyName: "Marys HR Online Services",
    role: "owner_admin",
  },
  {
    id: "usr_002",
    fullName: "Fatima Khan",
    email: "hr.manager@maryshr.com",
    companyName: "Marys HR Online Services",
    role: "hr_manager",
  },
  {
    id: "usr_003",
    fullName: "Ali Hassan",
    email: "interviewer@maryshr.com",
    companyName: "Marys HR Online Services",
    role: "interviewer",
  },
  {
    id: "usr_004",
    fullName: "Ahmad Rehman",
    email: "ahmad.recruiter@maryshr.com",
    companyName: "Marys HR Online Services",
    role: "recruiter",
  },
];

export const mockOtpCode = "123456";
