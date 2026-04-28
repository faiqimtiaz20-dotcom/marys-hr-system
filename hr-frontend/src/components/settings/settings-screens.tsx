"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SettingsPage } from "@/components/settings/settings-page";
import { FormInput, FormSelect } from "@/components/shared/form-controls";
import { FormStatus } from "@/components/shared/form-status";
import { getInvoices } from "@/services/admin-service";
import { Invoice } from "@/types/admin";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name is required."),
  email: z.string().email("Enter a valid email."),
  password: z.union([z.literal(""), z.string().min(8, "Password must be at least 8 characters.")]),
  securityAlerts: z.enum(["enabled", "disabled"]),
});

type ProfileValues = z.infer<typeof profileSchema>;

export function ProfileSettingsScreen() {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "Mary Johnson",
      email: "mary@maryshr.com",
      password: "",
      securityAlerts: "enabled",
    },
  });

  const onSubmit = handleSubmit(async () => {
    setStatus({ type: "success", message: "Profile settings saved (mock)." });
  });

  return (
    <SettingsPage
      title="Profile Settings"
      description="Manage personal profile, security, and notification preferences."
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/app", label: "App" },
        { label: "Profile Settings" },
      ]}
    >
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border bg-surface p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormInput label="Full name" {...register("fullName")} error={errors.fullName?.message} />
          <FormInput label="Email" type="email" {...register("email")} error={errors.email?.message} />
          <FormInput
            label="New password (optional)"
            type="password"
            autoComplete="new-password"
            placeholder="Leave blank to keep current"
            {...register("password")}
            error={errors.password?.message}
          />
          <FormSelect
            label="Security alerts"
            options={[
              { value: "enabled", label: "Security alerts enabled" },
              { value: "disabled", label: "Security alerts disabled" },
            ]}
            {...register("securityAlerts")}
            error={errors.securityAlerts?.message}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          >
            Save profile
          </button>
        </div>
        {status ? <FormStatus type={status.type} message={status.message} /> : null}
      </form>
    </SettingsPage>
  );
}

const companySchema = z.object({
  companyName: z.string().min(2, "Company name is required."),
  website: z.string().url("Enter a valid URL."),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Use a 6-digit hex color, e.g. #4f46e5."),
  workflow: z.enum(["structured", "hybrid"]),
});

type CompanyValues = z.infer<typeof companySchema>;

export function CompanySettingsScreen() {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompanyValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: "Marys HR Online Services",
      website: "https://maryshr.com",
      primaryColor: "#4f46e5",
      workflow: "structured",
    },
  });

  const onSubmit = handleSubmit(async () => {
    setStatus({ type: "success", message: "Company settings saved (mock)." });
  });

  return (
    <SettingsPage
      title="Company Settings"
      description="Control branding and default hiring workflow behavior."
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/app", label: "App" },
        { label: "Company Settings" },
      ]}
    >
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border bg-surface p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormInput label="Company name" {...register("companyName")} error={errors.companyName?.message} />
          <FormInput label="Website" type="url" {...register("website")} error={errors.website?.message} />
          <FormInput label="Primary color (hex)" {...register("primaryColor")} error={errors.primaryColor?.message} />
          <FormSelect
            label="Default workflow"
            options={[
              { value: "structured", label: "Structured hiring workflow" },
              { value: "hybrid", label: "Hybrid workflow" },
            ]}
            {...register("workflow")}
            error={errors.workflow?.message}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
        >
          Save company
        </button>
        {status ? <FormStatus type={status.type} message={status.message} /> : null}
      </form>
    </SettingsPage>
  );
}

const ROLE_MATRIX_ROLES = ["HR Manager", "Recruiter", "Interviewer", "Analytics Viewer"] as const;
const ROLE_MATRIX_CAPS = [
  { id: "jobs.manage", label: "Jobs: create & edit" },
  { id: "candidates.manage", label: "Candidates: manage pipeline" },
  { id: "interviews.schedule", label: "Interviews: schedule" },
  { id: "scorecards.submit", label: "Scorecards: submit" },
  { id: "analytics.view", label: "Analytics: view" },
] as const;

type MatrixKey = `${(typeof ROLE_MATRIX_ROLES)[number]}|${(typeof ROLE_MATRIX_CAPS)[number]["id"]}`;

const defaultMatrix = (): Record<MatrixKey, boolean> => {
  const next = {} as Record<MatrixKey, boolean>;
  for (const role of ROLE_MATRIX_ROLES) {
    for (const cap of ROLE_MATRIX_CAPS) {
      const key = `${role}|${cap.id}` as MatrixKey;
      if (role === "Analytics Viewer") {
        next[key] = cap.id === "analytics.view";
      } else if (role === "Interviewer") {
        next[key] = cap.id === "interviews.schedule" || cap.id === "scorecards.submit";
      } else if (role === "Recruiter") {
        next[key] = cap.id !== "analytics.view";
      } else {
        next[key] = true;
      }
    }
  }
  return next;
};

const rolesMatrixSchema = z
  .object({
    matrix: z.record(z.string(), z.boolean()),
  })
  .superRefine((data, ctx) => {
    if (!Object.values(data.matrix).some(Boolean)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enable at least one permission somewhere in the matrix.",
        path: ["matrix"],
      });
    }
  });

type RolesMatrixValues = z.infer<typeof rolesMatrixSchema>;

