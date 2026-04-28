"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestResetLink } from "@/services/auth-service";
import { FormInput } from "@/components/shared/form-controls";
import { FormStatus } from "@/components/shared/form-status";

const schema = z.object({
  email: z.string().email("Enter a valid email address."),
});

type ForgotValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: ForgotValues) => {
    const response = await requestResetLink(values.email);
    setResult({
      type: response.success ? "success" : "error",
      message: response.message,
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <p className="text-sm text-zinc-600 dark:text-zinc-300">We will send a secure reset link to your email.</p>
      <FormInput
        label="Work Email"
        type="email"
        placeholder="name@company.com"
        error={errors.email?.message}
        {...register("email")}
      />
      {result ? <FormStatus type={result.type} message={result.message} /> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}
