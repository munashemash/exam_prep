import type { QuestionType, Topic } from "@/types/questions";

export interface AnswerAttempt {
  id: string;
  questionId: string;
  questionType: QuestionType;
  topic: Topic;
  correct: boolean;
  answeredAt: string;
}

export interface TopicPerformance {
  topic: Topic;
  answered: number;
  correct: number;
  accuracy: number;
}
