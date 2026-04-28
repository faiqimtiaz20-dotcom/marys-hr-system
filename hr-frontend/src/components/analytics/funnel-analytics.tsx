"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { AnalyticsControls } from "@/components/analytics/analytics-controls";
import { funnelDropoffData } from "@/mocks/analytics";

export function FunnelAnalytics() {
  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Milestone 8"
        title="Funnel Analytics"
        description="Analyze stage conversion, drop-off points, and median days in each stage."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/app", label: "App" },
          { href: "/app/analytics", label: "Analytics" },
          { label: "Funnel" },
        ]}
      />
      <AnalyticsControls />
      <div className="grid gap-3 xl:grid-cols-2">
        <article className="rounded-2xl border bg-surface p-4">
          <p className="text-sm font-semibold">Stage Conversion %</p>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelDropoffData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="conversion" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
        <article className="rounded-2xl border bg-surface p-4">
          <p className="text-sm font-semibold">Drop-off % by Stage</p>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={funnelDropoffData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line dataKey="dropoff" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>
      <div className="overflow-hidden rounded-2xl border bg-surface">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
          <thead className="bg-surface-muted text-left">
            <tr>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Conversion %</th>
              <th className="px-4 py-3">Drop-off %</th>
              <th className="px-4 py-3">Median Days</th>
            </tr>
          </thead>
          <tbody>
            {funnelDropoffData.map((row) => (
              <tr key={row.stage} className="border-t">
                <td className="px-4 py-3">{row.stage}</td>
                <td className="px-4 py-3">{row.conversion}</td>
                <td className="px-4 py-3">{row.dropoff}</td>
                <td className="px-4 py-3">{row.medianDays}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </section>
  );
}
