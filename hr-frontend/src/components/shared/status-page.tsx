import Link from "next/link";

export function StatusPage({
  code,
  title,
  description,
}: {
  code: string;
  title: string;
  description: string;
}) {
  return (
    <main id="main-content" tabIndex={-1} className="flex min-h-screen items-center justify-center bg-background p-6">
      <section className="glass-surface w-full max-w-2xl rounded-3xl border p-8 text-center shadow-[0_16px_45px_rgba(15,23,42,0.2)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{code}</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">{description}</p>
        <div className="mt-7 flex justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-xl border bg-surface px-4 text-sm font-medium transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Go to landing
          </Link>
          <Link
            href="/app"
            className="inline-flex h-11 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Go to dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
