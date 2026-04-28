"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { AnalyticsControls } from "@/components/analytics/analytics-controls";
import { offerAcceptanceData } from "@/mocks/analytics";

export function OfferAcceptanceAnalytics() {
  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Milestone 8"
        title="Offer Acceptance"
        description="Track offers sent versus accepted and monitor acceptance trend over time."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/app", label: "App" },
          { href: "/app/analytics", label: "Analytics" },
          { label: "Offer Acceptance" },
        ]}
      />
      <AnalyticsControls />
      <div className="grid gap-3 xl:grid-cols-2">
        <article className="rounded-2xl border bg-surface p-4">
          <p className="text-sm font-semibold">Offers Sent vs Accepted</p>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={offerAcceptanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="offersSent" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="accepted" fill="#14b8a6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
        <article className="rounded-2xl border bg-surface p-4">
          <p className="text-sm font-semibold">Acceptance Rate Trend %</p>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={offerAcceptanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line dataKey="acceptanceRate" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} />
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
              <th className="px-4 py-3">Month</th>
              <th className="px-4 py-3">Offers Sent</th>
              <th className="px-4 py-3">Accepted</th>
              <th className="px-4 py-3">Acceptance Rate %</th>
            </tr>
          </thead>
          <tbody>
            {offerAcceptanceData.map((row) => (
              <tr key={row.month} className="border-t">
                <td className="px-4 py-3">{row.month}</td>
                <td className="px-4 py-3">{row.offersSent}</td>
                <td className="px-4 py-3">{row.accepted}</td>
                <td className="px-4 py-3">{row.acceptanceRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </section>
  );
}
