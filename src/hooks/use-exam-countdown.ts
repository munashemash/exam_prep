"use client";

import { intervalToDuration, isAfter } from "date-fns";
import { useEffect, useState } from "react";

export const examDate = new Date("2026-06-24T12:00:00+02:00");

export function useExamCountdown() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateNow = () => setNow(new Date());
    updateNow();
    const timer = window.setInterval(updateNow, 1_000);
    return () => window.clearInterval(timer);
  }, []);

  if (!now) return null;
  if (isAfter(now, examDate)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, elapsed: true };
  }

  const duration = intervalToDuration({ start: now, end: examDate });
  return {
    days: duration.days ?? 0,
    hours: duration.hours ?? 0,
    minutes: duration.minutes ?? 0,
    seconds: duration.seconds ?? 0,
    elapsed: false,
  };
}
