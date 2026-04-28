"use client";

import dayjs from "dayjs";
import { startTransition, useCallback, useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ListEmptyState, ListErrorState, ListLoadingSkeleton } from "@/components/shared/list-states";
import { getCandidates, updateCandidateStage } from "@/services/candidates-service";
import { CandidateItem, CandidateStage } from "@/types/candidates";

const stageOrder: CandidateStage[] = [
  "applied",
  "screening",
  "assessment",
  "interview",
  "offer",
  "hired",
  "rejected",
];

export function PipelineBoard() {
  const [candidates, setCandidates] = useState<CandidateItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await getCandidates();
      setCandidates(items);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load pipeline.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    startTransition(() => {
      void load();
    });
  }, [load]);

  const grouped = useMemo(() => {
    return stageOrder.map((stage) => ({
      stage,
      items: candidates.filter((candidate) => candidate.currentStage === stage),
    }));
  }, [candidates]);

  const moveCandidate = async (candidateId: string, direction: "prev" | "next") => {
    setMessage(null);
    const current = candidates.find((item) => item.id === candidateId);
    if (!current) return;
    const index = stageOrder.indexOf(current.currentStage);
    const nextIndex = direction === "next" ? index + 1 : index - 1;
    if (nextIndex < 0 || nextIndex >= stageOrder.length) return;
    const nextStage = stageOrder[nextIndex];

    const response = await updateCandidateStage(candidateId, nextStage);
    if (!response.success) {
      setMessage(response.message);
      return;
    }

    setCandidates((prev) =>
      prev.map((item) => (item.id === candidateId ? { ...item, currentStage: nextStage } : item)),
    );
    setMessage(response.message);
  };

  const totalCards = grouped.reduce((acc, col) => acc + col.items.length, 0);

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Milestone 5"
        title="Candidate Pipeline"
        description="Track candidate progression across hiring stages in an interactive board."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/app", label: "App" },
          { label: "Pipeline" },
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

      {loading ? <ListLoadingSkeleton /> : null}

      {!loading && error ? (
        <ListErrorState title="Could not load pipeline" message={error} onRetry={() => void load()} />
      ) : null}

      {!loading && !error && candidates.length === 0 ? (
        <ListEmptyState title="No candidates" description="Add candidates in the mock dataset to populate the board." />
      ) : null}

      {message ? <p className="rounded-xl border bg-surface px-3 py-2 text-sm text-primary">{message}</p> : null}

      {!loading && !error && candidates.length > 0 && totalCards === 0 ? (
        <ListEmptyState
          title="No candidates on the board"
          description="All mock candidates may be in an unexpected stage. Refresh or check data."
        />
      ) : null}

      {!loading && !error && totalCards > 0 ? (
        <div
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 xl:grid xl:snap-none xl:grid-cols-4 2xl:grid-cols-7 xl:overflow-x-visible xl:pb-0"
          role="list"
          aria-label="Pipeline stages"
        >
          {grouped.map((column) => (
            <article
              key={column.stage}
              className="w-[min(100%,18rem)] shrink-0 snap-start rounded-2xl border bg-surface p-3 xl:w-auto xl:min-w-0 xl:shrink"
              role="listitem"
              aria-label={`${column.stage} stage`}
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold capitalize">{column.stage}</p>
                <span className="rounded-full bg-background px-2 py-1 text-xs">{column.items.length}</span>
              </div>
              <div className="space-y-2">
                {column.items.map((candidate) => (
                  <div key={candidate.id} className="rounded-xl border bg-background p-3">
                    <p className="text-sm font-medium">{candidate.name}</p>
                    <p className="text-xs text-zinc-500">{candidate.title}</p>
                    <div className="mt-2 flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveCandidate(candidate.id, "prev")}
                        className="rounded-lg border px-2 py-1 text-[11px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={`Move ${candidate.name} to previous stage`}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => moveCandidate(candidate.id, "next")}
                        className="rounded-lg border px-2 py-1 text-[11px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={`Move ${candidate.name} to next stage`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
