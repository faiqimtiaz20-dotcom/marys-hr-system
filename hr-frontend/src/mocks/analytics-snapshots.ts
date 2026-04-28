import type { AnalyticsSnapshot } from "@/types/core-entities";

/** Rolling analytics snapshots (mock export / dashboard source). */
export const mockAnalyticsSnapshots: AnalyticsSnapshot[] = [
  {
    id: "snap_001",
    capturedAt: "2026-04-27T08:00:00.000Z",
    rangeLabel: "Last 30 days",
    newApplicants: 128,
    interviewsScheduled: 34,
    offersExtended: 12,
    hires: 5,
    activeOpenJobs: 18,
  },
  {
    id: "snap_002",
    capturedAt: "2026-04-20T08:00:00.000Z",
    rangeLabel: "Last 30 days",
    newApplicants: 112,
    interviewsScheduled: 29,
    offersExtended: 10,
    hires: 4,
    activeOpenJobs: 17,
  },
  {
    id: "snap_003",
    capturedAt: "2026-04-13T08:00:00.000Z",
    rangeLabel: "Last 30 days",
    newApplicants: 96,
    interviewsScheduled: 24,
    offersExtended: 9,
    hires: 3,
    activeOpenJobs: 16,
  },
];
