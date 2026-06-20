"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type StudyState = {
  dailyGoal: number;
  soundEnabled: boolean;
  reducedMotion: boolean;
  setDailyGoal: (goal: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
};

export const useStudyStore = create<StudyState>()(
  persist(
    (set) => ({
      dailyGoal: 20,
      soundEnabled: false,
      reducedMotion: false,
      setDailyGoal: (dailyGoal) => set({ dailyGoal }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
    }),
    { name: "cos332-study-preferences" },
  ),
);
