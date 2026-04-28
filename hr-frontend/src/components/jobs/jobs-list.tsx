"use client";

import Link from "next/link";
import dayjs from "dayjs";
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ListEmptyState, ListErrorState, ListLoadingSkeleton } from "@/components/shared/list-states";
import { getJobs } from "@/services/jobs-service";
import { JobItem, JobStatus } from "@/types/jobs";

const statusOptions: Array<{ value: JobStatus | "all"; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: "open", label: "Open" },
  { value: "draft", label: "Draft" },
  { value: "paused", label: "Paused" },
  { value: "closed", label: "Closed" },
];

const PAGE_SIZE = 5;

export function JobsList({ simulateLoadError = false }: { simulateLoadError?: boolean }) {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<JobStatus | "all">("all");
  const [department, setDepartment] = useState("all");
  const [page, setPage] = useState(0);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [savedView, setSavedView] = useState("all_jobs");
  const [bulkAction, setBulkAction] = useState("none");
  const [tableMessage, setTableMessage] = useState<string | null>(null);
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
      const items = await getJobs();
      setJobs(items);
      setLastUpdated(new Date());
      setPage(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load jobs.");
    } finally {
      setLoading(false);
    }
  }, [simulateLoadError]);

  useEffect(() => {
    startTransition(() => {
      void load();
    });
  }, [load]);

  const departments = useMemo(() => {
    const values = Array.from(new Set(jobs.map((job) => job.department)));
    return ["all", ...values];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => (status === "all" ? true : job.status === status))
      .filter((job) => (department === "all" ? true : job.department === department))
      .filter((job) => {
        const haystack = `${job.title} ${job.location} ${job.owner}`.toLowerCase();
        return haystack.includes(query.toLowerCase());
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [jobs, status, department, query]);

  const pageCount = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageSlice = useMemo(() => {
    const start = safePage * PAGE_SIZE;
    return filteredJobs.slice(start, start + PAGE_SIZE);
  }, [filteredJobs, safePage]);

  const allSelected =
    pageSlice.length > 0 && pageSlice.every((job) => selectedRows.includes(job.id));

  const applySavedView = (value: string) => {
    setSavedView(value);
    setTableMessage(null);

    if (value === "all_jobs") {
      setStatus("all");
      setDepartment("all");
      setQuery("");
      return;
    }
    if (value === "open_roles") {
      setStatus("open");
      setDepartment("all");
      setQuery("");
      return;
    }
    if (value === "engineering_hiring") {
      setStatus("all");
      setDepartment("Engineering");
      setQuery("");
      return;
    }
    if (value === "high_volume") {
      setStatus("all");
      setDepartment("all");
      setQuery("senior");
    }
  };

  const resetFilters = () => {
    setStatus("all");
    setDepartment("all");
    setQuery("");
    setSavedView("all_jobs");
    setPage(0);
  };

  const toggleAllRows = () => {
    if (allSelected) {
      setSelectedRows((prev) => prev.filter((id) => !pageSlice.some((j) => j.id === id)));
      return;
    }
    setSelectedRows((prev) => Array.from(new Set([...prev, ...pageSlice.map((j) => j.id)])));
  };

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const executeBulkAction = () => {
    if (bulkAction === "none" || selectedRows.length === 0) {
      setTableMessage("Select rows and bulk action first.");
      return;
    }

    const actionLabel =
      bulkAction === "archive"
        ? "archived"
        : bulkAction === "duplicate"
          ? "duplicated"
          : "assigned to owner";

    setTableMessage(`${selectedRows.length} job(s) ${actionLabel} successfully (mock action).`);
    setSelectedRows([]);
    setBulkAction("none");
  };

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Milestone 4"
        title="Jobs Management"
        description="Manage all hiring roles with filters, search, sorting, and action shortcuts."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/app", label: "App" },
          { label: "Jobs" },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
        <span>{lastUpdated ? `Last refreshed ${dayjs(lastUpdated).format("MMM D, YYYY h:mm A")}` : "Not loaded yet"}</span>
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
          <input
            className="h-10 min-w-[220px] flex-1 rounded-xl border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Search by title, owner, location"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            aria-label="Search jobs"
          />
          <select
            className="h-10 rounded-xl border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as JobStatus | "all");
              setPage(0);
            }}
            aria-label="Filter by status"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            className="h-10 rounded-xl border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
            value={department}
            onChange={(event) => {
              setDepartment(event.target.value);
              setPage(0);
            }}
            aria-label="Filter by department"
          >
            {departments.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All departments" : option}
              </option>
            ))}
          </select>
          <select
            className="h-10 rounded-xl border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
            value={savedView}
            onChange={(event) => applySavedView(event.target.value)}
            aria-label="Saved views"
          >
            <option value="all_jobs">Saved view: All jobs</option>
            <option value="open_roles">Saved view: Open roles</option>
            <option value="engineering_hiring">Saved view: Engineering hiring</option>
            <option value="high_volume">Saved view: High volume roles</option>
          </select>
          <button
            type="button"
            onClick={resetFilters}
            className="h-10 rounded-xl border bg-background px-3 text-sm transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Reset filters
          </button>
          <Link
            href="/app/jobs/create"
            className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Create Job
          </Link>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <select
            className="h-9 rounded-xl border bg-background px-3 text-xs outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
            value={bulkAction}
            onChange={(event) => setBulkAction(event.target.value)}
            aria-label="Bulk actions"
          >
            <option value="none">Bulk actions</option>
            <option value="archive">Archive selected</option>
            <option value="duplicate">Duplicate selected</option>
            <option value="assign_owner">Assign owner</option>
          </select>
          <button
            type="button"
            onClick={executeBulkAction}
            className="inline-flex h-9 items-center rounded-xl border bg-background px-3 text-xs transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Apply
          </button>
          <p className="text-xs text-zinc-500">
            {selectedRows.length > 0 ? `${selectedRows.length} selected` : "No rows selected"}
          </p>
          {tableMessage ? <p className="text-xs text-primary">{tableMessage}</p> : null}
        </div>
      </div>

      {loading ? <ListLoadingSkeleton className="h-56" /> : null}

      {!loading && error ? (
        <ListErrorState title="Could not load jobs" message={error} onRetry={() => void load()} />
      ) : null}

      {!loading && !error && jobs.length === 0 ? (
        <ListEmptyState title="No jobs" description="The mock job catalog is empty." />
      ) : null}

      {!loading && !error && jobs.length > 0 && filteredJobs.length === 0 ? (
        <ListEmptyState
          title="No jobs match filters"
          description="Reset filters or change saved view to see more roles."
        />
      ) : null}

      {!loading && !error && filteredJobs.length > 0 ? (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border bg-surface">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-surface-muted text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border"
                        checked={allSelected}
                        onChange={toggleAllRows}
                        aria-label="Select all jobs on this page"
                      />
                    </th>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Department</th>
                    <th className="px-4 py-3 font-medium">Location</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Applicants</th>
                    <th className="px-4 py-3 font-medium">Owner</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageSlice.map((job) => (
                    <tr key={job.id} className="border-t">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border"
                          checked={selectedRows.includes(job.id)}
                          onChange={() => toggleRow(job.id)}
                          aria-label={`Select ${job.title}`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{job.title}</p>
                        <p className="text-xs text-zinc-500">{job.createdAt}</p>
                      </td>
                      <td className="px-4 py-3">{job.department}</td>
                      <td className="px-4 py-3">{job.location}</td>
                      <td className="px-4 py-3">{job.employmentType.replace("_", " ")}</td>
                      <td className="px-4 py-3 capitalize">{job.status}</td>
                      <td className="px-4 py-3">{job.applicantsCount}</td>
                      <td className="px-4 py-3">{job.owner}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link
                            href={`/app/jobs/${job.id}`}
                            className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            View
                          </Link>
                          <Link
                            href={`/app/jobs/${job.id}/edit`}
                            className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600 dark:text-zinc-300">
            <span>
              Showing {safePage * PAGE_SIZE + 1}–{Math.min((safePage + 1) * PAGE_SIZE, filteredJobs.length)} of{" "}
              {filteredJobs.length}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={safePage <= 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="rounded-lg border bg-surface px-2 py-1 font-medium transition enabled:hover:bg-surface-muted disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={safePage >= pageCount - 1}
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
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
