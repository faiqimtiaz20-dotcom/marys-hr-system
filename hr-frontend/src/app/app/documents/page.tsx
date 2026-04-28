import { DocumentsPage } from "@/components/documents/documents-page";

export default async function DocumentsRoutePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  return <DocumentsPage simulateLoadError={sp.error === "1"} />;
}
