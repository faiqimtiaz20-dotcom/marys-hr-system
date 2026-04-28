import { Breadcrumb, Crumb } from "@/components/shared/breadcrumb";

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  breadcrumbs: Crumb[];
}) {
  return (
    <div className="space-y-3">
      <Breadcrumb items={breadcrumbs} />
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      ) : null}
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
      <p className="max-w-3xl text-sm text-zinc-600 dark:text-zinc-300">{description}</p>
    </div>
  );
}
