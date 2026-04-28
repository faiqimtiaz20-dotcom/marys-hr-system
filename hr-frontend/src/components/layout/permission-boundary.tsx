"use client";

import { usePathname } from "next/navigation";
import { useMemo, type ReactNode } from "react";
import { canAccessPath, normalizeAppPath } from "@/config/permissions";
import { useMockAuth } from "@/contexts/mock-auth-context";
import { PermissionDenied } from "@/components/shared/permission-denied";

export function PermissionBoundary({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { role } = useMockAuth();

  const allowed = useMemo(() => canAccessPath(role, pathname), [role, pathname]);

  if (!allowed) {
    const path = normalizeAppPath(pathname);
    return (
      <PermissionDenied
        message={`Your current mock role (“${role.replace(/_/g, " ")}”) cannot open ${path}.`}
      />
    );
  }

  return <>{children}</>;
}
