import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { AnalyticsControls } from "@/components/analytics/analytics-controls";

const reports = [
  {
    title: "Funnel Analytics",
    href: "/app/analytics/funnel",
    summary: "Track stage conversion, drop-off rates, and median stage duration.",
  },
  {
    title: "Recruiter Performance",
    href: "/app/analytics/recruiter-performance",
    summary: "Monitor recruiter output, response time, and hiring contribution.",
  },
  {
    title: "Time to Hire",
    href: "/app/analytics/time-to-hire",
    summary: "Analyze average time-to-fill and identify stage bottlenecks.",
  },
  {
    title: "Source Quality",
    href: "/app/analytics/source-quality",
    summary: "Compare source-level candidate quality and hire conversion.",
  },
  {
    title: "Offer Acceptance",
    href: "/app/analytics/offer-acceptance",
    summary: "Track offer acceptance trend and conversion to hires.",
  },
];

export function AnalyticsHub() {
  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Milestone 8"
        title="Analytics Hub"
        description="Review hiring outcomes with report-specific views and global controls."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/app", label: "App" },
          { label: "Analytics" },
        ]}
      />
      <AnalyticsControls />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => (
          <Link
            key={report.href}
            href={report.href}
            className="rounded-2xl border bg-surface p-4 transition hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <p className="text-sm font-semibold">{report.title}</p>
            <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-300">{report.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
