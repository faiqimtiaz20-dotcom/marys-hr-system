"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput, FormSelect } from "@/components/shared/form-controls";
import { roleOptions } from "@/mocks/auth";

const schema = z.object({
  companyName: z.string().min(2, "Company name is required."),
  website: z.string().url("Enter a valid website URL."),
  companySize: z.string().min(1, "Select company size."),
  role: z.string().min(1, "Select your role."),
  hiringGoal: z.string().min(2, "Hiring goal is required."),
  preferredInterviewType: z.string().min(1, "Select interview type."),
  timezone: z.string().min(1, "Timezone is required."),
});

type OnboardingValues = z.infer<typeof schema>;

const stepTitles = ["Company", "Role", "Hiring Preferences"];

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const defaults = useMemo(() => {
    if (typeof window === "undefined") {
      return {};
    }
    const raw = window.localStorage.getItem("onboarding-seed");
    return raw ? (JSON.parse(raw) as Partial<OnboardingValues>) : {};
  }, []);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: defaults.companyName ?? "",
      website: "",
      companySize: "11-50",
      role: defaults.role ?? "recruiter",
      hiringGoal: "",
      preferredInterviewType: "structured",
      timezone: "Asia/Karachi",
    },
  });

  const nextStep = async () => {
    const fieldsByStep: Array<Array<keyof OnboardingValues>> = [
      ["companyName", "website", "companySize"],
      ["role", "timezone"],
      ["hiringGoal", "preferredInterviewType"],
    ];

    const valid = await trigger(fieldsByStep[step]);
    if (!valid) {
      return;
    }
    setStep((value) => Math.min(value + 1, stepTitles.length - 1));
  };

  const prevStep = () => {
    setStep((value) => Math.max(value - 1, 0));
  };

  const onSubmit = async (values: OnboardingValues) => {
    await new Promise((resolve) => setTimeout(resolve, 900));
    window.localStorage.setItem("onboarding-config", JSON.stringify(values));
    setSubmitted(true);
    setTimeout(() => {
      router.push("/app");
    }, 900);
  };

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Onboarding</p>
        <h1 className="text-3xl font-semibold tracking-tight">Set up your hiring workspace</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Complete this quick setup to personalize your recruiting dashboard and interview flow.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {stepTitles.map((title, index) => (
          <div
            key={title}
            className={`rounded-xl border px-3 py-2 text-sm ${index <= step ? "bg-surface font-medium" : "text-zinc-500"}`}
          >
            {index + 1}. {title}
          </div>
        ))}
      </div>

      <form className="space-y-4 rounded-2xl border bg-surface p-5" onSubmit={handleSubmit(onSubmit)}>
        {step === 0 ? (
          <>
            <FormInput label="Company Name" error={errors.companyName?.message} {...register("companyName")} />
            <FormInput
              label="Company Website"
              placeholder="https://example.com"
              error={errors.website?.message}
              {...register("website")}
            />
            <FormSelect
              label="Company Size"
              error={errors.companySize?.message}
              options={[
                { value: "1-10", label: "1-10 employees" },
                { value: "11-50", label: "11-50 employees" },
                { value: "51-200", label: "51-200 employees" },
                { value: "200+", label: "200+ employees" },
              ]}
              {...register("companySize")}
            />
          </>
        ) : null}

        {step === 1 ? (
          <>
            <FormSelect
              label="Primary Role"
              error={errors.role?.message}
              options={roleOptions.map((role) => ({ value: role.value, label: role.label }))}
              {...register("role")}
            />
            <FormInput label="Timezone" error={errors.timezone?.message} {...register("timezone")} />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <FormInput
              label="Hiring Goal"
              placeholder="Example: Hire 12 engineers in 6 months"
              error={errors.hiringGoal?.message}
              {...register("hiringGoal")}
            />
            <FormSelect
              label="Preferred Interview Type"
              error={errors.preferredInterviewType?.message}
              options={[
                { value: "structured", label: "Structured interview flow" },
                { value: "panel", label: "Panel interview flow" },
                { value: "hybrid", label: "Hybrid interview flow" },
              ]}
              {...register("preferredInterviewType")}
            />
          </>
        ) : null}

        {submitted ? (
          <p className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
            Workspace configured successfully. Redirecting to dashboard.
          </p>
        ) : null}

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 0}
            className="inline-flex h-10 items-center rounded-xl border px-4 text-sm transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            Back
          </button>
          {step < stepTitles.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
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
              {isSubmitting ? "Saving setup..." : "Finish setup"}
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
