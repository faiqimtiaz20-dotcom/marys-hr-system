import { MessagesPage } from "@/components/messages/messages-page";

export default async function MessagesRoutePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  return <MessagesPage simulateLoadError={sp.error === "1"} />;
}
