"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { PageHeader } from "@/components/shared/page-header";
import { getInterviewById, updateInterviewStatus } from "@/services/interviews-service";
import { InterviewItem } from "@/types/interviews";

export function InterviewDetail({ interviewId }: { interviewId: string }) {
  const [item, setItem] = useState<InterviewItem | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [roomState, setRoomState] = useState<"pre_check" | "live_status" | "summary">("pre_check");

  useEffect(() => {
    getInterviewById(interviewId).then((result) => setItem(result));
  }, [interviewId]);

  const onStatusChange = async (status: "scheduled" | "completed" | "cancelled") => {
    if (!item) return;
    const response = await updateInterviewStatus(item.id, status);
    setMessage(response.message);
    if (response.success) setItem({ ...item, status });
  };

  if (!item) return <div className="h-44 animate-pulse rounded-2xl border bg-surface-muted" />;

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Milestone 6"
        title={`${item.candidateName} Interview`}
        description={`${item.jobTitle} interview with ${item.interviewer}.`}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/app", label: "App" },
          { href: "/app/interviews", label: "Interviews" },
          { label: "Detail" },
        ]}
      />
      <div className="grid gap-3 md:grid-cols-4">
        <article className="rounded-xl border bg-surface p-4"><p className="text-xs text-zinc-500">Type</p><p className="mt-1 text-sm font-medium capitalize">{item.type}</p></article>
        <article className="rounded-xl border bg-surface p-4"><p className="text-xs text-zinc-500">Start</p><p className="mt-1 text-sm font-medium">{dayjs(item.startAt).format("DD MMM, hh:mm A")}</p></article>
        <article className="rounded-xl border bg-surface p-4"><p className="text-xs text-zinc-500">End</p><p className="mt-1 text-sm font-medium">{dayjs(item.endAt).format("DD MMM, hh:mm A")}</p></article>
        <article className="rounded-xl border bg-surface p-4"><p className="text-xs text-zinc-500">Status</p><p className="mt-1 text-sm font-medium capitalize">{item.status}</p></article>
      </div>
      <div className="rounded-2xl border bg-surface p-4">
        <p className="text-sm font-semibold">Actions</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-xl border px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => onStatusChange("scheduled")}
          >
            Reschedule
          </button>
          <button
            type="button"
            className="rounded-xl border px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => onStatusChange("cancelled")}
          >
            Cancel
          </button>
          <Link
            href={`/app/interviews/${item.id}/scorecard`}
            className="rounded-xl border px-3 py-2 text-sm text-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Open Scorecard
          </Link>
        </div>
        {message ? <p className="mt-2 text-xs text-primary">{message}</p> : null}
      </div>
      <div className="rounded-2xl border bg-surface p-4">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Interview room">
          <button
            type="button"
            role="tab"
            aria-selected={roomState === "pre_check"}
            id="interview-room-tab-pre"
            aria-controls="interview-room-panel-pre"
            onClick={() => setRoomState("pre_check")}
            className={`rounded-xl px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              roomState === "pre_check" ? "bg-primary text-primary-foreground" : "border"
            }`}
          >
            Pre-check
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={roomState === "live_status"}
            id="interview-room-tab-live"
            aria-controls="interview-room-panel-live"
            onClick={() => setRoomState("live_status")}
            className={`rounded-xl px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              roomState === "live_status" ? "bg-primary text-primary-foreground" : "border"
            }`}
          >
            Live status
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={roomState === "summary"}
            id="interview-room-tab-summary"
            aria-controls="interview-room-panel-summary"
            onClick={() => setRoomState("summary")}
            className={`rounded-xl px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              roomState === "summary" ? "bg-primary text-primary-foreground" : "border"
            }`}
          >
            Summary
          </button>
        </div>
        <div
          id="interview-room-panel-pre"
          role="tabpanel"
          aria-labelledby="interview-room-tab-pre"
          hidden={roomState !== "pre_check"}
          className="mt-3 rounded-xl border bg-background p-3 text-sm text-zinc-600 dark:text-zinc-300"
        >
          Audio and camera checks complete, meeting link active, candidate joined waiting room.
        </div>
        <div
          id="interview-room-panel-live"
          role="tabpanel"
          aria-labelledby="interview-room-tab-live"
          hidden={roomState !== "live_status"}
          className="mt-3 rounded-xl border bg-background p-3 text-sm text-zinc-600 dark:text-zinc-300"
        >
          Interview is live with panel connected. Current section is technical assessment with 22 minutes remaining.
        </div>
        <div
          id="interview-room-panel-summary"
          role="tabpanel"
          aria-labelledby="interview-room-tab-summary"
          hidden={roomState !== "summary"}
          className="mt-3 rounded-xl border bg-background p-3 text-sm text-zinc-600 dark:text-zinc-300"
        >
          Session ended successfully. Interviewer notes captured and scorecard submission pending.
        </div>
      </div>
      <div className="grid gap-3 xl:grid-cols-2">
        <article className="rounded-2xl border bg-surface p-4"><p className="text-sm font-semibold">Agenda</p><p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Introduction, role context, scenario discussion, and Q/A block.</p></article>
        <article className="rounded-2xl border bg-surface p-4"><p className="text-sm font-semibold">Attachments & Notes</p><p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{item.notes}</p></article>
      </div>
    </section>
  );
}
