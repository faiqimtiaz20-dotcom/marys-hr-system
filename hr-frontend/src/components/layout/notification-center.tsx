"use client";

import { useMemo, useState } from "react";
import { Bell, CheckCheck, X } from "lucide-react";
import { mockNotifications } from "@/mocks/notifications";
import { cn } from "@/lib/utils";

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(mockNotifications);

  const unreadCount = useMemo(() => items.filter((item) => item.unread).length, [items]);

  const markAllAsRead = () => {
    setItems((previous) => previous.map((item) => ({ ...item, unread: false })));
  };

  const markRead = (id: string) => {
    setItems((previous) =>
      previous.map((item) => (item.id === id ? { ...item, unread: false } : item)),
    );
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-surface transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Notifications"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
            {unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close notifications overlay"
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            onClick={() => setOpen(false)}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="notifications-panel-title"
            className="absolute right-0 z-40 mt-2 w-[min(calc(100vw-1.5rem),340px)] rounded-2xl border bg-surface p-3 shadow-[0_20px_45px_rgba(2,6,23,0.2)] sm:w-[340px]"
          >
            <div className="flex items-center justify-between border-b pb-2">
              <p id="notifications-panel-title" className="text-sm font-semibold">
                Notifications
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="inline-flex h-8 items-center gap-1 rounded-lg border px-2 text-xs transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Close notifications panel"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="mt-2 max-h-[360px] space-y-2 overflow-y-auto pr-1">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => markRead(item.id)}
                  className={cn(
                    "w-full rounded-xl border p-3 text-left transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    item.unread ? "border-primary/30 bg-primary/5" : "bg-background",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{item.title}</p>
                    <span className="text-[11px] text-zinc-500">{item.time}</span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">{item.message}</p>
                </button>
              ))}
            </div>
          </aside>
        </>
      ) : null}
    </div>
  );
}
