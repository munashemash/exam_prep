import type { QuestionType, Topic } from "@/types/questions";

export interface AnswerAttempt {
  id: string;
  questionId: string;
  questionType: QuestionType;
  topic: Topic;
  correct: boolean;
  answeredAt: string;
  source?: "practice" | "exam";
  durationSeconds?: number;
}

export interface ExamAnswer {
  questionId: string;
  topic: Topic;
  selectedAnswer: number | null;
  correctAnswer: number;
  correct: boolean;
}

export interface ExamAttempt {
  id: string;
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  totalQuestions: number;
  correctAnswers: number;
  answers: ExamAnswer[];
}

export interface TopicPerformance {
  topic: Topic;
  answered: number;
  correct: number;
  accuracy: number;
}

export interface RevisionRecord {
  id: string;
  questionId: string;
  topic: Topic;
  revisedAt: string;
}
