"use client";

import type { UserRole } from "@/types/auth";
import { useMockAuth } from "@/contexts/mock-auth-context";

const options: Array<{ value: UserRole; label: string }> = [
  { value: "owner_admin", label: "Owner admin" },
  { value: "hr_manager", label: "HR manager" },
  { value: "recruiter", label: "Recruiter" },
  { value: "interviewer", label: "Interviewer" },
  { value: "viewer_analytics", label: "Analytics viewer" },
];

export function MockRoleSwitcher() {
  const { role, setRole } = useMockAuth();

  return (
    <label className="hidden items-center gap-1.5 sm:inline-flex">
      <span className="hidden text-[11px] font-medium text-zinc-600 dark:text-zinc-300 md:inline">Mock role</span>
      <select
        className="h-9 max-w-[10.5rem] rounded-lg border bg-surface px-2 text-xs outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
        value={role}
        onChange={(event) => setRole(event.target.value as UserRole)}
        aria-label="Mock user role for permission preview"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
