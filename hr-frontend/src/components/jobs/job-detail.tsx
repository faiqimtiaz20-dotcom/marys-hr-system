"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { getJobApplications, getJobById } from "@/services/jobs-service";
import { JobApplicationItem, JobItem } from "@/types/jobs";

type JobTab = "overview" | "applicants" | "interview_stages" | "activity" | "settings";

const jobTabs: Array<{ key: JobTab; label: string }> = [
  { key: "overview", label: "Overview" },
  { key: "applicants", label: "Applicants" },
  { key: "interview_stages", label: "Interview Stages" },
  { key: "activity", label: "Activity" },
  { key: "settings", label: "Settings" },
];

export function JobDetail({ jobId }: { jobId: string }) {
  const [tab, setTab] = useState<JobTab>("overview");
  const [job, setJob] = useState<JobItem | null>(null);
  const [applications, setApplications] = useState<JobApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getJobById(jobId), getJobApplications(jobId)])
      .then(([jobResult, appResult]) => {
        setJob(jobResult);
        setApplications(appResult);
      })
      .finally(() => setLoading(false));
  }, [jobId]);

  if (loading) {
    return <div className="h-72 animate-pulse rounded-2xl border bg-surface-muted" />;
  }

  if (!job) {
    return (
      <div className="rounded-2xl border bg-surface p-6 text-sm">
        Job not found.
        <Link
          href="/app/jobs"
          className="ml-2 text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Go back
        </Link>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Milestone 4"
        title={job.title}
        description={`${job.department} role in ${job.location} managed by ${job.owner}.`}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/app", label: "App" },
          { href: "/app/jobs", label: "Jobs" },
          { label: "Detail" },
        ]}
      />

      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border bg-surface p-4">
          <p className="text-xs text-zinc-500">Status</p>
          <p className="mt-1 text-sm font-medium capitalize">{job.status}</p>
        </div>
        <div className="rounded-xl border bg-surface p-4">
          <p className="text-xs text-zinc-500">Applicants</p>
          <p className="mt-1 text-sm font-medium">{job.applicantsCount}</p>
        </div>
        <div className="rounded-xl border bg-surface p-4">
          <p className="text-xs text-zinc-500">Salary Range</p>
          <p className="mt-1 text-sm font-medium">{job.salaryRange}</p>
        </div>
        <div className="rounded-xl border bg-surface p-4">
          <p className="text-xs text-zinc-500">Experience</p>
          <p className="mt-1 text-sm font-medium">{job.experienceLevel}</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-surface p-3">
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Job detail sections">
          {jobTabs.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={tab === item.key}
              id={`job-tab-${item.key}`}
              aria-controls={`job-panel-${item.key}`}
              onClick={() => setTab(item.key)}
              className={`rounded-lg px-3 py-1.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                tab === item.key ? "bg-primary text-primary-foreground" : "border bg-background"
              }`}
            >
              {item.label}
            </button>
          ))}
          <Link
            href={`/app/jobs/${job.id}/edit`}
            className="ml-auto inline-flex h-9 items-center rounded-lg border bg-background px-3 text-sm transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Edit Job
          </Link>
        </div>
      </div>

      <div
        id="job-panel-overview"
        role="tabpanel"
        aria-labelledby="job-tab-overview"
        hidden={tab !== "overview"}
        className="rounded-2xl border bg-surface p-5 text-sm"
      >
        <p className="font-medium">Role summary</p>
        <p className="mt-2 text-zinc-600 dark:text-zinc-300">
          This position is currently {job.status} and is receiving active candidate applications. Use the applicants tab
          for stage-level tracking and scheduling.
        </p>
      </div>

      <div
        id="job-panel-applicants"
        role="tabpanel"
        aria-labelledby="job-tab-applicants"
        hidden={tab !== "applicants"}
        className="overflow-hidden rounded-2xl border bg-surface"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-surface-muted text-left">
              <tr>
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Applied</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3">{item.candidateName}</td>
                  <td className="px-4 py-3 capitalize">{item.stage.replace("_", " ")}</td>
                  <td className="px-4 py-3">{item.score}</td>
                  <td className="px-4 py-3">{item.appliedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div
        id="job-panel-interview_stages"
        role="tabpanel"
        aria-labelledby="job-tab-interview_stages"
        hidden={tab !== "interview_stages"}
        className="rounded-2xl border bg-surface p-5 text-sm text-zinc-600 dark:text-zinc-300"
      >
        Interview stages configured: Screening, Technical Interview, Final Interview.
      </div>

      <div
        id="job-panel-activity"
        role="tabpanel"
        aria-labelledby="job-tab-activity"
        hidden={tab !== "activity"}
        className="rounded-2xl border bg-surface p-5 text-sm text-zinc-600 dark:text-zinc-300"
      >
        Recent updates include status changes, interview scheduling, and evaluator submissions.
      </div>

      <div
        id="job-panel-settings"
        role="tabpanel"
        aria-labelledby="job-tab-settings"
        hidden={tab !== "settings"}
        className="rounded-2xl border bg-surface p-5 text-sm text-zinc-600 dark:text-zinc-300"
      >
        Configure visibility, assignment, and notification preferences for this job posting.
      </div>
    </section>
  );
}
