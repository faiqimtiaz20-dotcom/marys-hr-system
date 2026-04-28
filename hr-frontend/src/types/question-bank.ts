export type QuestionDifficulty = "easy" | "medium" | "hard";

export interface QuestionItem {
  id: string;
  title: string;
  questionText: string;
  category: string;
  role: string;
  difficulty: QuestionDifficulty;
  expectedSignals: string;
  redFlags: string;
  ratingRubric: string;
  attachedToKit: boolean;
}
