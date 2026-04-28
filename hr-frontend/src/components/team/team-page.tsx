"use client";

import dayjs from "dayjs";
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { FormStatus } from "@/components/shared/form-status";
import { ListEmptyState, ListErrorState, ListLoadingSkeleton } from "@/components/shared/list-states";
import {
  getTeamMembers,
  inviteMemberMock,
  revokeTeamInvitation,
  suspendTeamMember,
  updateTeamMemberRole,
} from "@/services/admin-service";
import { TEAM_ROLE_OPTIONS, TeamMember } from "@/types/admin";

const PAGE_SIZE = 5;

export function TeamPage({ simulateLoadError = false }: { simulateLoadError?: boolean }) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const simulatedFailRef = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (simulateLoadError && !simulatedFailRef.current) {
        simulatedFailRef.current = true;
        throw new Error("Simulated load failure. Remove ?error=1 from the URL or press Retry.");
      }
      const items = await getTeamMembers();
      setMembers(items);
      setLastUpdated(new Date());
      setPage(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load team members.");
    } finally {
      setLoading(false);
    }
  }, [simulateLoadError]);

  useEffect(() => {
    startTransition(() => {
      void load();
    });
  }, [load]);

  const filtered = useMemo(() => {
    return members.filter((item) =>
      `${item.name} ${item.email} ${item.role}`.toLowerCase().includes(query.toLowerCase()),
    );
  }, [members, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageSlice = useMemo(() => {
    const start = safePage * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const resetFilters = () => {
    setQuery("");
    setPage(0);
  };

  const onInvite = async () => {
    const response = await inviteMemberMock(inviteEmail);
    setStatus({ type: response.success ? "success" : "error", message: response.message });
    if (response.success) setInviteEmail("");
  };

  const onRoleChange = async (member: TeamMember, role: string) => {
    if (member.role === "Owner Admin") return;
    const response = await updateTeamMemberRole(member.id, role);
    setStatus({ type: response.success ? "success" : "error", message: response.message });
    if (response.success) {
      setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, role } : m)));
    }
  };

  const onSuspend = async (member: TeamMember) => {
    if (member.role === "Owner Admin" || member.status !== "active") return;
    const response = await suspendTeamMember(member.id);
    setStatus({ type: response.success ? "success" : "error", message: response.message });
    if (response.success) {
      setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, status: "suspended" } : m)));
    }
  };

  const onRevokeInvite = async (member: TeamMember) => {
    if (member.status !== "invited") return;
    const response = await revokeTeamInvitation(member.id);
    setStatus({ type: response.success ? "success" : "error", message: response.message });
    if (response.success) {
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
    }
  };

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Milestone 10"
        title="Team"
        description="Manage members, role assignment, and invitation status."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/app", label: "App" },
          { label: "Team" },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
        <span>
          {lastUpdated ? `Last refreshed ${dayjs(lastUpdated).format("MMM D, YYYY h:mm A")}` : "Not loaded yet"}
        </span>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border bg-surface px-2 py-1 font-medium text-foreground transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Refresh data
        </button>
      </div>

      <div className="rounded-2xl border bg-surface p-3">
        <div className="flex flex-wrap gap-2">
          <input
            className="h-10 min-w-[260px] flex-1 rounded-xl border bg-background px-3 text-sm"
            placeholder="Invite by email"
            value={inviteEmail}
            onChange={(event) => setInviteEmail(event.target.value)}
            aria-label="Invite by email"
          />
          <button
            type="button"
            onClick={onInvite}
            className="rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Invite Member
          </button>
        </div>
        {status ? (
          <div className="mt-2">
            <FormStatus type={status.type} message={status.message} />
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border bg-surface p-3">
        <div className="flex flex-wrap gap-2">
          <input
            className="h-10 min-w-[200px] flex-1 rounded-xl border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Search name, email, role"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            aria-label="Search team members"
          />
          <button
            type="button"
            onClick={resetFilters}
            className="h-10 rounded-xl border bg-background px-3 text-sm transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Reset filters
          </button>
        </div>
      </div>

      {loading ? <ListLoadingSkeleton /> : null}

      {!loading && error ? (
        <ListErrorState title="Could not load team" message={error} onRetry={() => void load()} />
      ) : null}

      {!loading && !error && members.length === 0 ? (
        <ListEmptyState title="No team members" description="Invite someone or refresh once mock data is available." />
      ) : null}

      {!loading && !error && members.length > 0 && filtered.length === 0 ? (
        <ListEmptyState title="No matching members" description="Try a different search or reset filters." />
      ) : null}

      {!loading && !error && filtered.length > 0 ? (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border bg-surface">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-surface-muted text-left">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageSlice.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="px-4 py-3 font-medium">{item.name}</td>
                      <td className="px-4 py-3">{item.email}</td>
                      <td className="px-4 py-3">
                        {item.role === "Owner Admin" ? (
                          <span>{item.role}</span>
                        ) : (
                          <select
                            className="h-9 max-w-[200px] rounded-lg border bg-background px-2 text-xs"
                            value={item.role}
                            onChange={(e) => onRoleChange(item, e.target.value)}
                            aria-label={`Role for ${item.name}`}
                          >
                            {TEAM_ROLE_OPTIONS.filter((r) => r !== "Owner Admin").map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-4 py-3 capitalize">{item.status}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {item.status === "active" && item.role !== "Owner Admin" ? (
                            <button
                              type="button"
                              onClick={() => onSuspend(item)}
                              className="rounded-lg border px-2 py-1 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              Suspend
                            </button>
                          ) : null}
                          {item.status === "invited" ? (
                            <button
                              type="button"
                              onClick={() => onRevokeInvite(item)}
                              className="rounded-lg border px-2 py-1 text-xs text-rose-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              Revoke invite
                            </button>
                          ) : null}
                          {item.status === "suspended" ? <span className="text-xs text-zinc-500">Suspended</span> : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600 dark:text-zinc-300">
            <span>
              Showing {safePage * PAGE_SIZE + 1}–{Math.min((safePage + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={safePage <= 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="rounded-lg border bg-surface px-2 py-1 font-medium transition enabled:hover:bg-surface-muted disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={safePage >= pageCount - 1}
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                className="rounded-lg border bg-surface px-2 py-1 font-medium transition enabled:hover:bg-surface-muted disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
