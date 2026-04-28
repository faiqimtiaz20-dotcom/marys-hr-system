import Link from "next/link";
import { AppRouteItem } from "@/config/routes";
import { PageHeader } from "@/components/shared/page-header";
import { Crumb } from "@/components/shared/breadcrumb";

export function RoutePreview({
  title,
  description,
  nextRoutes,
  breadcrumbs,
}: {
  title: string;
  description: string;
  nextRoutes: AppRouteItem[];
  breadcrumbs: Crumb[];
}) {
  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Milestone Build"
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {nextRoutes.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-xl border bg-surface p-4 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">{item.description}</p>
            <p className="mt-2 text-xs text-primary">{item.href}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
