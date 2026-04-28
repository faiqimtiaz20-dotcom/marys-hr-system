"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { UserRole } from "@/types/auth";
import { getStoredMockRole, setStoredMockRole } from "@/lib/mock-session";

type MockAuthContextValue = {
  role: UserRole;
  setRole: (role: UserRole) => void;
};

const MockAuthContext = createContext<MockAuthContextValue | null>(null);

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("owner_admin");

  useEffect(() => {
    setRoleState(getStoredMockRole());
  }, []);

  const setRole = useCallback((next: UserRole) => {
    setStoredMockRole(next);
    setRoleState(next);
  }, []);

  const value = useMemo(() => ({ role, setRole }), [role, setRole]);

  return <MockAuthContext.Provider value={value}>{children}</MockAuthContext.Provider>;
}

export function useMockAuth(): MockAuthContextValue {
  const ctx = useContext(MockAuthContext);
  if (!ctx) {
    throw new Error("useMockAuth must be used within MockAuthProvider");
  }
  return ctx;
}
