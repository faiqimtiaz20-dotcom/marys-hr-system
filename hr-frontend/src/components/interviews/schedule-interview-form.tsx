"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/shared/page-header";
import { FormInput, FormSelect } from "@/components/shared/form-controls";
import { FormStatus } from "@/components/shared/form-status";
import { scheduleInterview } from "@/services/interviews-service";

const schema = z.object({
  candidateName: z.string().min(2, "Candidate is required."),
  jobTitle: z.string().min(2, "Job title is required."),
  interviewer: z.string().min(2, "Interviewer is required."),
  date: z.string().min(2, "Date is required."),
  time: z.string().min(2, "Time is required."),
  type: z.string().min(2, "Interview type is required."),
  notes: z.string().min(2, "Notes are required."),
  calendarProvider: z.string().min(2, "Calendar provider is required."),
});

type Values = z.infer<typeof schema>;

export function ScheduleInterviewForm() {
  const router = useRouter();
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { type: "technical", calendarProvider: "google" },
  });

  const onSubmit = async () => {
    const response = await scheduleInterview();
    setStatus({ type: response.success ? "success" : "error", message: response.message });
    if (response.success) {
      setTimeout(() => router.push("/app/interviews"), 700);
    }
  };

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Milestone 6"
        title="Schedule Interview"
        description="Plan interview event and notify panel members through mock calendar integration."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/app", label: "App" },
          { href: "/app/interviews", label: "Interviews" },
          { label: "Schedule" },
        ]}
      />
      <form className="space-y-4 rounded-2xl border bg-surface p-5" onSubmit={handleSubmit(onSubmit)}>
        <FormInput label="Candidate" error={errors.candidateName?.message} {...register("candidateName")} />
        <FormInput label="Job" error={errors.jobTitle?.message} {...register("jobTitle")} />
        <FormInput label="Panel / Interviewer" error={errors.interviewer?.message} {...register("interviewer")} />
        <div className="grid gap-3 md:grid-cols-2">
          <FormInput label="Date" type="date" error={errors.date?.message} {...register("date")} />
          <FormInput label="Time" type="time" error={errors.time?.message} {...register("time")} />
        </div>
        <FormSelect
          label="Interview Type"
          error={errors.type?.message}
          options={[
            { value: "screening", label: "Screening" },
            { value: "technical", label: "Technical" },
            { value: "behavioral", label: "Behavioral" },
            { value: "final", label: "Final" },
          ]}
          {...register("type")}
        />
        <FormSelect
          label="Calendar Provider"
          error={errors.calendarProvider?.message}
          options={[
            { value: "google", label: "Google Calendar" },
            { value: "outlook", label: "Outlook Calendar" },
          ]}
          {...register("calendarProvider")}
        />
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">Notes / Instructions</span>
          <textarea rows={4} className="w-full rounded-xl border bg-background p-3 text-sm" {...register("notes")} />
          {errors.notes?.message ? <p className="text-xs text-rose-500">{errors.notes.message}</p> : null}
        </label>
        {status ? <FormStatus type={status.type} message={status.message} /> : null}
        <button type="submit" disabled={isSubmitting} className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60">
          {isSubmitting ? "Scheduling..." : "Schedule and Send Invite"}
        </button>
      </form>
    </section>
  );
}
