"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Shield } from "lucide-react";
import { postLoginRedirectPath } from "@/config/routes";
import { loginWithEmail } from "@/services/auth-service";
import { FormInput } from "@/components/shared/form-controls";
import { FormStatus } from "@/components/shared/form-status";
import { SsoButtons } from "@/components/auth/sso-buttons";

const schema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  rememberMe: z.boolean().optional(),
});

type LoginValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "mary@maryshr.com",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginValues) => {
    setResult(null);
    const response = await loginWithEmail(values.email, values.password);
    if (response.success) {
      router.push(postLoginRedirectPath);
      return;
    }
    setResult({ type: "error", message: response.message });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <SsoButtons />

      <div className="relative flex items-center gap-3 py-0.5">
        <span className="h-px flex-1 bg-border" aria-hidden />
        <span className="shrink-0 text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Or continue with email
        </span>
        <span className="h-px flex-1 bg-border" aria-hidden />
      </div>

      <div className="space-y-4">
        <FormInput
          label="Work email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <FormInput
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register("password")}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-400">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
            {...register("rememberMe")}
          />
          Keep me signed in
        </label>
      </div>

      {result ? <FormStatus type={result.type} message={result.message} /> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:opacity-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-55"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Signing in…
          </>
        ) : (
          "Sign in to workspace"
        )}
      </button>

      <p className="flex items-start justify-center gap-2 text-center text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-500">
        <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/80" aria-hidden />
        <span>
          Sessions use encrypted transport (TLS). This build uses mock authentication — use any password with 8+
          characters for a demo account email.
        </span>
      </p>

      <div className="flex items-center justify-between gap-3 border-t border-border pt-5 text-sm">
        <Link
          href="/forgot-password"
          className="font-medium text-primary transition hover:text-primary/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Forgot password?
        </Link>
        <Link
          href="/signup"
          className="font-medium text-zinc-600 transition hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-zinc-400"
        >
          Create organization
        </Link>
      </div>
    </form>
  );
}
