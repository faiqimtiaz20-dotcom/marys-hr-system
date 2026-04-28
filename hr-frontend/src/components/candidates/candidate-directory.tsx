"use client";

import Link from "next/link";
import dayjs from "dayjs";
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ListEmptyState, ListErrorState, ListLoadingSkeleton } from "@/components/shared/list-states";
import { getCandidates } from "@/services/candidates-service";
import { CandidateItem } from "@/types/candidates";

const PAGE_SIZE = 6;

export function CandidateDirectory({ simulateLoadError = false }: { simulateLoadError?: boolean }) {
  const [view, setView] = useState<"table" | "card">("table");
  const [query, setQuery] = useState("");
  const [pool, setPool] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [segment, setSegment] = useState("all_talent");
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<CandidateItem[]>([]);
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
      const items = await getCandidates();
      setCandidates(items);
      setLastUpdated(new Date());
      setPage(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load candidates.");
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
    return candidates
      .filter((candidate) =>
        `${candidate.name} ${candidate.title} ${candidate.location} ${candidate.skills.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      )
      .filter((candidate) => (pool === "all" ? true : candidate.talentPool === pool))
      .filter((candidate) => (tagFilter === "all" ? true : candidate.tags.includes(tagFilter)));
  }, [candidates, query, pool, tagFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageSlice = useMemo(() => {
    const start = safePage * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const allTags = useMemo(() => {
    return ["all", ...Array.from(new Set(candidates.flatMap((candidate) => candidate.tags)))];
  }, [candidates]);

  const applySegment = (value: string) => {
    setSegment(value);
    setPage(0);
    if (value === "all_talent") {
      setPool("all");
      setTagFilter("all");
      return;
    }
    if (value === "engineering_hotlist") {
      setPool("engineering");
      setTagFilter("high-priority");
      return;
    }
    if (value === "product_shortlist") {
      setPool("product");
      setTagFilter("portfolio-shortlisted");
      return;
    }
    if (value === "hr_urgent") {
      setPool("hr");
      setTagFilter("urgent-fill");
    }
  };

  const resetFilters = () => {
    setQuery("");
    setPool("all");
    setTagFilter("all");
    setSegment("all_talent");
    setPage(0);
  };

  const handleImport = () => {
    setImportMessage("Candidate import completed with 12 records synced (mock import).");
    setTimeout(() => {
      setImportMessage(null);
    }, 2000);
  };

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Milestone 5"
        title="Candidates"
        description="Browse profiles, skills, and hiring stages across the full talent pool."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/app", label: "App" },
          { label: "Candidates" },
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
            className="h-10 min-w-[220px] flex-1 rounded-xl border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Search name, title, location, skills"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            aria-label="Search candidates"
          />
          <select
            className="h-10 rounded-xl border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
            value={segment}
            onChange={(event) => applySegment(event.target.value)}
            aria-label="Candidate segment"
          >
            <option value="all_talent">Segment: All talent</option>
            <option value="engineering_hotlist">Segment: Engineering hotlist</option>
            <option value="product_shortlist">Segment: Product shortlist</option>
            <option value="hr_urgent">Segment: HR urgent fill</option>
          </select>
          <select
            className="h-10 rounded-xl border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
            value={pool}
            onChange={(event) => {
              setPool(event.target.value);
              setPage(0);
            }}
            aria-label="Talent pool"
          >
            <option value="all">All talent pools</option>
            <option value="engineering">Engineering</option>
            <option value="product">Product</option>
            <option value="hr">HR</option>
            <option value="operations">Operations</option>
          </select>
          <select
            className="h-10 rounded-xl border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
            value={tagFilter}
            onChange={(event) => {
              setTagFilter(event.target.value);
              setPage(0);
            }}
            aria-label="Tag filter"
          >
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag === "all" ? "All tags" : tag}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={resetFilters}
            className="h-10 rounded-xl border bg-background px-3 text-sm transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Reset filters
          </button>
          <button
            type="button"
            onClick={handleImport}
            className="rounded-xl border px-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Import Candidates
          </button>
          <button
            type="button"
            onClick={() => setView("table")}
            aria-pressed={view === "table"}
            aria-label="Table view"
            className={`rounded-xl px-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${view === "table" ? "bg-primary text-primary-foreground" : "border"}`}
          >
            Table
          </button>
          <button
            type="button"
            onClick={() => setView("card")}
            aria-pressed={view === "card"}
            aria-label="Card view"
            className={`rounded-xl px-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${view === "card" ? "bg-primary text-primary-foreground" : "border"}`}
          >
            Cards
          </button>
        </div>
        {importMessage ? <p className="mt-2 text-xs text-primary">{importMessage}</p> : null}
      </div>

      {loading ? <ListLoadingSkeleton /> : null}

      {!loading && error ? (
        <ListErrorState title="Could not load candidates" message={error} onRetry={() => void load()} />
      ) : null}

      {!loading && !error && candidates.length === 0 ? (
        <ListEmptyState title="No candidates" description="There are no candidates in the mock dataset yet." />
      ) : null}

      {!loading && !error && candidates.length > 0 && filtered.length === 0 ? (
        <ListEmptyState title="No matching candidates" description="Try clearing filters or broadening your search." />
      ) : null}

      {!loading && !error && filtered.length > 0 && view === "table" ? (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border bg-surface">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-surface-muted text-left">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Experience</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Skills</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Pool</th>
                    <th className="px-4 py-3">Tags</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pageSlice.map((candidate) => (
                    <tr key={candidate.id} className="border-t">
                      <td className="px-4 py-3 font-medium">{candidate.name}</td>
                      <td className="px-4 py-3">{candidate.title}</td>
                      <td className="px-4 py-3">{candidate.experience}</td>
                      <td className="px-4 py-3">{candidate.location}</td>
                      <td className="px-4 py-3">{candidate.skills.slice(0, 2).join(", ")}</td>
                      <td className="px-4 py-3 capitalize">{candidate.status.replace("_", " ")}</td>
                      <td className="px-4 py-3 capitalize">{candidate.talentPool}</td>
                      <td className="px-4 py-3">{candidate.tags.slice(0, 2).join(", ")}</td>
                      <td className="px-4 py-3 capitalize">{candidate.source.replace("_", " ")}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/app/candidates/${candidate.id}`}
                          className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          View profile
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

      {!loading && !error && filtered.length > 0 && view === "card" ? (
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {pageSlice.map((candidate) => (
              <article key={candidate.id} className="rounded-2xl border bg-surface p-4">
                <p className="text-sm font-semibold">{candidate.name}</p>
                <p className="text-xs text-zinc-500">{candidate.title}</p>
                <p className="mt-2 text-xs">{candidate.location}</p>
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-300">{candidate.skills.join(", ")}</p>
                <p className="mt-1 text-xs text-zinc-500">Pool: {candidate.talentPool}</p>
                <p className="mt-1 text-xs text-zinc-500">Tags: {candidate.tags.join(", ")}</p>
                <Link
                  href={`/app/candidates/${candidate.id}`}
                  className="mt-3 inline-flex text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Open profile
                </Link>
              </article>
            ))}
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
