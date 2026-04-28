"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BriefcaseBusiness,
  CircleHelp,
  Palette,
  FileText,
  FolderOpen,
  LayoutDashboard,
  MessageSquareText,
  Settings,
  ShieldCheck,
  Users,
  UserCog,
  MessagesSquare,
  FolderKanban,
  LibraryBig,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { canAccessPath } from "@/config/permissions";
import { useMockAuth } from "@/contexts/mock-auth-context";

const navItems = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/jobs", label: "Jobs", icon: BriefcaseBusiness },
  { href: "/app/applications", label: "Applications", icon: FileText },
  { href: "/app/pipeline", label: "Pipeline", icon: FolderOpen },
  { href: "/app/candidates", label: "Candidates", icon: Users },
  { href: "/app/interviews", label: "Interviews", icon: MessageSquareText },
  { href: "/app/question-bank", label: "Question Bank", icon: LibraryBig },
  { href: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/app/messages", label: "Messages", icon: MessagesSquare },
  { href: "/app/documents", label: "Documents", icon: FolderKanban },
  { href: "/app/team", label: "Team", icon: UserCog },
  { href: "/app/settings/profile", label: "Settings", icon: Settings },
  { href: "/app/audit-logs", label: "Audit Logs", icon: ShieldCheck },
  { href: "/app/help-center", label: "Help Center", icon: CircleHelp },
  { href: "/app/ui-foundation", label: "UI Foundation", icon: Palette },
];

type SidebarProps = {
  collapsed?: boolean;
  onNavigate?: () => void;
};

export function Sidebar({ collapsed = false, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { role } = useMockAuth();
  const roleLabel = role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  const visibleItems = navItems.filter((item) => canAccessPath(role, item.href));

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col border-r border-white/10 bg-sidebar-bg px-3 py-4 text-sidebar-fg transition-all duration-300",
        collapsed ? "w-[84px]" : "w-[280px]",
      )}
      aria-label="Application sidebar"
    >
      <div className="mb-6 flex h-12 items-center rounded-xl bg-white/5 px-3 text-sm font-semibold tracking-wide">
        <span className={cn(collapsed && "mx-auto")}>MHR</span>
        {!collapsed && (
          <div className="ml-2 min-w-0">
            <p className="truncate text-sidebar-muted">Recruiting OS</p>
            <p className="truncate text-[10px] font-medium uppercase tracking-wider text-sidebar-muted/80">{roleLabel}</p>
          </div>
        )}
      </div>
      <nav
        className="min-h-0 flex-1 space-y-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Primary"
      >
        {visibleItems.map((item) => {
          const isActive =
            item.href === "/app"
              ? pathname === "/app"
              : item.href === "/app/settings/profile"
                ? pathname.startsWith("/app/settings")
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              aria-label={collapsed ? item.label : undefined}
              className={cn(
                "flex h-11 items-center gap-3 rounded-xl px-3 text-sm transition-all",
                "hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive ? "bg-white/12 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]" : "text-sidebar-fg",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" aria-hidden />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
