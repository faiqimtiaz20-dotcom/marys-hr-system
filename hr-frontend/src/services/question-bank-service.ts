import { mockQuestionBank } from "@/mocks/question-bank";
import { QuestionItem } from "@/types/question-bank";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getQuestionBank(): Promise<QuestionItem[]> {
  await wait(260);
  return mockQuestionBank;
}

export async function saveQuestion(
  payload: Omit<QuestionItem, "id"> & { id?: string },
): Promise<{ success: boolean; message: string; item?: QuestionItem }> {
  await wait(320);
  if (!payload.title || !payload.questionText || !payload.category) {
    return { success: false, message: "Title, question text, and category are required." };
  }

  const item: QuestionItem = {
    id: payload.id ?? `qb_${Date.now()}`,
    ...payload,
  };

  return {
    success: true,
    message: payload.id ? "Question updated successfully." : "Question created successfully.",
    item,
  };
}
