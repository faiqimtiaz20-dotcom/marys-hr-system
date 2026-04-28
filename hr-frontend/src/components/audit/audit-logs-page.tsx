"use client";

import dayjs from "dayjs";
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ListEmptyState, ListErrorState, ListLoadingSkeleton } from "@/components/shared/list-states";
import { getAuditLogs } from "@/services/admin-service";
import { AuditLogItem } from "@/types/admin";

const PAGE_SIZE = 8;

export function AuditLogsPage({ simulateLoadError = false }: { simulateLoadError?: boolean }) {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
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
      const items = await getAuditLogs();
      setLogs(items);
      setLastUpdated(new Date());
      setPage(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load audit logs.");
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
    return logs.filter((item) =>
      `${item.actor} ${item.action} ${item.target}`.toLowerCase().includes(query.toLowerCase()),
    );
  }, [logs, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageSlice = useMemo(() => {
    const start = safePage * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const resetFilters = () => {
    setQuery("");
    setPage(0);
  };

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Milestone 10"
        title="Audit Logs"
        description="Review traceable activity records across key hiring actions."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/app", label: "App" },
          { label: "Audit Logs" },
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
          <input
            className="h-10 min-w-[260px] flex-1 rounded-xl border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Search actor, action, target"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            aria-label="Search audit logs"
          />
          <button
            type="button"
            onClick={resetFilters}
            className="h-10 rounded-xl border bg-background px-3 text-sm transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Reset filters
          </button>
          <button
            type="button"
            className="rounded-xl border px-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Export Logs
          </button>
        </div>
      </div>

      {loading ? <ListLoadingSkeleton /> : null}

      {!loading && error ? (
        <ListErrorState title="Could not load audit logs" message={error} onRetry={() => void load()} />
      ) : null}

      {!loading && !error && logs.length === 0 ? (
        <ListEmptyState title="No audit logs" description="There are no audit entries in the mock dataset yet." />
      ) : null}

      {!loading && !error && logs.length > 0 && filtered.length === 0 ? (
        <ListEmptyState title="No matching entries" description="Try a different search term or reset filters." />
      ) : null}

      {!loading && !error && filtered.length > 0 ? (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border bg-surface">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-surface-muted text-left">
                  <tr>
                    <th className="px-4 py-3">Actor</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Target</th>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">Metadata</th>
                  </tr>
                </thead>
                <tbody>
                  {pageSlice.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="px-4 py-3">{item.actor}</td>
                      <td className="px-4 py-3">{item.action}</td>
                      <td className="px-4 py-3">{item.target}</td>
                      <td className="px-4 py-3">{item.timestamp}</td>
                      <td className="px-4 py-3">{item.metadata}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600 dark:text-zinc-300">
            <span>
              Showing {safePage * PAGE_SIZE + 1}–{Math.min((safePage + 1) * PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length}
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
