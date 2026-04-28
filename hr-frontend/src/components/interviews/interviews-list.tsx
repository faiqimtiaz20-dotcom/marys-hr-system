"use client";

import Link from "next/link";
import dayjs from "dayjs";
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ListEmptyState, ListErrorState, ListLoadingSkeleton } from "@/components/shared/list-states";
import { getInterviews } from "@/services/interviews-service";
import { InterviewItem } from "@/types/interviews";

const AGENDA_PAGE_SIZE = 5;

export function InterviewsList({ simulateLoadError = false }: { simulateLoadError?: boolean }) {
  const [view, setView] = useState<"calendar" | "agenda">("calendar");
  const [status, setStatus] = useState("all");
  const [interviewer, setInterviewer] = useState("all");
  const [role, setRole] = useState("all");
  const [interviews, setInterviews] = useState<InterviewItem[]>([]);
  const [agendaPage, setAgendaPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const simulatedFailRef = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (simulateLoadError && !simulatedFailRef.current) {
        simulatedFailRef.current = true;
        throw new Error("Simulated load failure. Remove ?error=1 from the URL or press Retry.");
      }
      const items = await getInterviews();
      setInterviews(items);
      setLastUpdated(new Date());
      setAgendaPage(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load interviews.");
    } finally {
      setLoading(false);
    }
  }, [simulateLoadError]);

  useEffect(() => {
    startTransition(() => {
      void load();
    });
  }, [load]);

  const filtered = useMemo(() => {
    return interviews
      .filter((item) => (status === "all" ? true : item.status === status))
      .filter((item) => (interviewer === "all" ? true : item.interviewer === interviewer))
      .filter((item) => (role === "all" ? true : item.jobTitle === role));
  }, [interviews, status, interviewer, role]);

  const interviewerOptions = useMemo(
    () => ["all", ...Array.from(new Set(interviews.map((item) => item.interviewer)))],
    [interviews],
  );

  const roleOptions = useMemo(
    () => ["all", ...Array.from(new Set(interviews.map((item) => item.jobTitle)))],
    [interviews],
  );

  const groupedByDay = useMemo(() => {
    return filtered.reduce<Record<string, InterviewItem[]>>((acc, item) => {
      const key = dayjs(item.startAt).format("YYYY-MM-DD");
      acc[key] = [...(acc[key] ?? []), item];
      return acc;
    }, {});
  }, [filtered]);

  const agendaPageCount = Math.max(1, Math.ceil(filtered.length / AGENDA_PAGE_SIZE));
  const agendaSafePage = Math.min(agendaPage, agendaPageCount - 1);
  const agendaSlice = useMemo(() => {
    const start = agendaSafePage * AGENDA_PAGE_SIZE;
    return filtered.slice(start, start + AGENDA_PAGE_SIZE);
  }, [filtered, agendaSafePage]);

  const resetFilters = () => {
    setStatus("all");
    setInterviewer("all");
    setRole("all");
    setAgendaPage(0);
  };

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Milestone 6"
        title="Interviews"
        description="Manage interview calendar and agenda with role and status visibility."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/app", label: "App" },
          { label: "Interviews" },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
        <span>
          {lastUpdated ? `Last refreshed ${dayjs(lastUpdated).format("MMM D, YYYY h:mm A")}` : "Not loaded yet"}
        </span>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border bg-surface px-2 py-1 font-medium text-foreground transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Refresh data
        </button>
      </div>

      <div className="rounded-2xl border bg-surface p-3">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setView("calendar")} className={`rounded-xl px-3 text-sm ${view === "calendar" ? "bg-primary text-primary-foreground" : "border"}`}>
            Calendar
          </button>
          <button type="button" onClick={() => setView("agenda")} className={`rounded-xl px-3 text-sm ${view === "agenda" ? "bg-primary text-primary-foreground" : "border"}`}>
            Agenda
          </button>
          <select
            className="h-10 rounded-xl border bg-background px-3 text-sm"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setAgendaPage(0);
            }}
          >
            <option value="all">All statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            className="h-10 rounded-xl border bg-background px-3 text-sm"
            value={interviewer}
            onChange={(event) => {
              setInterviewer(event.target.value);
              setAgendaPage(0);
            }}
          >
            {interviewerOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All interviewers" : option}
              </option>
            ))}
          </select>
          <select
            className="h-10 rounded-xl border bg-background px-3 text-sm"
            value={role}
            onChange={(event) => {
              setRole(event.target.value);
              setAgendaPage(0);
            }}
          >
            {roleOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All roles" : option}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={resetFilters}
            className="h-10 rounded-xl border bg-background px-3 text-sm transition hover:bg-surface-muted"
          >
            Reset filters
          </button>
          <Link href="/app/interviews/schedule" className="ml-auto inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground">
            Schedule Interview
          </Link>
        </div>
      </div>

      {loading ? <ListLoadingSkeleton /> : null}

      {!loading && error ? (
        <ListErrorState title="Could not load interviews" message={error} onRetry={() => void load()} />
      ) : null}

      {!loading && !error && interviews.length === 0 ? (
        <ListEmptyState title="No interviews" description="There are no interviews scheduled in the mock dataset yet." />
      ) : null}

      {!loading && !error && interviews.length > 0 && filtered.length === 0 ? (
        <ListEmptyState title="No matching interviews" description="Try clearing filters to see more results." />
      ) : null}

      {!loading && !error && filtered.length > 0 && view === "calendar" ? (
        <div className="space-y-3">
          {Object.entries(groupedByDay).map(([day, items]) => (
            <article key={day} className="rounded-2xl border bg-surface p-4">
              <p className="text-sm font-semibold">{dayjs(day).format("ddd, DD MMM YYYY")}</p>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {items.map((item) => (
                  <Link key={item.id} href={`/app/interviews/${item.id}`} className="rounded-xl border bg-background p-3">
                    <p className="text-sm font-medium">{item.candidateName}</p>
                    <p className="text-xs text-zinc-500">
                      {item.jobTitle} with {item.interviewer}
                    </p>
                    <p className="mt-1 text-xs">
                      {dayjs(item.startAt).format("hh:mm A")} - {dayjs(item.endAt).format("hh:mm A")}
                    </p>
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {!loading && !error && filtered.length > 0 && view === "agenda" ? (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border bg-surface">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-surface-muted text-left">
                  <tr>
                    <th className="px-4 py-3">Candidate</th>
                    <th className="px-4 py-3">Interviewer</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Date/Time</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {agendaSlice.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="px-4 py-3 font-medium">{item.candidateName}</td>
                      <td className="px-4 py-3">{item.interviewer}</td>
                      <td className="px-4 py-3 capitalize">{item.type}</td>
                      <td className="px-4 py-3">{dayjs(item.startAt).format("DD MMM, hh:mm A")}</td>
                      <td className="px-4 py-3 capitalize">{item.status}</td>
                      <td className="px-4 py-3">
                        <Link href={`/app/interviews/${item.id}`} className="text-primary hover:underline">
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600 dark:text-zinc-300">
            <span>
              Showing {agendaSafePage * AGENDA_PAGE_SIZE + 1}–{Math.min((agendaSafePage + 1) * AGENDA_PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={agendaSafePage <= 0}
                onClick={() => setAgendaPage((p) => Math.max(0, p - 1))}
                className="rounded-lg border bg-surface px-2 py-1 font-medium transition enabled:hover:bg-surface-muted disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={agendaSafePage >= agendaPageCount - 1}
                onClick={() => setAgendaPage((p) => Math.min(agendaPageCount - 1, p + 1))}
                className="rounded-lg border bg-surface px-2 py-1 font-medium transition enabled:hover:bg-surface-muted disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
