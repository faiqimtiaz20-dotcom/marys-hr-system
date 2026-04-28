"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { postLoginRedirectPath } from "@/config/routes";
import { loginWithSso } from "@/services/auth-service";
import { FormStatus } from "@/components/shared/form-status";

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
    <path
      fill="#EA4335"
      d="M12 10.2v3.9h5.5c-.2 1.3-.8 2.4-1.8 3.1l2.9 2.2c1.7-1.6 2.7-3.9 2.7-6.8 0-.7-.1-1.4-.2-2H12z"
    />
    <path
      fill="#34A853"
      d="M12 21c2.4 0 4.4-.8 5.9-2.1l-2.9-2.2c-.8.6-1.8 1-3 1-2.3 0-4.2-1.5-4.9-3.6H4v2.3C5.5 19.2 8.5 21 12 21z"
    />
    <path
      fill="#FBBC05"
      d="M7.1 14.1c-.2-.6-.3-1.3-.3-2.1s.1-1.4.3-2.1V7.6H4C3.4 8.8 3 10.4 3 12s.4 3.2 1 4.4l3.1-2.3z"
    />
    <path
      fill="#4285F4"
      d="M12 6.3c1.3 0 2.5.5 3.4 1.3l2.5-2.5C16.4 3.7 14.4 3 12 3 8.5 3 5.5 4.8 4 7.6l3.1 2.3c.7-2.1 2.6-3.6 4.9-3.6z"
    />
  </svg>
);

const MicrosoftIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
    <path fill="#F25022" d="M3 3h8.5v8.5H3z" />
    <path fill="#7FBA00" d="M12.5 3H21v8.5h-8.5z" />
    <path fill="#00A4EF" d="M3 12.5h8.5V21H3z" />
    <path fill="#FFB900" d="M12.5 12.5H21V21h-8.5z" />
  </svg>
);

export function SsoButtons() {
  const router = useRouter();
  const [loadingProvider, setLoadingProvider] = useState<"google" | "microsoft" | null>(null);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSso = async (provider: "google" | "microsoft") => {
    setStatus(null);
    setLoadingProvider(provider);
    const response = await loginWithSso(provider);
    setLoadingProvider(null);
    if (response.success) {
      router.push(postLoginRedirectPath);
      return;
    }
    setStatus({ type: "error", message: response.message });
  };

  return (
    <div className="space-y-3">
      <p className="text-center text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        Single sign-on
      </p>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => handleSso("google")}
          disabled={loadingProvider !== null}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground shadow-sm transition hover:bg-surface-muted disabled:pointer-events-none disabled:opacity-55 dark:bg-surface/50 dark:hover:bg-surface-muted/80"
        >
          {loadingProvider === "google" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <GoogleIcon />
          )}
          {loadingProvider === "google" ? "Connecting…" : "Google"}
        </button>
        <button
          type="button"
          onClick={() => handleSso("microsoft")}
          disabled={loadingProvider !== null}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground shadow-sm transition hover:bg-surface-muted disabled:pointer-events-none disabled:opacity-55 dark:bg-surface/50 dark:hover:bg-surface-muted/80"
        >
          {loadingProvider === "microsoft" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <MicrosoftIcon />
          )}
          {loadingProvider === "microsoft" ? "Connecting…" : "Microsoft"}
        </button>
      </div>
      {status ? <FormStatus type={status.type} message={status.message} /> : null}
    </div>
  );
}
