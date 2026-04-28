"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/shared/page-header";
import { FormStatus } from "@/components/shared/form-status";
import { getScorecardRecordsForInterview, submitScorecard } from "@/services/interviews-service";
import type { ScorecardRecord } from "@/types/interviews";

const schema = z.object({
  communication: z.coerce.number().min(1).max(5),
  problemSolving: z.coerce.number().min(1).max(5),
  technicalDepth: z.coerce.number().min(1).max(5),
  cultureFit: z.coerce.number().min(1).max(5),
  recommendation: z.enum(["hire", "no_hire", "hold"]),
  comments: z.string().min(10, "Comments are required."),
});

type ScorecardFormInput = z.input<typeof schema>;
type ScorecardFormValues = z.output<typeof schema>;

export function ScorecardForm({ interviewId }: { interviewId: string }) {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [priorScorecards, setPriorScorecards] = useState<ScorecardRecord[]>([]);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ScorecardFormInput, unknown, ScorecardFormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    getScorecardRecordsForInterview(interviewId).then(setPriorScorecards);
  }, [interviewId]);

  const onSubmit = async (values: ScorecardFormValues) => {
    const response = await submitScorecard({ interviewId, ...values });
    setStatus({ type: response.success ? "success" : "error", message: response.message });
  };

  const fields = [
    { key: "communication", label: "Communication" },
    { key: "problemSolving", label: "Problem Solving" },
    { key: "technicalDepth", label: "Technical Depth" },
    { key: "cultureFit", label: "Culture Fit" },
  ] as const;

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Milestone 6"
        title="Interview Scorecard"
        description="Submit structured evaluation with competency ratings and recommendation."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/app", label: "App" },
          { href: "/app/interviews", label: "Interviews" },
          { label: "Scorecard" },
        ]}
      />
      {priorScorecards.length > 0 ? (
        <div className="rounded-2xl border bg-surface p-4">
          <p className="text-sm font-semibold">Prior submissions (mock)</p>
          <ul className="mt-3 space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
            {priorScorecards.map((row) => (
              <li key={row.id} className="rounded-xl border bg-background p-3">
                <p className="text-xs text-zinc-500">
                  {row.submittedAt} · {row.interviewerName} · {row.recommendation.replace("_", " ")}
                </p>
                <p className="mt-1 text-xs">
                  Ratings: C {row.communication} · PS {row.problemSolving} · TD {row.technicalDepth} · CF {row.cultureFit}
                </p>
                <p className="mt-1 text-xs">{row.comments}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <form className="space-y-4 rounded-2xl border bg-surface p-5" onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field) => (
          <label key={field.key} className="block space-y-1.5">
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">{field.label}</span>
            <select className="h-10 w-full rounded-xl border bg-background px-3 text-sm" {...register(field.key)}>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Needs Improvement</option>
              <option value="3">3 - Meets Expectations</option>
              <option value="4">4 - Strong</option>
              <option value="5">5 - Excellent</option>
            </select>
          </label>
        ))}
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">Recommendation</span>
          <select className="h-10 w-full rounded-xl border bg-background px-3 text-sm" {...register("recommendation")}>
            <option value="hire">Hire</option>
            <option value="no_hire">No Hire</option>
            <option value="hold">Hold</option>
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">Final Comments</span>
          <textarea rows={4} className="w-full rounded-xl border bg-background p-3 text-sm" {...register("comments")} />
          {errors.comments?.message ? <p className="text-xs text-rose-500">{errors.comments.message}</p> : null}
        </label>
        {status ? <FormStatus type={status.type} message={status.message} /> : null}
        <button type="submit" disabled={isSubmitting} className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60">
          {isSubmitting ? "Submitting..." : "Submit Scorecard"}
        </button>
      </form>
    </section>
  );
}
