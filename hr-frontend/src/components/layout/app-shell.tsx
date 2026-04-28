"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { useMediaQuery } from "@/hooks/use-media-query";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLg = useMediaQuery("(min-width: 1024px)");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <div className="hidden lg:block">
          <Sidebar collapsed={collapsed} />
        </div>
        {mobileOpen ? (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-nav-title"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/45 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar overlay"
            />
            <div
              id="mobile-navigation-panel"
              className="relative z-50 h-full max-w-[min(100vw,280px)] shadow-2xl"
            >
              <span id="mobile-nav-title" className="sr-only">
                Main navigation
              </span>
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        ) : null}
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Topbar
            isLargeLayout={isLg}
            sidebarCollapsed={collapsed}
            mobileNavOpen={mobileOpen}
            onToggleSidebar={() => {
              if (!isLg) {
                setMobileOpen((prev) => !prev);
                return;
              }
              setCollapsed((prev) => !prev);
            }}
          />
          <main id="main-content" tabIndex={-1} className="flex-1 p-4 md:p-6">
            <div className="glass-surface min-h-[calc(100vh-7.5rem)] rounded-2xl border p-4 shadow-[0_15px_50px_rgba(15,23,42,0.12)] md:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
