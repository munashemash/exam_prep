"use client";

import { CalendarClock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useExamCountdown } from "@/hooks/use-exam-countdown";

const units = ["days", "hours", "minutes", "seconds"] as const;

export function CountdownCard() {
  const countdown = useExamCountdown();

  return (
    <Card className="overflow-hidden border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card">
      <CardContent className="flex h-full flex-col justify-between gap-6 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Countdown to exam</p>
            <p className="mt-1 text-xs text-muted-foreground">
              24 June 2026 at 12:00 SAST
            </p>
          </div>
          <span className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary">
            <CalendarClock className="size-4" />
          </span>
        </div>
        {countdown?.elapsed ? (
          <p className="text-xl font-semibold">The exam has started.</p>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {units.map((unit) => (
              <div
                key={unit}
                className="rounded-lg bg-background/60 p-2 text-center"
              >
                <p className="text-xl font-semibold tabular-nums sm:text-2xl">
                  {countdown ? String(countdown[unit]).padStart(2, "0") : "--"}
                </p>
                <p className="mt-1 truncate text-[10px] uppercase tracking-wide text-muted-foreground">
                  {unit}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
