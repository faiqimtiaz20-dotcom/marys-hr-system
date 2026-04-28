"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPassword } from "@/services/auth-service";
import { FormInput } from "@/components/shared/form-controls";
import { FormStatus } from "@/components/shared/form-status";

const schema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Minimum 8 characters.")
      .regex(/[A-Z]/, "Must include uppercase letter.")
      .regex(/[0-9]/, "Must include at least one number."),
    confirmPassword: z.string().min(8, "Confirm password is required."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type ResetValues = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async () => {
    const response = await resetPassword();
    setResult({
      type: response.success ? "success" : "error",
      message: response.message,
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <p className="text-sm text-zinc-600 dark:text-zinc-300">Create a strong password for your account.</p>
      <FormInput
        label="New Password"
        type="password"
        placeholder="New password"
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />
      <FormInput
        label="Confirm Password"
        type="password"
        placeholder="Confirm password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <div className="rounded-xl border bg-surface p-3 text-xs text-zinc-600 dark:text-zinc-300">
        Password checklist: at least 8 characters, one uppercase letter, and one number.
      </div>
      {result ? <FormStatus type={result.type} message={result.message} /> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}
