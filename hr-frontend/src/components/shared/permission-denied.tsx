import Link from "next/link";

export function PermissionDenied({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
      <p className="font-semibold">Access restricted</p>
      <p className="mt-2 text-amber-900/90 dark:text-amber-100/90">{message}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/app"
          className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Go to dashboard
        </Link>
        <Link
          href="/app/help-center"
          className="inline-flex h-10 items-center rounded-xl border bg-surface px-4 text-sm font-medium transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Help center
        </Link>
      </div>
      <p className="mt-3 text-xs text-amber-800/80 dark:text-amber-200/80">
        Mock role is stored in this browser. Use the role control in the top bar to switch access.
      </p>
    </div>
  );
}
