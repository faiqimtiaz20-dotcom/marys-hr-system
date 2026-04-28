import type { UserRole } from "@/types/auth";

const STORAGE_KEY = "hr-mock-user-role";

const roles: UserRole[] = ["owner_admin", "hr_manager", "recruiter", "interviewer", "viewer_analytics"];

function isUserRole(value: string | null): value is UserRole {
  return value !== null && roles.includes(value as UserRole);
}

export function getStoredMockRole(): UserRole {
  if (typeof window === "undefined") return "owner_admin";
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return isUserRole(raw) ? raw : "owner_admin";
}

export function setStoredMockRole(role: UserRole): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, role);
}

export const MOCK_ROLE_STORAGE_KEY = STORAGE_KEY;
