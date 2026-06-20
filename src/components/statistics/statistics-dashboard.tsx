"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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

const tooltipStyle = {
  backgroundColor: "hsl(222 38% 8%)",
  border: "1px solid hsl(217 22% 17%)",
  borderRadius: "8px",
  fontSize: "12px",
};

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
    return <div className="h-96 animate-pulse rounded-xl bg-card" />;
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
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Accuracy by topic"
          description="Correct answers as a percentage of attempts."
        >
          <BarChart
            data={statistics.topicAccuracy}
            accessibilityLayer
            margin={{ left: 0, right: 8, top: 8 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="topic"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-25}
              textAnchor="end"
              height={75}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar
              dataKey="accuracy"
              name="Accuracy %"
              fill="hsl(var(--primary))"
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ChartCard>
        <ChartCard
          title="Questions answered over time"
          description="Activity during the last 14 days."
        >
          <LineChart
            data={statistics.activity}
            accessibilityLayer
            margin={{ left: 0, right: 12, top: 8 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Line
              type="monotone"
              dataKey="questions"
              name="Questions"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", r: 3 }}
            />
          </LineChart>
        </ChartCard>
      </div>
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

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactElement;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full" role="img" aria-label={title}>
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