export function RolesSettingsScreen() {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [matrix, setMatrix] = useState<Record<MatrixKey, boolean>>(defaultMatrix);

  const {
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RolesMatrixValues>({
    resolver: zodResolver(rolesMatrixSchema),
    defaultValues: { matrix: matrix as Record<string, boolean> },
    values: { matrix: matrix as Record<string, boolean> },
  });

  const toggle = (key: MatrixKey) => {
    setMatrix((prev) => ({ ...prev, [key]: !prev[key] }));
    clearErrors("matrix");
  };

  const onSubmit = handleSubmit(async () => {
    setStatus({ type: "success", message: "Roles and permissions saved (mock)." });
  });
  const matrixErrorMessage = errors.matrix?.message;

  return (
    <SettingsPage
      title="Roles and Permissions"
      description="Configure capability matrix for each team role."
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/app", label: "App" },
        { label: "Roles & Permissions" },
      ]}
    >
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border bg-surface p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b px-2 py-2 text-left font-medium">Capability</th>
                {ROLE_MATRIX_ROLES.map((role) => (
                  <th key={role} className="border-b px-2 py-2 text-center font-medium">
                    {role}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROLE_MATRIX_CAPS.map((cap) => (
                <tr key={cap.id} className="border-b last:border-0">
                  <td className="px-2 py-2">{cap.label}</td>
                  {ROLE_MATRIX_ROLES.map((role) => {
                    const key = `${role}|${cap.id}` as MatrixKey;
                    return (
                      <td key={key} className="px-2 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={matrix[key]}
                          onChange={() => toggle(key)}
                          aria-label={`${role}: ${cap.label}`}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {typeof matrixErrorMessage === "string" ? (
          <p className="text-xs text-rose-500">{matrixErrorMessage}</p>
        ) : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
        >
          Save roles
        </button>
        {status ? <FormStatus type={status.type} message={status.message} /> : null}
      </form>
    </SettingsPage>
  );
}

const notificationSchema = z
  .object({
    interviewReminders: z.boolean(),
    candidateStageChanges: z.boolean(),
    weeklyAnalytics: z.boolean(),
  })
  .refine((v) => v.interviewReminders || v.candidateStageChanges || v.weeklyAnalytics, {
    message: "Select at least one notification channel.",
    path: ["interviewReminders"],
  });

type NotificationValues = z.infer<typeof notificationSchema>;

export function NotificationSettingsScreen() {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NotificationValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      interviewReminders: true,
      candidateStageChanges: true,
      weeklyAnalytics: false,
    },
  });

  const onSubmit = handleSubmit(async () => {
    setStatus({ type: "success", message: "Notification preferences saved (mock)." });
  });

  return (
    <SettingsPage
      title="Notification Settings"
      description="Choose in-app and email event subscriptions."
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/app", label: "App" },
        { label: "Notification Settings" },
      ]}
    >
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border bg-surface p-4">
        <label className="flex items-center gap-3 rounded-xl border bg-background p-3 text-sm">
          <input type="checkbox" {...register("interviewReminders")} />
          Interview reminders
        </label>
        <label className="flex items-center gap-3 rounded-xl border bg-background p-3 text-sm">
          <input type="checkbox" {...register("candidateStageChanges")} />
          Candidate stage changes
        </label>
        <label className="flex items-center gap-3 rounded-xl border bg-background p-3 text-sm">
          <input type="checkbox" {...register("weeklyAnalytics")} />
          Weekly analytics summary
        </label>
        {errors.interviewReminders ? (
          <p className="text-xs text-rose-500">{errors.interviewReminders.message}</p>
        ) : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
        >
          Save notifications
        </button>
        {status ? <FormStatus type={status.type} message={status.message} /> : null}
      </form>
    </SettingsPage>
  );
}

export function BillingSettingsScreen() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    getInvoices().then(setInvoices);
  }, []);

  const sorted = useMemo(() => [...invoices].sort((a, b) => b.issuedAt.localeCompare(a.issuedAt)), [invoices]);

  return (
    <SettingsPage
      title="Billing"
      description="Review plan details, payment method, and invoice history."
      breadcrumbs={[
        { href: "/", label: "Home" },
        { href: "/app", label: "App" },
        { label: "Billing" },
      ]}
    >
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border bg-surface p-4 text-sm">
            <p className="font-semibold">Current plan</p>
            <p className="mt-1 text-zinc-600 dark:text-zinc-300">Growth HR Suite — 25 seats</p>
          </div>
          <div className="rounded-2xl border bg-surface p-4 text-sm">
            <p className="font-semibold">Payment method</p>
            <p className="mt-1 text-zinc-600 dark:text-zinc-300">Visa ending 1298</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border bg-surface">
          <div className="border-b px-4 py-3 text-sm font-semibold">Invoices</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
            <thead className="bg-surface-muted text-left">
              <tr>
                <th className="px-4 py-2">Period</th>
                <th className="px-4 py-2">Issued</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((inv) => (
                <tr key={inv.id} className="border-t">
                  <td className="px-4 py-2">{inv.period}</td>
                  <td className="px-4 py-2">{inv.issuedAt}</td>
                  <td className="px-4 py-2 font-medium">{inv.amount}</td>
                  <td className="px-4 py-2 capitalize">{inv.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </SettingsPage>
  );
}
