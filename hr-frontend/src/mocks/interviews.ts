import { InterviewItem } from "@/types/interviews";

export const mockInterviews: InterviewItem[] = [
  {
    id: "int_001",
    candidateName: "Noor Fatima",
    jobTitle: "Frontend Engineer",
    interviewer: "Ali Rehman",
    type: "technical",
    startAt: "2026-04-28T10:00:00",
    endAt: "2026-04-28T10:45:00",
    status: "scheduled",
    notes: "Focus on architecture and code quality.",
  },
  {
    id: "int_002",
    candidateName: "Sami Ullah",
    jobTitle: "Product Designer",
    interviewer: "Hira Shah",
    type: "behavioral",
    startAt: "2026-04-28T12:30:00",
    endAt: "2026-04-28T13:15:00",
    status: "scheduled",
    notes: "Evaluate cross-team collaboration examples.",
  },
  {
    id: "int_003",
    candidateName: "Fahad Ali",
    jobTitle: "Backend Engineer",
    interviewer: "Mary Johnson",
    type: "final",
    startAt: "2026-04-27T16:00:00",
    endAt: "2026-04-27T16:45:00",
    status: "completed",
    notes: "Strong communication and leadership signs.",
  },
];
