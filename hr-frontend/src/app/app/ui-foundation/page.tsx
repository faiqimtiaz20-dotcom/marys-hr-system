import { PageHeader } from "@/components/shared/page-header";

const colorTokens = [
  { name: "background", value: "var(--background)" },
  { name: "surface", value: "var(--surface)" },
  { name: "surface-muted", value: "var(--surface-muted)" },
  { name: "primary", value: "var(--primary)" },
  { name: "foreground", value: "var(--foreground)" },
];

export default function UiFoundationPage() {
  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Milestone 1"
        title="UI Foundation"
        description="This page centralizes core tokens, primitive controls, and base card styles used by every module in the recruiting platform."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/app", label: "App" },
          { label: "UI Foundation" },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {colorTokens.map((token) => (
          <article key={token.name} className="rounded-2xl border bg-surface p-4 shadow-sm">
            <div className="h-20 rounded-xl border" style={{ backgroundColor: token.value }} />
            <p className="mt-3 text-sm font-semibold">{token.name}</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">{token.value}</p>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border bg-surface p-5">
        <p className="text-sm font-semibold">Primitive Controls</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Primary Action
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-xl border bg-surface px-4 text-sm font-medium transition hover:bg-surface-muted"
          >
            Secondary Action
          </button>
          <input
            className="h-10 min-w-64 rounded-xl border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Search input style"
            aria-label="UI foundation input"
          />
        </div>
      </section>
    </section>
  );
}
