"use client";

import { useEffect } from "react";
import { useStudyStore } from "@/store/use-study-store";

export function AccessibilityPreferences() {
  const reducedMotion = useStudyStore((state) => state.reducedMotion);

  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reducedMotion);
    return () => document.documentElement.classList.remove("reduce-motion");
  }, [reducedMotion]);

  return null;
}
