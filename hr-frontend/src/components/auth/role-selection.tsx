"use client";

import { useRouter } from "next/navigation";
import { roleOptions } from "@/mocks/auth";

export function RoleSelection() {
  const router = useRouter();

  const handleSelect = (role: string) => {
    const seedRaw = window.localStorage.getItem("onboarding-seed");
    const seed = seedRaw ? JSON.parse(seedRaw) : {};
    window.localStorage.setItem("onboarding-seed", JSON.stringify({ ...seed, role }));
    router.push("/signup");
  };

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Role Selection</p>
        <h1 className="text-3xl font-semibold tracking-tight">Choose your workspace role</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Select the role that matches your responsibilities. You can still update permissions later.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {roleOptions.map((role) => (
          <button
            type="button"
            key={role.value}
            onClick={() => handleSelect(role.value)}
            className="rounded-2xl border bg-surface p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-sm font-semibold">{role.label}</p>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">{role.note}</p>
            <p className="mt-3 text-xs font-medium text-primary">Select role</p>
          </button>
        ))}
      </div>
    </section>
  );
}
