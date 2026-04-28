"use client";

import dayjs from "dayjs";
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { FormStatus } from "@/components/shared/form-status";
import { ListEmptyState, ListErrorState, ListLoadingSkeleton } from "@/components/shared/list-states";
import { getMessages, getMessageTemplates, getMessageThreads, sendMessageMock } from "@/services/communication-service";
import { MessageItem, MessageTemplate, MessageThread } from "@/types/communication";

export function MessagesPage({ simulateLoadError = false }: { simulateLoadError?: boolean }) {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string>("");
  const [threadMessages, setThreadMessages] = useState<MessageItem[]>([]);
  const [draft, setDraft] = useState("");
  const [scheduleAt, setScheduleAt] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [inboxLoading, setInboxLoading] = useState(true);
  const [inboxError, setInboxError] = useState<string | null>(null);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [lastInboxUpdated, setLastInboxUpdated] = useState<Date | null>(null);
  const simulatedFailRef = useRef(false);

  const loadInbox = useCallback(async () => {
    setInboxLoading(true);
    setInboxError(null);
    try {
      if (simulateLoadError && !simulatedFailRef.current) {
        simulatedFailRef.current = true;
        throw new Error("Simulated load failure. Remove ?error=1 from the URL or press Retry.");
      }
      const [threadItems, templateItems] = await Promise.all([getMessageThreads(), getMessageTemplates()]);
      setThreads(threadItems);
      setTemplates(templateItems);
      setLastInboxUpdated(new Date());
      setSelectedThreadId((prev) => {
        if (prev && threadItems.some((t) => t.id === prev)) return prev;
        return threadItems[0]?.id ?? "";
      });
    } catch (err) {
      setInboxError(err instanceof Error ? err.message : "Could not load conversations.");
    } finally {
      setInboxLoading(false);
    }
  }, [simulateLoadError]);

  const loadMessages = useCallback(async (threadId: string) => {
    if (!threadId) {
      setThreadMessages([]);
      return;
    }
    setMessagesLoading(true);
    setMessagesError(null);
    try {
      const items = await getMessages(threadId);
      setThreadMessages(items);
    } catch (err) {
      setMessagesError(err instanceof Error ? err.message : "Could not load messages.");
      setThreadMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  useEffect(() => {
    startTransition(() => {
      void loadInbox();
    });
  }, [loadInbox]);

  useEffect(() => {
    if (!selectedThreadId || inboxLoading || inboxError) return;
    startTransition(() => {
      void loadMessages(selectedThreadId);
    });
  }, [selectedThreadId, inboxLoading, inboxError, loadMessages]);

  const selectedThread = useMemo(
    () => threads.find((thread) => thread.id === selectedThreadId) ?? null,
    [threads, selectedThreadId],
  );

  const applyTemplate = (templateId: string) => {
    const template = templates.find((item) => item.id === templateId);
    if (!template || !selectedThread) return;
    const replaced = template.body
      .replace("{{candidate_name}}", selectedThread.candidateName)
      .replace("{{role}}", selectedThread.role);
    setDraft(replaced);
  };

  const resetComposer = () => {
    setDraft("");
    setScheduleAt("");
    setStatus(null);
  };

  const onSend = async () => {
    if (!draft.trim()) {
      setStatus({ type: "error", message: "Write a message before sending." });
      return;
    }
    const response = await sendMessageMock();
    setStatus({ type: response.success ? "success" : "error", message: response.message });
    if (!response.success || !selectedThreadId) return;

    setThreadMessages((prev) => [
      ...prev,
      {
        id: `msg_${Date.now()}`,
        threadId: selectedThreadId,
        sender: "recruiter",
        body: draft,
        sentAt: new Date().toISOString(),
      },
    ]);
    setDraft("");
  };

  const onScheduleSend = async () => {
    if (!draft.trim()) {
      setStatus({ type: "error", message: "Write a message before scheduling send." });
      return;
    }
    if (!scheduleAt) {
      setStatus({ type: "error", message: "Select schedule date and time first." });
      return;
    }
    const response = await sendMessageMock();
    setStatus({
      type: response.success ? "success" : "error",
      message: response.success
        ? `Message scheduled for ${new Date(scheduleAt).toLocaleString()} (mock).`
        : response.message,
    });
    if (response.success) {
      setDraft("");
      setScheduleAt("");
    }
  };

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Milestone 9"
        title="Messages"
        description="Manage recruiter-candidate conversations with reusable message templates."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/app", label: "App" },
          { label: "Messages" },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
        <span>
          {lastInboxUpdated ? `Inbox refreshed ${dayjs(lastInboxUpdated).format("MMM D, YYYY h:mm A")}` : "Not loaded yet"}
        </span>
        <button
          type="button"
          onClick={() => void loadInbox()}
          className="rounded-lg border bg-surface px-2 py-1 font-medium text-foreground transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Refresh inbox
        </button>
      </div>

      {inboxLoading ? <ListLoadingSkeleton className="h-48" /> : null}

      {!inboxLoading && inboxError ? (
        <ListErrorState title="Could not load inbox" message={inboxError} onRetry={() => void loadInbox()} />
      ) : null}

      {!inboxLoading && !inboxError && threads.length === 0 ? (
        <ListEmptyState title="No conversations" description="There are no message threads in the mock dataset yet." />
      ) : null}

      {!inboxLoading && !inboxError && threads.length > 0 ? (
        <div className="grid gap-3 lg:grid-cols-[280px_1fr_280px]">
          <article className="rounded-2xl border bg-surface p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">Conversations</p>
              <button
                type="button"
                onClick={resetComposer}
                className="text-xs text-primary underline-offset-2 hover:underline"
              >
                Clear draft
              </button>
            </div>
            <div className="mt-3 space-y-2" role="navigation" aria-label="Message threads">
              {threads.map((thread) => (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => setSelectedThreadId(thread.id)}
                  aria-current={selectedThreadId === thread.id ? "true" : undefined}
                  aria-label={`Open conversation with ${thread.candidateName} for ${thread.role}`}
                  className={`w-full rounded-xl border px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    selectedThreadId === thread.id ? "bg-primary/10 border-primary/40" : "bg-background"
                  }`}
                >
                  <p className="text-sm font-medium">{thread.candidateName}</p>
                  <p className="text-xs text-zinc-500">{thread.role}</p>
                  <p className="mt-1 text-[11px] text-zinc-500">{thread.lastMessageAt}</p>
                </button>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border bg-surface p-3">
            <p className="text-sm font-semibold">
              {selectedThread ? `${selectedThread.candidateName} - ${selectedThread.role}` : "Select conversation"}
            </p>
            {messagesError ? (
              <div className="mt-3">
                <ListErrorState title="Could not load thread" message={messagesError} onRetry={() => void loadMessages(selectedThreadId)} />
              </div>
            ) : (
              <div
                className="mt-3 h-[min(50vh,320px)] space-y-2 overflow-y-auto rounded-xl border bg-background p-3 sm:h-[320px]"
                aria-label="Conversation messages"
              >
                {messagesLoading ? (
                  <div className="space-y-2" aria-busy="true">
                    <div className="h-10 animate-pulse rounded-lg bg-surface-muted" />
                    <div className="h-10 animate-pulse rounded-lg bg-surface-muted" />
                  </div>
                ) : (
                  threadMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${message.sender === "recruiter" ? "ml-auto bg-primary/10" : "bg-surface-muted"}`}
                    >
                      <p>{message.body}</p>
                      <p className="mt-1 text-[11px] text-zinc-500">{message.sentAt}</p>
                    </div>
                  ))
                )}
              </div>
            )}
            <div className="mt-3 space-y-2">
              <textarea
                rows={4}
                className="w-full rounded-xl border bg-background p-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Write message..."
                aria-label="Message draft"
              />
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={onSend}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Send Message
                </button>
                <input
                  type="datetime-local"
                  className="h-10 rounded-xl border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                  value={scheduleAt}
                  onChange={(event) => setScheduleAt(event.target.value)}
                  aria-label="Schedule send time"
                />
                <button
                  type="button"
                  onClick={onScheduleSend}
                  className="rounded-xl border px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Schedule Send
                </button>
              </div>
            </div>
            {status ? (
              <div className="mt-2">
                <FormStatus type={status.type} message={status.message} />
              </div>
            ) : null}
          </article>

          <article className="rounded-2xl border bg-surface p-3">
            <p className="text-sm font-semibold">Templates</p>
            {templates.length === 0 ? (
              <p className="mt-3 text-sm text-zinc-500">No templates available.</p>
            ) : (
              <div className="mt-3 space-y-2" aria-label="Message templates">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => applyTemplate(template.id)}
                    aria-label={`Apply template ${template.title}`}
                    className="w-full rounded-xl border bg-background px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <p className="text-sm font-medium">{template.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{template.body}</p>
                  </button>
                ))}
              </div>
            )}
          </article>
        </div>
      ) : null}
    </section>
  );
}
