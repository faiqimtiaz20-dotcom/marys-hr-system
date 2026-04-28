"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveJob } from "@/services/jobs-service";
import { PageHeader } from "@/components/shared/page-header";
import { FormInput, FormSelect } from "@/components/shared/form-controls";
import { FormStatus } from "@/components/shared/form-status";
import { JobItem } from "@/types/jobs";

const schema = z.object({
  title: z.string().min(2, "Title is required."),
  department: z.string().min(2, "Department is required."),
  location: z.string().min(2, "Location is required."),
  employmentType: z.string().min(2, "Employment type is required."),
  jobDescription: z.string().min(20, "Job description must be more detailed."),
  responsibilities: z.string().min(20, "Responsibilities are required."),
  salaryRange: z.string().min(2, "Salary range is required."),
  experienceLevel: z.string().min(2, "Experience level is required."),
  requiredSkills: z.string().min(2, "Required skills are needed."),
  screeningQuestions: z.string().min(2, "Screening questions are needed."),
  interviewPlan: z.string().min(2, "Interview plan is required."),
  publishStatus: z.string().min(2, "Publish status is required."),
});

type JobFormValues = z.infer<typeof schema>;

export function JobForm({ mode, initialJob }: { mode: "create" | "edit"; initialJob?: JobItem }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [skillInput, setSkillInput] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [questionInput, setQuestionInput] = useState("");
  const [screeningQuestionsList, setScreeningQuestionsList] = useState<string[]>([]);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<JobFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialJob?.title ?? "",
      department: initialJob?.department ?? "",
      location: initialJob?.location ?? "",
      employmentType: initialJob?.employmentType ?? "full_time",
      jobDescription: "",
      responsibilities: "",
      salaryRange: initialJob?.salaryRange ?? "",
      experienceLevel: initialJob?.experienceLevel ?? "",
      requiredSkills: "",
      screeningQuestions: "",
      interviewPlan: "",
      publishStatus: initialJob?.status ?? "draft",
    },
  });

  const stepFields: Array<Array<keyof JobFormValues>> = [
    ["title", "department", "location", "employmentType", "jobDescription", "responsibilities"],
    ["salaryRange", "experienceLevel", "requiredSkills", "screeningQuestions"],
    ["interviewPlan", "publishStatus"],
  ];

  const onNext = async () => {
    const valid = await trigger(stepFields[step]);
    if (!valid) return;
    setStep((value) => Math.min(value + 1, 2));
  };

  const onBack = () => setStep((value) => Math.max(value - 1, 0));

  const onSubmit = async (values: JobFormValues) => {
    const composed = {
      ...values,
      requiredSkills: selectedSkills.join(", "),
      screeningQuestions: screeningQuestionsList.join(" | "),
    };
    const response = await saveJob(composed);
    setStatus({ type: response.success ? "success" : "error", message: response.message });
    if (response.success) {
      setTimeout(() => {
        router.push("/app/jobs");
      }, 700);
    }
  };

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value) return;
    if (!selectedSkills.includes(value)) {
      const next = [...selectedSkills, value];
      setSelectedSkills(next);
      setValue("requiredSkills", next.join(", "), { shouldValidate: true });
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    const next = selectedSkills.filter((item) => item !== skill);
    setSelectedSkills(next);
    setValue("requiredSkills", next.join(", "), { shouldValidate: true });
  };

  const addQuestion = () => {
    const value = questionInput.trim();
    if (!value) return;
    const next = [...screeningQuestionsList, value];
    setScreeningQuestionsList(next);
    setValue("screeningQuestions", next.join(" | "), { shouldValidate: true });
    setQuestionInput("");
  };

  const removeQuestion = (index: number) => {
    const next = screeningQuestionsList.filter((_, itemIndex) => itemIndex !== index);
    setScreeningQuestionsList(next);
    setValue("screeningQuestions", next.join(" | "), { shouldValidate: true });
  };

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Milestone 4"
        title={mode === "create" ? "Create Job" : "Edit Job"}
        description="Use this multi-step workflow to define role details, requirements, and publishing settings."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/app", label: "App" },
          { href: "/app/jobs", label: "Jobs" },
          { label: mode === "create" ? "Create" : "Edit" },
        ]}
      />

      <div className="grid gap-2 sm:grid-cols-3">
        {["Basic details", "Requirements", "Publish settings"].map((title, index) => (
          <div
            key={title}
            className={`rounded-xl border px-3 py-2 text-sm ${index <= step ? "bg-surface font-medium" : "text-zinc-500"}`}
          >
            {index + 1}. {title}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border bg-surface p-5">
        {step === 0 ? (
          <>
            <FormInput label="Job Title" error={errors.title?.message} {...register("title")} />
            <FormInput label="Department" error={errors.department?.message} {...register("department")} />
            <FormInput label="Location" error={errors.location?.message} {...register("location")} />
            <FormSelect
              label="Employment Type"
              error={errors.employmentType?.message}
              options={[
                { value: "full_time", label: "Full time" },
                { value: "part_time", label: "Part time" },
                { value: "contract", label: "Contract" },
                { value: "internship", label: "Internship" },
              ]}
              {...register("employmentType")}
            />
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">Job Description</span>
              <div className="rounded-xl border bg-background p-2">
                <div className="mb-2 flex gap-2">
                  <button type="button" onClick={() => setValue("jobDescription", `${getValues("jobDescription")}\n**Bold highlight**`, { shouldValidate: true })} className="rounded-md border px-2 py-1 text-xs">Bold</button>
                  <button type="button" onClick={() => setValue("jobDescription", `${getValues("jobDescription")}\n- Bullet point`, { shouldValidate: true })} className="rounded-md border px-2 py-1 text-xs">Bullet</button>
                  <button type="button" onClick={() => setValue("jobDescription", `${getValues("jobDescription")}\n### Heading`, { shouldValidate: true })} className="rounded-md border px-2 py-1 text-xs">Heading</button>
                </div>
                <textarea
                  rows={5}
                  className="w-full resize-none rounded-lg border bg-background p-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Write role summary and expectations."
                  {...register("jobDescription")}
                />
              </div>
              {errors.jobDescription?.message ? <p className="text-xs text-rose-500">{errors.jobDescription.message}</p> : null}
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">Responsibilities</span>
              <textarea
                rows={4}
                className="w-full rounded-xl border bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="List the top role responsibilities."
                {...register("responsibilities")}
              />
              {errors.responsibilities?.message ? <p className="text-xs text-rose-500">{errors.responsibilities.message}</p> : null}
            </label>
          </>
        ) : null}

        {step === 1 ? (
          <>
            <FormInput label="Salary Range" error={errors.salaryRange?.message} {...register("salaryRange")} />
            <FormInput label="Experience Level" error={errors.experienceLevel?.message} {...register("experienceLevel")} />
            <input type="hidden" {...register("requiredSkills")} />
            <input type="hidden" {...register("screeningQuestions")} />
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">Required Skills</span>
              <div className="flex gap-2">
                <input
                  className="h-11 flex-1 rounded-xl border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.target.value)}
                  placeholder="Add skill and press button"
                />
                <button type="button" onClick={addSkill} className="inline-flex h-11 items-center rounded-xl border px-4 text-sm">
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <button key={skill} type="button" onClick={() => removeSkill(skill)} className="rounded-full border bg-background px-3 py-1 text-xs">
                    {skill} x
                  </button>
                ))}
              </div>
              {errors.requiredSkills?.message ? <p className="text-xs text-rose-500">{errors.requiredSkills.message}</p> : null}
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">Screening Question Builder</span>
              <div className="flex gap-2">
                <input
                  className="h-11 flex-1 rounded-xl border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={questionInput}
                  onChange={(event) => setQuestionInput(event.target.value)}
                  placeholder="Add screening question"
                />
                <button type="button" onClick={addQuestion} className="inline-flex h-11 items-center rounded-xl border px-4 text-sm">
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {screeningQuestionsList.map((question, index) => (
                  <div key={`${question}-${index}`} className="flex items-center justify-between rounded-xl border bg-background px-3 py-2 text-sm">
                    <p>{index + 1}. {question}</p>
                    <button type="button" className="text-xs text-rose-500" onClick={() => removeQuestion(index)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              {errors.screeningQuestions?.message ? <p className="text-xs text-rose-500">{errors.screeningQuestions.message}</p> : null}
            </label>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <FormInput label="Interview Plan" error={errors.interviewPlan?.message} {...register("interviewPlan")} />
            <FormSelect
              label="Publish Status"
              error={errors.publishStatus?.message}
              options={[
                { value: "draft", label: "Save as draft" },
                { value: "open", label: "Publish now" },
                { value: "paused", label: "Pause posting" },
              ]}
              {...register("publishStatus")}
            />
          </>
        ) : null}

        {status ? <FormStatus type={status.type} message={status.message} /> : null}

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onBack}
            disabled={step === 0}
            className="inline-flex h-10 items-center rounded-xl border px-4 text-sm transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            Back
          </button>
          {step < 2 ? (
            <button
              type="button"
              onClick={onNext}
              className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : mode === "create" ? "Create Job" : "Update Job"}
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
