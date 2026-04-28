import { cn } from "@/lib/utils";

export function FormStatus({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) {
  return (
    <p
      className={cn(
        "rounded-xl border px-3 py-2 text-xs",
        type === "success"
          ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
          : "border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300",
      )}
    >
      {message}
    </p>
  );
}
