import { AppShell } from "@/components/layout/app-shell";
import { PermissionBoundary } from "@/components/layout/permission-boundary";
import { MockAuthProvider } from "@/contexts/mock-auth-context";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MockAuthProvider>
      <AppShell>
        <PermissionBoundary>{children}</PermissionBoundary>
      </AppShell>
    </MockAuthProvider>
  );
}
