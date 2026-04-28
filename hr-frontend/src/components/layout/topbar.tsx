"use client";

import { ChevronDown, PanelLeft, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NotificationCenter } from "@/components/layout/notification-center";
import { MockRoleSwitcher } from "@/components/layout/mock-role-switcher";

type TopbarProps = {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
  isLargeLayout: boolean;
  mobileNavOpen: boolean;
};

export function Topbar({ onToggleSidebar, sidebarCollapsed, isLargeLayout, mobileNavOpen }: TopbarProps) {
  const menuAriaLabel = !isLargeLayout
    ? mobileNavOpen
      ? "Close navigation menu"
      : "Open navigation menu"
    : sidebarCollapsed
      ? "Expand sidebar"
      : "Collapse sidebar";

  const menuAriaExpanded = !isLargeLayout ? mobileNavOpen : undefined;

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2 px-3 sm:gap-3 sm:px-4 md:px-6">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-expanded={menuAriaExpanded}
          aria-controls={!isLargeLayout ? "mobile-navigation-panel" : undefined}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-surface transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={menuAriaLabel}
        >
          <PanelLeft className="h-4 w-4" />
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <div className="relative min-w-0 flex-1 md:max-w-xl">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
              aria-hidden
            />
            <input
              className={cn(
                "h-10 w-full min-w-0 rounded-xl border bg-surface pl-10 pr-3 text-sm sm:pr-4",
                "outline-none transition focus-visible:ring-2 focus-visible:ring-ring",
              )}
              placeholder="Search jobs, candidates, interviews..."
              aria-label="Global search"
              type="search"
              autoComplete="off"
            />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <MockRoleSwitcher />
            <NotificationCenter />
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex h-10 max-w-[9rem] items-center gap-1.5 truncate rounded-xl border bg-surface px-2 text-sm transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:max-w-none sm:gap-2 sm:px-3"
              aria-label="Organization switcher"
            >
              <span className="truncate">Marys HR</span>
              <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
