import { QuestionBankPage } from "@/components/question-bank/question-bank-page";

export default async function QuestionBankRoute({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  return <QuestionBankPage simulateLoadError={sp.error === "1"} />;
}
