import Link from "next/link";
import { ReactNode } from "react";
import { Check } from "lucide-react";

export function AuthShell({
  title,
  description,
  form,
  footerLink,
  productName = "Marys HR Services",
  features,
  footerEndLink,
}: {
  title: string;
  description: string;
  form: ReactNode;
  footerLink?: { href: string; label: string };
  /** Shown as a compact row under the description (e.g. login only). */
  features?: string[];
  productName?: string;
  /** Right side of the card footer. Omit for default “Sign in”. Pass `null` to hide (e.g. on login). */
  footerEndLink?: { href: string; label: string } | null;
}) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-12"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-background">
        <div
          className="absolute -left-1/4 top-0 h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-3xl dark:bg-primary/20"
          aria-hidden
        />
        <div
          className="absolute -right-1/4 bottom-0 h-[24rem] w-[24rem] rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/10"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,var(--background)_100%)] opacity-90"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.35] dark:opacity-[0.2]"
          aria-hidden
        />
      </div>

      <div className="w-full max-w-[440px]">
        <header className="mb-8 text-center">
          <div
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-bold tracking-tight text-primary-foreground shadow-lg shadow-primary/25"
            aria-hidden
          >
            M
          </div>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">{productName}</p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Recruiting workspace</p>
        </header>

        <section className="rounded-2xl border border-border/80 bg-surface/95 p-8 shadow-[0_24px_48px_-12px_rgba(15,23,42,0.12)] backdrop-blur-sm dark:border-border/60 dark:bg-surface/90 dark:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.45)] sm:p-9">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{description}</p>

          {features && features.length > 0 ? (
            <ul className="mt-6 flex flex-col gap-2.5 border-t border-border pt-6">
              {features.map((line) => (
                <li key={line} className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                    <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                  </span>
                  <span className="leading-snug">{line}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-8">{form}</div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-xs">
            {footerLink ? (
              <Link
                href={footerLink.href}
                className="font-medium text-primary transition hover:text-primary/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {footerLink.label}
              </Link>
            ) : (
              <span />
            )}
            {footerEndLink === null ? (
              <span />
            ) : (
              <Link
                href={footerEndLink?.href ?? "/login"}
                className="font-medium text-zinc-500 transition hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-zinc-400"
              >
                {footerEndLink?.label ?? "Sign in"}
              </Link>
            )}
          </div>
        </section>

        <p className="mt-8 text-center text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-500">
          © {new Date().getFullYear()} {productName}. All rights reserved.
          <span className="mx-2 text-border">·</span>
          <span className="text-zinc-400">Mock environment — credentials are simulated.</span>
        </p>
      </div>
    </main>
  );
}
