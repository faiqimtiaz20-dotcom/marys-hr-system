import { cn } from "@/lib/utils";
import { useId, type InputHTMLAttributes, type SelectHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function FormInput({ label, error, className, id, ...props }: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;

  return (
    <label className="block space-y-1.5" htmlFor={inputId}>
      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">{label}</span>
      <input
        {...props}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring",
          error ? "border-rose-400" : "",
          className,
        )}
      />
      {error ? (
        <p id={errorId} className="text-xs text-rose-500" role="alert">
          {error}
        </p>
      ) : null}
    </label>
  );
}

type SelectOption = { value: string; label: string };

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  options: SelectOption[];
};

export function FormSelect({ label, error, options, className, id, ...props }: SelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const errorId = `${selectId}-error`;

  return (
    <label className="block space-y-1.5" htmlFor={selectId}>
      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">{label}</span>
      <select
        {...props}
        id={selectId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring",
          error ? "border-rose-400" : "",
          className,
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={errorId} className="text-xs text-rose-500" role="alert">
          {error}
        </p>
      ) : null}
    </label>
  );
}
