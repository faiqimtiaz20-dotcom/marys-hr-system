import { AuditLogsPage } from "@/components/audit/audit-logs-page";

export default async function AuditLogsRoutePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  return <AuditLogsPage simulateLoadError={sp.error === "1"} />;
}
