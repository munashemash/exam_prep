"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { CheckCircle2, Clock3, Flame, Target } from "lucide-react";
import { format } from "date-fns";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMounted } from "@/hooks/use-mounted";
import {
  calculateDashboardAnalytics,
  topicLabels,
} from "@/lib/dashboard-analytics";
import {
  calculateStudyStatistics,
  formatStudyTime,
} from "@/lib/study-statistics";
import { useStudyStore } from "@/store/use-study-store";

const StatisticsCharts = dynamic(
  () =>
    import("@/components/statistics/statistics-charts").then(
      (module) => module.StatisticsCharts,
    ),
  {
    loading: () => (
      <div
        className="h-96 animate-pulse rounded-xl bg-card"
        role="status"
        aria-label="Loading charts"
      />
    ),
  },
);

export function StatisticsDashboard() {
  const mounted = useMounted();
  const attempts = useStudyStore((state) => state.attempts);
  const examAttempts = useStudyStore((state) => state.examAttempts);
  const analytics = useMemo(
    () => calculateDashboardAnalytics(attempts),
    [attempts],
  );
  const statistics = useMemo(
    () => calculateStudyStatistics(attempts, examAttempts),
    [attempts, examAttempts],
  );

  if (!mounted)
    return (
      <div
        className="h-96 animate-pulse rounded-xl bg-card"
        role="status"
        aria-label="Loading statistics"
      />
    );
  if (attempts.length === 0)
    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow="Performance"
          title="Study statistics"
          description="Your practice and exam history will appear here."
        />
        <Card>
          <CardContent className="p-10 text-center">
            <h2 className="font-semibold">No statistics yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Answer practice questions or complete a mock exam to build your
              analytics.
            </p>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Performance"
        title="Study statistics"
        description="Every chart is calculated from practice history stored on this device."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Questions answered"
          value={attempts.length.toString()}
          note={`${analytics.correctAnswers} correct`}
          icon={CheckCircle2}
        />
        <StatCard
          label="Overall accuracy"
          value={`${analytics.overallAccuracy}%`}
          note={`${analytics.topicPerformance.length} topics attempted`}
          icon={Target}
        />
        <StatCard
          label="Study streak"
          value={`${statistics.studyStreak} days`}
          note="Consecutive active days"
          icon={Flame}
        />
        <StatCard
          label="Time practising"
          value={formatStudyTime(statistics.timeSpentSeconds)}
          note="Tracked active answer time"
          icon={Clock3}
        />
      </div>
      <StatisticsCharts
        topicAccuracy={statistics.topicAccuracy}
        activity={statistics.activity}
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent exam attempts</CardTitle>
            <CardDescription>
              Your five latest mock exam results.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statistics.recentExams.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No mock exams completed yet.
              </p>
            ) : (
              <div className="space-y-3">
                {statistics.recentExams.map((exam) => {
                  const percentage = Math.round(
                    (exam.correctAnswers / exam.totalQuestions) * 100,
                  );
                  return (
                    <div
                      key={exam.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {format(
                            new Date(exam.completedAt),
                            "d MMM yyyy, HH:mm",
                          )}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {exam.correctAnswers}/{exam.totalQuestions} correct ·{" "}
                          {Math.ceil(exam.durationSeconds / 60)} min
                        </p>
                      </div>
                      <Badge variant={percentage >= 80 ? "default" : "outline"}>
                        {percentage}%
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Most missed questions</CardTitle>
            <CardDescription>
              Questions with the highest incorrect-attempt count.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statistics.mostMissed.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No incorrect answers recorded.
              </p>
            ) : (
              <ol className="space-y-3">
                {statistics.mostMissed.map((item, index) => (
                  <li
                    key={item.question!.id}
                    className="flex gap-3 rounded-lg border p-3"
                  >
                    <span className="text-xs text-muted-foreground">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium">
                        {item.question!.question}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {topicLabels[item.question!.topic]}
                      </p>
                    </div>
                    <Badge variant="outline">{item.count} missed</Badge>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
