"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { FormStatus } from "@/components/shared/form-status";
import { getFaqs, getProductUpdates } from "@/services/admin-service";
import { FaqItem, ProductUpdate } from "@/types/admin";

export function HelpCenterPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [updates, setUpdates] = useState<ProductUpdate[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    getFaqs().then((items) => setFaqs(items));
    getProductUpdates().then((items) => setUpdates(items));
  }, []);

  const filtered = useMemo(() => {
    return faqs.filter((item) =>
      `${item.question} ${item.answer}`.toLowerCase().includes(query.toLowerCase()),
    );
  }, [faqs, query]);

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Milestone 10"
        title="Help Center"
        description="Browse FAQs and contact support for product guidance."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/app", label: "App" },
          { label: "Help Center" },
        ]}
      />
      <div className="rounded-2xl border bg-surface p-3">
        <input
          className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Search FAQ..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search frequently asked questions"
        />
      </div>
      <div className="space-y-3">
        {filtered.map((item) => (
          <article key={item.id} className="rounded-2xl border bg-surface p-4">
            <p className="text-sm font-semibold">{item.question}</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{item.answer}</p>
          </article>
        ))}
      </div>
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Product updates</h2>
        {updates.map((item) => (
          <article key={item.id} className="rounded-2xl border bg-surface p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-semibold">{item.title}</p>
              <time className="text-xs text-zinc-500" dateTime={item.releasedAt}>
                {item.releasedAt}
              </time>
            </div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{item.summary}</p>
          </article>
        ))}
      </div>
      <div className="rounded-2xl border bg-surface p-4">
        <p className="text-sm font-semibold">Contact Support</p>
        <textarea
          className="mt-3 w-full rounded-xl border bg-background p-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
          rows={4}
          placeholder="Describe your issue..."
          aria-label="Support request description"
        />
        <button
          type="button"
          onClick={() => setStatus({ type: "success", message: "Support request submitted (mock)." })}
          className="mt-3 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Submit Request
        </button>
        {status ? <div className="mt-2"><FormStatus type={status.type} message={status.message} /></div> : null}
      </div>
    </section>
  );
}
