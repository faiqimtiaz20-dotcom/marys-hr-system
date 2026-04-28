"use client";

import dayjs from "dayjs";
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/shared/page-header";
import { FormInput, FormSelect } from "@/components/shared/form-controls";
import { FormStatus } from "@/components/shared/form-status";
import { ListEmptyState, ListErrorState, ListLoadingSkeleton } from "@/components/shared/list-states";
import { ModalDialog } from "@/components/shared/modal-dialog";
import { getQuestionBank, saveQuestion } from "@/services/question-bank-service";
import { QuestionDifficulty, QuestionItem } from "@/types/question-bank";

const schema = z.object({
  title: z.string().min(2, "Title is required."),
  questionText: z.string().min(10, "Question text is required."),
  category: z.string().min(2, "Category is required."),
  role: z.string().min(2, "Role is required."),
  difficulty: z.enum(["easy", "medium", "hard"]),
  expectedSignals: z.string().min(2, "Expected signals are required."),
  redFlags: z.string().min(2, "Red flags are required."),
  ratingRubric: z.string().min(2, "Rating rubric is required."),
  attachedToKit: z.boolean(),
});

type Values = z.infer<typeof schema>;

const PAGE_SIZE = 6;

export function QuestionBankPage({ simulateLoadError = false }: { simulateLoadError?: boolean }) {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState<QuestionDifficulty | "all">("all");
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<QuestionItem | null>(null);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const simulatedFailRef = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { difficulty: "medium", attachedToKit: false },
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (simulateLoadError && !simulatedFailRef.current) {
        simulatedFailRef.current = true;
        throw new Error("Simulated load failure. Remove ?error=1 from the URL or press Retry.");
      }
      const items = await getQuestionBank();
      setQuestions(items);
      setLastUpdated(new Date());
      setPage(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load question bank.");
    } finally {
      setLoading(false);
    }
  }, [simulateLoadError]);

  useEffect(() => {
    startTransition(() => {
      void load();
    });
  }, [load]);

  const categories = useMemo(() => {
    return ["all", ...Array.from(new Set(questions.map((item) => item.category)))];
  }, [questions]);

  const filtered = useMemo(() => {
    return questions
      .filter((item) => (category === "all" ? true : item.category === category))
      .filter((item) => (difficulty === "all" ? true : item.difficulty === difficulty))
      .filter((item) =>
        `${item.title} ${item.questionText} ${item.role}`.toLowerCase().includes(query.toLowerCase()),
      );
  }, [questions, category, difficulty, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageSlice = useMemo(() => {
    const start = safePage * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setDifficulty("all");
    setPage(0);
  };

  const startCreate = () => {
    setEditing(null);
    setStatus(null);
    reset({
      title: "",
      questionText: "",
      category: "",
      role: "",
      difficulty: "medium",
      expectedSignals: "",
      redFlags: "",
      ratingRubric: "",
      attachedToKit: false,
    });
    setOpen(true);
  };

  const startEdit = (item: QuestionItem) => {
    setEditing(item);
    setStatus(null);
    reset({
      title: item.title,
      questionText: item.questionText,
      category: item.category,
      role: item.role,
      difficulty: item.difficulty,
      expectedSignals: item.expectedSignals,
      redFlags: item.redFlags,
      ratingRubric: item.ratingRubric,
      attachedToKit: item.attachedToKit,
    });
    setOpen(true);
  };

  const onSubmit = async (values: Values) => {
    const response = await saveQuestion({
      id: editing?.id,
      ...values,
    });
    setStatus({ type: response.success ? "success" : "error", message: response.message });
    if (!response.success || !response.item) return;

    setQuestions((prev) => {
      const exists = prev.some((item) => item.id === response.item!.id);
      if (!exists) return [response.item!, ...prev];
      return prev.map((item) => (item.id === response.item!.id ? response.item! : item));
    });

    setTimeout(() => setOpen(false), 600);
  };

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Milestone 7"
        title="Question Bank"
        description="Manage reusable interview questions with categories, roles, difficulty, and rubric guidance."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/app", label: "App" },
          { label: "Question Bank" },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
        <span>
          {lastUpdated ? `Last refreshed ${dayjs(lastUpdated).format("MMM D, YYYY h:mm A")}` : "Not loaded yet"}
        </span>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border bg-surface px-2 py-1 font-medium text-foreground transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Refresh data
        </button>
      </div>

      <div className="rounded-2xl border bg-surface p-3">
        <div className="flex flex-wrap gap-2">
          <input
            className="h-10 min-w-[220px] flex-1 rounded-xl border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Search title, question, role"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            aria-label="Search questions"
          />
          <select
            className="h-10 rounded-xl border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setPage(0);
            }}
            aria-label="Filter by category"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "All categories" : item}
              </option>
            ))}
          </select>
          <select
            className="h-10 rounded-xl border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
            value={difficulty}
            onChange={(event) => {
              setDifficulty(event.target.value as QuestionDifficulty | "all");
              setPage(0);
            }}
            aria-label="Filter by difficulty"
          >
            <option value="all">All levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button
            type="button"
            onClick={resetFilters}
            className="h-10 rounded-xl border bg-background px-3 text-sm transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Reset filters
          </button>
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Add Question
          </button>
        </div>
      </div>

      {loading ? <ListLoadingSkeleton /> : null}

      {!loading && error ? (
        <ListErrorState title="Could not load question bank" message={error} onRetry={() => void load()} />
      ) : null}

      {!loading && !error && questions.length === 0 ? (
        <ListEmptyState title="No questions" description="Add a question or refresh once mock data is available." />
      ) : null}

      {!loading && !error && questions.length > 0 && filtered.length === 0 ? (
        <ListEmptyState title="No matching questions" description="Try clearing filters or broadening your search." />
      ) : null}

      {!loading && !error && filtered.length > 0 ? (
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            {pageSlice.map((item) => (
              <article key={item.id} className="rounded-2xl border bg-surface p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <span className="rounded-full border bg-background px-2 py-1 text-[11px] capitalize">{item.difficulty}</span>
                </div>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{item.questionText}</p>
                <p className="mt-2 text-xs text-zinc-500">
                  {item.category} | {item.role} | {item.attachedToKit ? "Attached to kit" : "Not attached"}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="rounded-xl border px-3 py-1.5 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border px-3 py-1.5 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Attach to interview kit
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600 dark:text-zinc-300">
            <span>
              Showing {safePage * PAGE_SIZE + 1}–{Math.min((safePage + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={safePage <= 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="rounded-lg border bg-surface px-2 py-1 font-medium transition enabled:hover:bg-surface-muted disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={safePage >= pageCount - 1}
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                className="rounded-lg border bg-surface px-2 py-1 font-medium transition enabled:hover:bg-surface-muted disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ModalDialog open={open} onClose={() => setOpen(false)} title={editing ? "Edit Question" : "Create Question"}>
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Title" error={errors.title?.message} {...register("title")} />
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">Question Text</span>
            <textarea
              rows={4}
              className="w-full rounded-xl border bg-background p-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
              {...register("questionText")}
            />
            {errors.questionText?.message ? <p className="text-xs text-rose-500">{errors.questionText.message}</p> : null}
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            <FormInput label="Category" error={errors.category?.message} {...register("category")} />
            <FormInput label="Role" error={errors.role?.message} {...register("role")} />
          </div>
          <FormSelect
            label="Difficulty"
            error={errors.difficulty?.message}
            options={[
              { value: "easy", label: "Easy" },
              { value: "medium", label: "Medium" },
              { value: "hard", label: "Hard" },
            ]}
            {...register("difficulty")}
          />
          <FormInput label="Expected Signals" error={errors.expectedSignals?.message} {...register("expectedSignals")} />
          <FormInput label="Red Flags" error={errors.redFlags?.message} {...register("redFlags")} />
          <FormInput label="Rating Rubric" error={errors.ratingRubric?.message} {...register("ratingRubric")} />
          <label className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border"
              onChange={(event) => setValue("attachedToKit", event.target.checked)}
              defaultChecked={editing?.attachedToKit ?? false}
            />
            Attach to interview kit
          </label>
          {status ? <FormStatus type={status.type} message={status.message} /> : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : editing ? "Update Question" : "Create Question"}
          </button>
        </form>
      </ModalDialog>
    </section>
  );
}
