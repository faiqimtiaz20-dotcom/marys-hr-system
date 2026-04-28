"use client";

import { PageHeader } from "@/components/shared/page-header";

export function SettingsPage({
  title,
  description,
  breadcrumbs,
  children,
}: {
  title: string;
  description: string;
  breadcrumbs: Array<{ href?: string; label: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6">
      <PageHeader eyebrow="Milestone 10" title={title} description={description} breadcrumbs={breadcrumbs} />
      {children}
    </section>
  );
}
