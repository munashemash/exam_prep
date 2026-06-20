"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AnswerAttempt } from "@/types/progress";

type StudyState = {
  dailyGoal: number;
  soundEnabled: boolean;
  reducedMotion: boolean;
  attempts: AnswerAttempt[];
  setDailyGoal: (goal: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  recordAttempt: (attempt: Omit<AnswerAttempt, "id" | "answeredAt">) => void;
  clearAttempts: () => void;
};

export const useStudyStore = create<StudyState>()(
  persist(
    (set) => ({
      dailyGoal: 20,
      soundEnabled: false,
      reducedMotion: false,
      attempts: [],
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
    }),
    {
      name: "cos332-study-preferences",
      partialize: ({ dailyGoal, soundEnabled, reducedMotion, attempts }) => ({
        dailyGoal,
        soundEnabled,
        reducedMotion,
        attempts,
      }),
    },
  ),
);
