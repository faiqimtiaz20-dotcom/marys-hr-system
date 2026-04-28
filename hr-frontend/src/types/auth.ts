export type UserRole = "owner_admin" | "hr_manager" | "recruiter" | "interviewer" | "viewer_analytics";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  companyName: string;
  role: UserRole;
  invited?: boolean;
}

export interface AuthResult {
  success: boolean;
  message: string;
}
