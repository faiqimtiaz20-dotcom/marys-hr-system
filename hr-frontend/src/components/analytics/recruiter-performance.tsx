"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { AnalyticsControls } from "@/components/analytics/analytics-controls";
import { recruiterPerformanceData } from "@/mocks/analytics";

export function RecruiterPerformance() {
  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Milestone 8"
        title="Recruiter Performance"
        description="Compare recruiter throughput, response speed, and hire conversion."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/app", label: "App" },
          { href: "/app/analytics", label: "Analytics" },
          { label: "Recruiter Performance" },
        ]}
      />
      <AnalyticsControls />
      <div className="grid gap-3 xl:grid-cols-2">
        <article className="rounded-2xl border bg-surface p-4">
          <p className="text-sm font-semibold">Applications Processed</p>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recruiterPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                <XAxis dataKey="recruiter" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="processed" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
        <article className="rounded-2xl border bg-surface p-4">
          <p className="text-sm font-semibold">Hire Rate %</p>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recruiterPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                <XAxis dataKey="recruiter" tick={{ fontSize: 12 }} />
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
              <th className="px-4 py-3">Recruiter</th>
              <th className="px-4 py-3">Processed</th>
              <th className="px-4 py-3">Response Time (hrs)</th>
              <th className="px-4 py-3">Candidate Satisfaction</th>
              <th className="px-4 py-3">Hire Rate %</th>
            </tr>
          </thead>
          <tbody>
            {recruiterPerformanceData.map((row) => (
              <tr key={row.recruiter} className="border-t">
                <td className="px-4 py-3">{row.recruiter}</td>
                <td className="px-4 py-3">{row.processed}</td>
                <td className="px-4 py-3">{row.responseHours}</td>
                <td className="px-4 py-3">{row.satisfaction}</td>
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
