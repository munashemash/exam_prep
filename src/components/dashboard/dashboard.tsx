"use client";

import { CheckCircle2, HelpCircle, ShieldCheck, Target } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CountdownCard } from "@/components/dashboard/countdown-card";
import { OnboardingCard } from "@/components/dashboard/onboarding-card";
import { RecommendationCard } from "@/components/dashboard/recommendation-card";
import { TopicPerformanceCard } from "@/components/dashboard/topic-performance-card";
import { WeakTopicsCard } from "@/components/dashboard/weak-topics-card";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { useMounted } from "@/hooks/use-mounted";
import { calculateDashboardAnalytics } from "@/lib/dashboard-analytics";
import { useStudyStore } from "@/store/use-study-store";

export function Dashboard() {
  const mounted = useMounted();
  const attempts = useStudyStore((state) => state.attempts);
  const analytics = useMemo(
    () => calculateDashboardAnalytics(attempts),
    [attempts],
  );

  if (!mounted) {
    return (
      <div className="space-y-8" aria-label="Loading dashboard">
        <div className="h-32 animate-pulse rounded-xl bg-card" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="h-40 animate-pulse rounded-xl bg-card xl:col-span-2" />
          <div className="h-40 animate-pulse rounded-xl bg-card" />
          <div className="h-40 animate-pulse rounded-xl bg-card" />
        </div>
      </div>
    );
  }

  const hasData = analytics.questionsAnswered > 0;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Exam preparation"
        title="Your COS332 dashboard"
        description="A focused view of your readiness for the 24 June exam. Your progress stays in this browser."
      >
        <Button asChild>
          <Link href="/practice">Continue practice</Link>
        </Button>
      </PageHeader>

      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Study overview"
      >
        <div className="sm:col-span-2 xl:col-span-2">
          <CountdownCard />
        </div>
        <StatCard
          label="Overall accuracy"
          value={hasData ? `${analytics.overallAccuracy}%` : "—"}
          note={
            hasData
              ? `${analytics.correctAnswers} correct answers`
              : "Complete a set to calculate"
          }
          icon={Target}
        />
        <StatCard
          label="Questions answered"
          value={analytics.questionsAnswered.toString()}
          note={hasData ? "Saved on this device" : "No answers recorded yet"}
          icon={CheckCircle2}
        />
      </section>

      {!hasData ? (
        <OnboardingCard />
      ) : (
        <>
          <section className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
            <TopicPerformanceCard performance={analytics.topicPerformance} />
            <div className="space-y-6">
              <WeakTopicsCard topics={analytics.weakTopics} />
              {analytics.recommendedTopic && (
                <RecommendationCard topic={analytics.recommendedTopic} />
              )}
            </div>
          </section>
          <div className="flex items-start gap-3 rounded-lg border bg-card/50 p-4 text-xs leading-5 text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            <p>
              Progress is stored in localStorage on this device. Clearing
              browser data will remove your answer history.
            </p>
          </div>
        </>
      )}

      {!hasData && (
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <HelpCircle className="size-3.5" />
          Analytics appear after your first submitted answer.
        </div>
      )}
    </div>
  );
}
