"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, Plus } from "lucide-react";
import {
  activityTimeline,
  dashboardKpis,
  funnelData,
  recruiterWorkload,
  sourceData,
  upcomingInterviews,
  velocityData,
} from "@/mocks/dashboard";
import { PageHeader } from "@/components/shared/page-header";

type ViewState = "live" | "loading" | "empty" | "error";

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={`kpi-loading-${index}`} className="h-28 animate-pulse rounded-2xl border bg-surface-muted" />
        ))}
      </div>
      <div className="grid gap-3 xl:grid-cols-3">
        <div className="h-72 animate-pulse rounded-2xl border bg-surface-muted xl:col-span-2" />
        <div className="h-72 animate-pulse rounded-2xl border bg-surface-muted" />
      </div>
    </div>
  );
}

export function DashboardOverview() {
  const [viewState, setViewState] = useState<ViewState>("live");
  const [range, setRange] = useState("30d");
  const [team, setTeam] = useState("all");

  const filteredKpis = useMemo(() => {
    if (viewState !== "live") {
      return [];
    }
    return dashboardKpis;
  }, [viewState]);

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Milestone 3"
        title="Recruiting Dashboard"
        description={`Track hiring health for ${team === "all" ? "all teams" : team} in the last ${range}. Last refresh ${dayjs().format("hh:mm A")}.`}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/app", label: "App" },
          { label: "Dashboard" },
        ]}
      />

      <div className="rounded-2xl border bg-surface p-3">
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="h-10 rounded-xl border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={range}
            onChange={(event) => setRange(event.target.value)}
            aria-label="Select date range"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <select
            className="h-10 rounded-xl border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={team}
            onChange={(event) => setTeam(event.target.value)}
            aria-label="Select team"
          >
            <option value="all">All teams</option>
            <option value="technical">Technical hiring</option>
            <option value="non-tech">Non-tech hiring</option>
          </select>
          <div className="ml-auto flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex h-10 items-center gap-1 rounded-xl border bg-background px-3 text-sm transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Plus className="h-4 w-4" aria-hidden />
              New Job
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-1 rounded-xl border bg-background px-3 text-sm transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Plus className="h-4 w-4" aria-hidden />
              New Interview
            </button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => setViewState("live")}
            aria-pressed={viewState === "live"}
            aria-label="Show live dashboard data"
            className={`rounded-lg px-3 py-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${viewState === "live" ? "bg-primary text-primary-foreground" : "border bg-background"}`}
          >
            Live data
          </button>
          <button
            type="button"
            onClick={() => setViewState("loading")}
            aria-pressed={viewState === "loading"}
            aria-label="Show dashboard loading state"
            className={`rounded-lg px-3 py-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${viewState === "loading" ? "bg-primary text-primary-foreground" : "border bg-background"}`}
          >
            Loading state
          </button>
          <button
            type="button"
            onClick={() => setViewState("empty")}
            aria-pressed={viewState === "empty"}
            aria-label="Show dashboard empty state"
            className={`rounded-lg px-3 py-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${viewState === "empty" ? "bg-primary text-primary-foreground" : "border bg-background"}`}
          >
            Empty state
          </button>
          <button
            type="button"
            onClick={() => setViewState("error")}
            aria-pressed={viewState === "error"}
            aria-label="Show dashboard error state"
            className={`rounded-lg px-3 py-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${viewState === "error" ? "bg-primary text-primary-foreground" : "border bg-background"}`}
          >
            Error state
          </button>
        </div>
      </div>

      {viewState === "loading" ? <DashboardSkeleton /> : null}

      {viewState === "error" ? (
        <div className="rounded-2xl border border-rose-300 bg-rose-50 p-5 text-sm text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">
          Dashboard failed to load analytics snapshot. Please retry after refreshing filters.
        </div>
      ) : null}

      {viewState === "empty" ? (
        <div className="rounded-2xl border bg-surface p-6 text-sm text-zinc-600 dark:text-zinc-300">
          No dashboard data available for this filter combination yet. Try selecting another team or date range.
        </div>
      ) : null}

      {viewState === "live" ? (
        <>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {filteredKpis.map((kpi) => (
              <article key={kpi.key} className="rounded-2xl border bg-surface p-4">
                <p className="text-xs text-zinc-600 dark:text-zinc-300">{kpi.label}</p>
                <p className="mt-2 text-2xl font-semibold">{kpi.value}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-xs">
                  {kpi.trend === "up" ? (
                    <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5 text-rose-500" aria-hidden />
                  )}
                  <span className={kpi.trend === "up" ? "text-emerald-600" : "text-rose-600"}>{kpi.delta}</span>
                </p>
              </article>
            ))}
          </div>

          <div className="grid gap-3 xl:grid-cols-3">
            <article className="rounded-2xl border bg-surface p-4 xl:col-span-2">
              <p className="text-sm font-semibold">Application Funnel</p>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                    <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>
            <article className="rounded-2xl border bg-surface p-4">
              <p className="text-sm font-semibold">Source Quality</p>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                    <XAxis dataKey="source" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="quality" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>
          </div>

          <div className="grid gap-3 xl:grid-cols-3">
            <article className="rounded-2xl border bg-surface p-4 xl:col-span-2">
              <p className="text-sm font-semibold">Hiring Velocity Trend</p>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={velocityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line dataKey="hires" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </article>
            <article className="rounded-2xl border bg-surface p-4">
              <p className="text-sm font-semibold">Upcoming Interviews</p>
              <div className="mt-3 space-y-3">
                {upcomingInterviews.map((item) => (
                  <div key={item.id} className="rounded-xl border bg-background p-3">
                    <p className="text-sm font-medium">{item.candidate}</p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300">{item.role} with {item.interviewer}</p>
                    <p className="mt-1 text-xs font-medium text-primary">{item.time}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="grid gap-3 xl:grid-cols-2">
            <article className="rounded-2xl border bg-surface p-4">
              <p className="text-sm font-semibold">Recent Activity</p>
              <div className="mt-3 space-y-2.5">
                {activityTimeline.map((item) => (
                  <div key={item.id} className="rounded-xl border bg-background p-3 text-sm">
                    <p>
                      <span className="font-medium">{item.actor}</span> {item.action}
                    </p>
                    <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">{item.time}</p>
                  </div>
                ))}
              </div>
            </article>
            <article className="rounded-2xl border bg-surface p-4">
              <p className="text-sm font-semibold">Recruiter Workload</p>
              <div className="mt-3 space-y-2.5">
                {recruiterWorkload.map((item) => (
                  <div key={item.id} className="rounded-xl border bg-background p-3">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                      Open jobs {item.openJobs} | Active candidates {item.activeCandidates}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </>
      ) : null}
    </section>
  );
}
