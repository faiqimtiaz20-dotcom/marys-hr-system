type ListEmptyStateProps = {
  title: string;
  description: string;
};

export function ListEmptyState({ title, description }: ListEmptyStateProps) {
  return (
    <div className="rounded-2xl border bg-surface p-6 text-center text-sm text-zinc-600 dark:text-zinc-300">
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-2">{description}</p>
    </div>
  );
}

type ListErrorStateProps = {
  title: string;
  message: string;
  onRetry: () => void;
};

export function ListErrorState({ title, message, onRetry }: ListErrorStateProps) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-100">
      <p className="font-semibold">{title}</p>
      <p className="mt-2">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Retry
      </button>
    </div>
  );
}

export function ListLoadingSkeleton({ className = "h-52" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl border bg-surface-muted ${className}`} aria-busy="true" />;
}
