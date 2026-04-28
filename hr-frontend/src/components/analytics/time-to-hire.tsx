import { PageHeader } from "@/components/shared/page-header";
import { AnalyticsControls } from "@/components/analytics/analytics-controls";
import { timeToHireData } from "@/mocks/analytics";

export function TimeToHireAnalytics() {
  const avgTimeToFill = Math.round(
    timeToHireData.reduce((acc, row) => acc + row.avgTimeToFill, 0) / timeToHireData.length,
  );
  const avgStageDays = (
    timeToHireData.reduce((acc, row) => acc + row.avgStageDays, 0) / timeToHireData.length
  ).toFixed(1);

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Milestone 8"
        title="Time to Hire"
        description="Track time-to-fill performance and identify bottleneck stages by role."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/app", label: "App" },
          { href: "/app/analytics", label: "Analytics" },
          { label: "Time to Hire" },
        ]}
      />
      <AnalyticsControls />
      <div className="grid gap-3 md:grid-cols-2">
        <article className="rounded-2xl border bg-surface p-4">
          <p className="text-xs text-zinc-500">Average time to fill</p>
          <p className="mt-1 text-2xl font-semibold">{avgTimeToFill} days</p>
        </article>
        <article className="rounded-2xl border bg-surface p-4">
          <p className="text-xs text-zinc-500">Average time in stage</p>
          <p className="mt-1 text-2xl font-semibold">{avgStageDays} days</p>
        </article>
      </div>
      <div className="overflow-hidden rounded-2xl border bg-surface">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
          <thead className="bg-surface-muted text-left">
            <tr>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Avg Time to Fill</th>
              <th className="px-4 py-3">Avg Stage Days</th>
              <th className="px-4 py-3">Bottleneck Stage</th>
            </tr>
          </thead>
          <tbody>
            {timeToHireData.map((row) => (
              <tr key={row.role} className="border-t">
                <td className="px-4 py-3">{row.role}</td>
                <td className="px-4 py-3">{row.avgTimeToFill} days</td>
                <td className="px-4 py-3">{row.avgStageDays} days</td>
                <td className="px-4 py-3">{row.bottleneck}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </section>
  );
}
