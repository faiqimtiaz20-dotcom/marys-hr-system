import type { ScorecardRecord } from "@/types/interviews";

/** Submitted scorecards (mock history). */
export const mockScorecardRecords: ScorecardRecord[] = [
  {
    id: "scr_001",
    interviewId: "int_001",
    communication: 5,
    problemSolving: 4,
    technicalDepth: 5,
    cultureFit: 4,
    recommendation: "hire",
    comments: "Strong system design narrative and clear trade-off discussion on caching strategy.",
    submittedAt: "2026-04-26T15:30:00.000Z",
    interviewerName: "Ali Rehman",
  },
  {
    id: "scr_002",
    interviewId: "int_002",
    communication: 4,
    problemSolving: 4,
    technicalDepth: 3,
    cultureFit: 5,
    recommendation: "hold",
    comments: "Solid portfolio walkthrough; follow-up recommended on edge-case accessibility testing.",
    submittedAt: "2026-04-25T11:10:00.000Z",
    interviewerName: "Hira Shah",
  },
];
