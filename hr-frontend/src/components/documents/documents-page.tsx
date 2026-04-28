"use client";

import dayjs from "dayjs";
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { FormStatus } from "@/components/shared/form-status";
import { ListEmptyState, ListErrorState, ListLoadingSkeleton } from "@/components/shared/list-states";
import { getDocuments, uploadDocumentMock } from "@/services/communication-service";
import { DocumentItem } from "@/types/communication";

const PAGE_SIZE = 5;

export function DocumentsPage({ simulateLoadError = false }: { simulateLoadError?: boolean }) {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [category, setCategory] = useState("all");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
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
      const items = await getDocuments();
      setDocuments(items);
      setLastUpdated(new Date());
      setPage(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load documents.");
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
    return documents.filter((item) => (category === "all" ? true : item.category === category));
  }, [documents, category]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageSlice = useMemo(() => {
    const start = safePage * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const preview = useMemo(
    () => documents.find((item) => item.id === previewId) ?? null,
    [documents, previewId],
  );

  const resetFilters = () => {
    setCategory("all");
    setPage(0);
  };

  const onUpload = async () => {
    const response = await uploadDocumentMock();
    setStatus({ type: response.success ? "success" : "error", message: response.message });
  };

  const onDropUpload = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    await onUpload();
  };

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Milestone 9"
        title="Documents"
        description="Manage recruitment documents with category filtering and preview-ready records."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/app", label: "App" },
          { label: "Documents" },
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
          <select
            className="h-10 rounded-xl border bg-background px-3 text-sm"
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setPage(0);
            }}
          >
            <option value="all">All categories</option>
            <option value="resume">Resumes</option>
            <option value="cover_letter">Cover letters</option>
            <option value="offer_letter">Offer letters</option>
            <option value="feedback">Feedback docs</option>
          </select>
          <button type="button" onClick={resetFilters} className="h-10 rounded-xl border bg-background px-3 text-sm">
            Reset filters
          </button>
          <button type="button" onClick={onUpload} className="rounded-xl border px-3 text-sm">
            Upload Document
          </button>
        </div>
        <div
          className={`mt-3 rounded-xl border-2 border-dashed p-5 text-center text-sm transition ${dragActive ? "border-primary bg-primary/5" : "border-border bg-background"}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDropUpload}
        >
          Drop files here to upload or use the upload button above.
        </div>
        {status ? (
          <div className="mt-2">
            <FormStatus type={status.type} message={status.message} />
          </div>
        ) : null}
      </div>

      {loading ? <ListLoadingSkeleton className="h-64" /> : null}

      {!loading && error ? (
        <ListErrorState title="Could not load documents" message={error} onRetry={() => void load()} />
      ) : null}

      {!loading && !error && documents.length === 0 ? (
        <ListEmptyState title="No documents" description="Upload a document or refresh once mock data is available." />
      ) : null}

      {!loading && !error && documents.length > 0 && filtered.length === 0 ? (
        <ListEmptyState title="No documents in this category" description="Choose another category or reset filters." />
      ) : null}

      {!loading && !error && filtered.length > 0 ? (
        <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="space-y-3">
            <div className="overflow-hidden rounded-2xl border bg-surface">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-surface-muted text-left">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Candidate</th>
                      <th className="px-4 py-3">Uploaded</th>
                      <th className="px-4 py-3">Version</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageSlice.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="px-4 py-3 font-medium">{item.name}</td>
                        <td className="px-4 py-3 capitalize">{item.category.replace("_", " ")}</td>
                        <td className="px-4 py-3">{item.candidateName}</td>
                        <td className="px-4 py-3">{item.uploadedAt}</td>
                        <td className="px-4 py-3">v{item.version}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button type="button" onClick={() => setPreviewId(item.id)} className="text-primary hover:underline">
                              Preview
                            </button>
                            <button type="button" className="text-primary hover:underline">
                              Download
                            </button>
                            <button type="button" className="text-primary hover:underline">
                              Share
                            </button>
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
                Showing {safePage * PAGE_SIZE + 1}–{Math.min((safePage + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
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
          </article>

          <article className="rounded-2xl border bg-surface p-4">
            <p className="text-sm font-semibold">Preview</p>
            {preview ? (
              <div className="mt-3 space-y-2 text-sm">
                <p>
                  <span className="text-zinc-500">File:</span> {preview.name}
                </p>
                <p>
                  <span className="text-zinc-500">Candidate:</span> {preview.candidateName}
                </p>
                <p>
                  <span className="text-zinc-500">Category:</span> {preview.category}
                </p>
                <p>
                  <span className="text-zinc-500">Version history:</span> v{preview.version}, v{Math.max(preview.version - 1, 1)}
                </p>
                <div className="rounded-xl border bg-background p-3 text-xs text-zinc-500">Document content preview placeholder for selected file.</div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-zinc-500">Select a document to preview details.</p>
            )}
          </article>
        </div>
      ) : null}
    </section>
  );
}
