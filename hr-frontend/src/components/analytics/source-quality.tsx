"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { AnalyticsControls } from "@/components/analytics/analytics-controls";
import { sourceQualityData } from "@/mocks/analytics";

export function SourceQualityAnalytics() {
  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Milestone 8"
        title="Source Quality"
        description="Compare source-level candidate quality and conversion outcomes."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/app", label: "App" },
          { href: "/app/analytics", label: "Analytics" },
          { label: "Source Quality" },
        ]}
      />
      <AnalyticsControls />
      <div className="grid gap-3 xl:grid-cols-2">
        <article className="rounded-2xl border bg-surface p-4">
          <p className="text-sm font-semibold">Average Candidate Score</p>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceQualityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                <XAxis dataKey="source" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="avgScore" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
        <article className="rounded-2xl border bg-surface p-4">
          <p className="text-sm font-semibold">Hire Rate by Source</p>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceQualityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                <XAxis dataKey="source" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="hireRate" fill="#14b8a6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>
      <div className="overflow-hidden rounded-2xl border bg-surface">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
          <thead className="bg-surface-muted text-left">
            <tr>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Avg Score</th>
              <th className="px-4 py-3">Interview Rate %</th>
              <th className="px-4 py-3">Offer Rate %</th>
              <th className="px-4 py-3">Hire Rate %</th>
            </tr>
          </thead>
          <tbody>
            {sourceQualityData.map((row) => (
              <tr key={row.source} className="border-t">
                <td className="px-4 py-3">{row.source}</td>
                <td className="px-4 py-3">{row.avgScore}</td>
                <td className="px-4 py-3">{row.interviewRate}</td>
                <td className="px-4 py-3">{row.offerRate}</td>
                <td className="px-4 py-3">{row.hireRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </section>
  );
}
