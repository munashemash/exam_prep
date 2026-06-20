"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AnswerAttempt,
  ExamAttempt,
  RevisionRecord,
} from "@/types/progress";
import type { Topic } from "@/types/questions";

type StudyState = {
  dailyGoal: number;
  soundEnabled: boolean;
  reducedMotion: boolean;
  attempts: AnswerAttempt[];
  revisions: RevisionRecord[];
  examAttempts: ExamAttempt[];
  setDailyGoal: (goal: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  recordAttempt: (attempt: Omit<AnswerAttempt, "id" | "answeredAt">) => void;
  clearAttempts: () => void;
  markRevised: (questionId: string, topic: Topic) => void;
  saveExamAttempt: (attempt: ExamAttempt) => void;
};

export const useStudyStore = create<StudyState>()(
  persist(
    (set) => ({
      dailyGoal: 20,
      soundEnabled: false,
      reducedMotion: false,
      attempts: [],
      revisions: [],
      examAttempts: [],
      setDailyGoal: (dailyGoal) => set({ dailyGoal }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      recordAttempt: (attempt) =>
        set((state) => ({
          attempts: [
            ...state.attempts,
            {
              ...attempt,
              id: crypto.randomUUID(),
              answeredAt: new Date().toISOString(),
            },
          ],
        })),
      clearAttempts: () => set({ attempts: [] }),
      markRevised: (questionId, topic) =>
        set((state) => ({
          revisions: [
            ...state.revisions,
            {
              id: crypto.randomUUID(),
              questionId,
              topic,
              revisedAt: new Date().toISOString(),
            },
          ],
        })),
      saveExamAttempt: (examAttempt) =>
        set((state) => ({
          examAttempts: [...state.examAttempts, examAttempt],
          attempts: [
            ...state.attempts,
            ...examAttempt.answers.map((answer) => ({
              id: crypto.randomUUID(),
              questionId: answer.questionId,
              questionType: "mcq" as const,
              topic: answer.topic,
              correct: answer.correct,
              answeredAt: examAttempt.completedAt,
              source: "exam" as const,
              durationSeconds: Math.round(
                examAttempt.durationSeconds / examAttempt.totalQuestions,
              ),
            })),
          ],
        })),
    }),
    {
      name: "cos332-study-preferences",
      partialize: ({
        dailyGoal,
        soundEnabled,
        reducedMotion,
        attempts,
        revisions,
        examAttempts,
      }) => ({
        dailyGoal,
        soundEnabled,
        reducedMotion,
        attempts,
        revisions,
        examAttempts,
      }),
    },
  ),
);
