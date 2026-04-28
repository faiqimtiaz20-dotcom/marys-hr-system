"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { roleOptions } from "@/mocks/auth";
import { registerAccount } from "@/services/auth-service";
import { FormInput, FormSelect } from "@/components/shared/form-controls";
import { FormStatus } from "@/components/shared/form-status";
import { SsoButtons } from "@/components/auth/sso-buttons";

const schema = z
  .object({
    fullName: z.string().min(2, "Full name is required."),
    email: z.string().email("Enter a valid email address."),
    companyName: z.string().min(2, "Company name is required."),
    role: z.string().min(1, "Select role."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm password is required."),
    agreeTerms: z.boolean().refine((value) => value, "You must accept the terms."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type SignupValues = z.infer<typeof schema>;

export function SignupForm() {
  const router = useRouter();
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "recruiter",
      agreeTerms: false,
    },
  });

  const onSubmit = async (values: SignupValues) => {
    setResult(null);
    const response = await registerAccount(values.email);
    if (!response.success) {
      setResult({
        type: "error",
        message: response.message,
      });
      return;
    }

    setResult({
      type: "success",
      message: `${response.message} Redirecting to onboarding...`,
    });

    window.localStorage.setItem(
      "onboarding-seed",
      JSON.stringify({
        fullName: values.fullName,
        email: values.email,
        companyName: values.companyName,
        role: values.role,
      }),
    );
    setTimeout(() => {
      router.push("/onboarding");
    }, 700);
  };

  return (
    <form className="space-y-3.5" onSubmit={handleSubmit(onSubmit)}>
      <p className="text-sm text-zinc-600 dark:text-zinc-300">Create account and continue onboarding setup.</p>
      <SsoButtons />
      <div className="relative py-1 text-center text-xs text-zinc-500">
        <span className="bg-surface px-2">or create account with email</span>
      </div>
      <FormInput label="Full Name" placeholder="Your name" error={errors.fullName?.message} {...register("fullName")} />
      <FormInput label="Work Email" type="email" placeholder="name@company.com" error={errors.email?.message} {...register("email")} />
      <FormInput label="Company Name" placeholder="Company" error={errors.companyName?.message} {...register("companyName")} />
      <FormSelect
        label="Primary Role"
        error={errors.role?.message}
        options={roleOptions.map((role) => ({ value: role.value, label: role.label }))}
        {...register("role")}
      />
      <FormInput label="Password" type="password" placeholder="Create password" error={errors.password?.message} {...register("password")} />
      <FormInput
        label="Confirm Password"
        type="password"
        placeholder="Confirm password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <label className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-300">
        <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border" {...register("agreeTerms")} />
        <span>I agree to terms and privacy policy.</span>
      </label>
      {errors.agreeTerms?.message ? <p className="text-xs text-rose-500">{errors.agreeTerms.message}</p> : null}
      {result ? <FormStatus type={result.type} message={result.message} /> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>
      <p className="text-xs text-zinc-600 dark:text-zinc-300">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Login
        </Link>
        {" | "}
        <Link href="/role-select" className="font-medium text-primary hover:underline">
          Role selection
        </Link>
      </p>
    </form>
  );
}
