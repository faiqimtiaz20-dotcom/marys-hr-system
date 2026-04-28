"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOtpCode } from "@/services/auth-service";
import { FormInput } from "@/components/shared/form-controls";
import { FormStatus } from "@/components/shared/form-status";

const schema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits."),
});

type OtpValues = z.infer<typeof schema>;

export function VerifyOtpForm() {
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (values: OtpValues) => {
    const response = await verifyOtpCode(values.otp);
    setResult({
      type: response.success ? "success" : "error",
      message: response.message,
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <p className="text-sm text-zinc-600 dark:text-zinc-300">Enter the 6-digit verification code sent to your email.</p>
      <FormInput
        label="OTP Code"
        inputMode="numeric"
        maxLength={6}
        placeholder="123456"
        error={errors.otp?.message}
        {...register("otp")}
      />
      <p className="text-xs text-zinc-600 dark:text-zinc-300">Mock code for testing is 123456.</p>
      {result ? <FormStatus type={result.type} message={result.message} /> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Verifying..." : "Verify code"}
      </button>
    </form>
  );
}
