import type { UserRole } from "@/types/auth";

/**
 * Mock route access rules (blueprint §4).
 * `owner_admin` and `hr_manager` may access all `/app` routes.
 */
export function normalizeAppPath(pathname: string): string {
  const path = pathname.split("?")[0] ?? pathname;
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

export function canAccessPath(role: UserRole, pathname: string): boolean {
  const path = normalizeAppPath(pathname);

  if (role === "owner_admin" || role === "hr_manager") {
    return path.startsWith("/app");
  }

  if (role === "viewer_analytics") {
    if (path === "/app") return true;
    if (path.startsWith("/app/analytics")) return true;
    if (path === "/app/help-center") return true;
    if (path === "/app/settings/profile") return true;
    if (path === "/app/ui-foundation") return true;
    return false;
  }

  if (role === "interviewer") {
    if (path === "/app") return true;
    if (path.startsWith("/app/interviews")) return true;
    if (path.startsWith("/app/candidates")) return true;
    if (path === "/app/pipeline") return true;
    if (path === "/app/applications") return true;
    if (path === "/app/help-center") return true;
    if (path.startsWith("/app/settings/profile")) return true;
    if (path === "/app/ui-foundation" || path.startsWith("/app/ui-foundation/")) return true;
    return false;
  }

  if (role === "recruiter") {
    const blocked = [
      "/app/settings/billing",
      "/app/audit-logs",
      "/app/team",
      "/app/settings/roles-permissions",
    ];
    if (blocked.some((b) => path === b || path.startsWith(`${b}/`))) return false;
    return path.startsWith("/app");
  }

  return path.startsWith("/app");
}

export function routeRequiresElevatedAccess(pathname: string): boolean {
  const path = normalizeAppPath(pathname);
  return (
    path.startsWith("/app/settings/billing") ||
    path.startsWith("/app/audit-logs") ||
    path.startsWith("/app/team") ||
    path.startsWith("/app/settings/roles-permissions")
  );
}
