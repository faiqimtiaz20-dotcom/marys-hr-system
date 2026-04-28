"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptInvitation } from "@/services/auth-service";
import { FormInput } from "@/components/shared/form-controls";
import { FormStatus } from "@/components/shared/form-status";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm password is required."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type InvitationValues = z.infer<typeof schema>;

export function AcceptInvitationForm() {
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InvitationValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: InvitationValues) => {
    const response = await acceptInvitation(values.password);
    setResult({
      type: response.success ? "success" : "error",
      message: response.message,
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <p className="text-sm text-zinc-600 dark:text-zinc-300">Your invitation is valid. Create password to activate your account.</p>
      <FormInput
        label="Create Password"
        type="password"
        placeholder="Create password"
        error={errors.password?.message}
        {...register("password")}
      />
      <FormInput
        label="Confirm Password"
        type="password"
        placeholder="Confirm password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      {result ? <FormStatus type={result.type} message={result.message} /> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Accepting..." : "Accept invitation"}
      </button>
    </form>
  );
}
