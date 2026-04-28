import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = {
  href?: string;
  label: string;
};

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-zinc-600 dark:text-zinc-300">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="rounded px-1 py-0.5 transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "font-medium text-foreground" : ""}>{item.label}</span>
              )}
              {!isLast ? <ChevronRight className="h-3.5 w-3.5" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
