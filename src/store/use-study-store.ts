"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AnswerAttempt, RevisionRecord } from "@/types/progress";
import type { Topic } from "@/types/questions";

type StudyState = {
  dailyGoal: number;
  soundEnabled: boolean;
  reducedMotion: boolean;
  attempts: AnswerAttempt[];
  revisions: RevisionRecord[];
  setDailyGoal: (goal: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  recordAttempt: (attempt: Omit<AnswerAttempt, "id" | "answeredAt">) => void;
  clearAttempts: () => void;
  markRevised: (questionId: string, topic: Topic) => void;
};

export const useStudyStore = create<StudyState>()(
  persist(
    (set) => ({
      dailyGoal: 20,
      soundEnabled: false,
      reducedMotion: false,
      attempts: [],
      revisions: [],
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
    }),
    {
      name: "cos332-study-preferences",
      partialize: ({
        dailyGoal,
        soundEnabled,
        reducedMotion,
        attempts,
        revisions,
      }) => ({ dailyGoal, soundEnabled, reducedMotion, attempts, revisions }),
    },
  ),
);
