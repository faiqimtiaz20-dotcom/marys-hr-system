"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { getCandidateById, updateCandidateStage } from "@/services/candidates-service";
import { CandidateItem, CandidateStage } from "@/types/candidates";

const stageOptions: CandidateStage[] = [
  "applied",
  "screening",
  "assessment",
  "interview",
  "offer",
  "hired",
  "rejected",
];

export function CandidateProfile({ candidateId }: { candidateId: string }) {
  const [candidate, setCandidate] = useState<CandidateItem | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    getCandidateById(candidateId).then((item) => setCandidate(item));
  }, [candidateId]);

  const onMoveStage = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!candidate) return;
    const next = event.target.value as CandidateStage;
    const response = await updateCandidateStage(candidate.id, next);
    setMessage(response.message);
    if (response.success) {
      setCandidate({ ...candidate, currentStage: next });
    }
  };

  if (!candidate) {
    return <div className="h-44 animate-pulse rounded-2xl border bg-surface-muted" />;
  }

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Milestone 5"
        title={candidate.name}
        description={`${candidate.title} from ${candidate.location} assigned to ${candidate.assignedRecruiter}.`}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/app", label: "App" },
          { href: "/app/candidates", label: "Candidates" },
          { label: "Profile" },
        ]}
      />

      <div className="grid gap-3 md:grid-cols-4">
        <article className="rounded-xl border bg-surface p-4">
          <p className="text-xs text-zinc-500">Current stage</p>
          <p className="mt-1 text-sm font-medium capitalize">{candidate.currentStage}</p>
        </article>
        <article className="rounded-xl border bg-surface p-4">
          <p className="text-xs text-zinc-500">Experience</p>
          <p className="mt-1 text-sm font-medium">{candidate.experience}</p>
        </article>
        <article className="rounded-xl border bg-surface p-4">
          <p className="text-xs text-zinc-500">Source</p>
          <p className="mt-1 text-sm font-medium capitalize">{candidate.source.replace("_", " ")}</p>
        </article>
        <article className="rounded-xl border bg-surface p-4">
          <p className="text-xs text-zinc-500">Status</p>
          <p className="mt-1 text-sm font-medium capitalize">{candidate.status.replace("_", " ")}</p>
        </article>
      </div>

      <div className="rounded-2xl border bg-surface p-4">
        <p className="text-sm font-semibold">Talent tags</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-full border bg-background px-3 py-1 text-xs capitalize">
            Pool: {candidate.talentPool}
          </span>
          {candidate.tags.map((tag) => (
            <span key={tag} className="rounded-full border bg-background px-3 py-1 text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border bg-surface p-4">
        <p className="text-sm font-semibold">Move candidate stage</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <select
            className="h-10 rounded-xl border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
            value={candidate.currentStage}
            onChange={onMoveStage}
            aria-label="Candidate pipeline stage"
          >
            {stageOptions.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="h-10 rounded-xl border bg-background px-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Schedule interview
          </button>
          <button
            type="button"
            className="h-10 rounded-xl border bg-background px-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Add note
          </button>
          <button
            type="button"
            className="h-10 rounded-xl border bg-background px-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Send template
          </button>
        </div>
        {message ? <p className="mt-2 text-xs text-primary">{message}</p> : null}
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        <article className="rounded-2xl border bg-surface p-4">
          <p className="text-sm font-semibold">Timeline</p>
          <div className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
            <p>Candidate submitted portfolio and completed screening form.</p>
            <p>Recruiter feedback updated with strong communication score.</p>
            <p>Technical interview pending assignment.</p>
          </div>
        </article>
        <article className="rounded-2xl border bg-surface p-4">
          <p className="text-sm font-semibold">Notes and communication</p>
          <div className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
            <p>Prefers hybrid role and flexible schedule discussion.</p>
            <p>Available for interviews on weekdays after 3 PM.</p>
            <p>Email response turnaround is within same day.</p>
          </div>
        </article>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        <article className="rounded-2xl border bg-surface p-4">
          <p className="text-sm font-semibold">Documents</p>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-xl border bg-background px-3 py-2">
              <span>Resume - Noor_Fatima_CV.pdf</span>
              <button
                type="button"
                className="text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="View resume PDF"
              >
                View
              </button>
            </div>
            <div className="flex items-center justify-between rounded-xl border bg-background px-3 py-2">
              <span>Portfolio - noor-portfolio.zip</span>
              <button
                type="button"
                className="text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="View portfolio archive"
              >
                View
              </button>
            </div>
            <div className="flex items-center justify-between rounded-xl border bg-background px-3 py-2">
              <span>Interview feedback notes.docx</span>
              <button
                type="button"
                className="text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="View interview feedback document"
              >
                View
              </button>
            </div>
          </div>
        </article>
        <article className="rounded-2xl border bg-surface p-4">
          <p className="text-sm font-semibold">Communication history</p>
          <div className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
            <div className="rounded-xl border bg-background px-3 py-2">
              <p className="font-medium">Email sent - Interview invitation</p>
              <p className="text-xs">Apr 24, 2026 at 10:12 AM</p>
            </div>
            <div className="rounded-xl border bg-background px-3 py-2">
              <p className="font-medium">Candidate reply - Availability confirmed</p>
              <p className="text-xs">Apr 24, 2026 at 01:47 PM</p>
            </div>
            <div className="rounded-xl border bg-background px-3 py-2">
              <p className="font-medium">Template message sent - Scorecard pending</p>
              <p className="text-xs">Apr 26, 2026 at 04:08 PM</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
