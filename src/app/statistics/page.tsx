import {
  BarChart3,
  CheckCircle2,
  Clock3,
  Target,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const metadata = { title: "Statistics" };
const weekly = [
  { day: "Mon", value: 45 },
  { day: "Tue", value: 72 },
  { day: "Wed", value: 54 },
  { day: "Thu", value: 88 },
  { day: "Fri", value: 64 },
  { day: "Sat", value: 95 },
  { day: "Sun", value: 60 },
];
const performance = [
  { topic: "SQL & Relational Algebra", score: 86 },
  { topic: "Database Normalisation", score: 78 },
  { topic: "Transactions & Concurrency", score: 61 },
  { topic: "Indexing & File Structures", score: 57 },
];
export default function StatisticsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Performance"
        title="Study statistics"
        description="Use your activity and accuracy trends to decide what to study next."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Questions answered"
          value="284"
          note="58 this week"
          icon={CheckCircle2}
        />
        <StatCard
          label="Study time"
          value="18h 40m"
          note="4h 15m this week"
          icon={Clock3}
        />
        <StatCard
          label="Overall accuracy"
          value="76%"
          note="4% above last month"
          icon={Target}
        />
        <StatCard
          label="Best topic"
          value="SQL"
          note="86% average accuracy"
          icon={TrendingUp}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly activity</CardTitle>
            <CardDescription>Questions completed each day.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-56 items-end gap-3 sm:gap-5">
              {weekly.map((day) => (
                <div
                  key={day.day}
                  className="flex h-full flex-1 flex-col justify-end gap-2"
                >
                  <div className="relative flex-1">
                    <div
                      className="absolute inset-x-0 bottom-0 rounded-t-md bg-primary/80 transition-colors hover:bg-primary"
                      style={{ height: `${day.value}%` }}
                    >
                      <span className="sr-only">{day.value} percent</span>
                    </div>
                  </div>
                  <span className="text-center text-xs text-muted-foreground">
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Performance by topic</CardTitle>
            <CardDescription>
              Average score across completed sets.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {performance.map((item) => (
              <div key={item.topic}>
                <div className="mb-2 flex justify-between gap-3 text-sm">
                  <span>{item.topic}</span>
                  <span className="text-muted-foreground">{item.score}%</span>
                </div>
                <Progress value={item.score} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
            <BarChart3 className="size-5" />
          </span>
          <div>
            <h2 className="font-semibold">
              Your strongest improvement is in normalisation
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Accuracy increased by 11% over the last four practice sets.
              Prioritise transactions next, where errors cluster around view
              serialisability.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
