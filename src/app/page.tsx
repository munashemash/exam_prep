import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Flame,
  Target,
  TimerReset,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import {
  differenceInCalendarDays,
  format,
  formatDistanceToNow,
} from "date-fns";
import { examDate, recentActivity, topics } from "@/data/topics";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";

export default function DashboardPage() {
  const completed = topics.reduce((sum, topic) => sum + topic.completed, 0);
  const total = topics.reduce((sum, topic) => sum + topic.questions, 0);
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow={format(new Date(), "EEEE, d MMMM")}
        title="Ready for a focused session?"
        description="Keep your preparation measurable. Pick up where you stopped or target the areas that need the most attention."
      >
        <Button asChild size="lg">
          <Link href="/practice">
            Start practice <ArrowRight className="size-4" />
          </Link>
        </Button>
      </PageHeader>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Questions completed"
          value={completed.toString()}
          note={`${total - completed} remaining in the bank`}
          icon={CheckCircle2}
        />
        <StatCard
          label="Current streak"
          value="12 days"
          note="Personal best: 18 days"
          icon={Flame}
        />
        <StatCard
          label="Average score"
          value="76%"
          note="Up 4% this week"
          icon={TrendingUp}
        />
        <StatCard
          label="Until exam"
          value={`${differenceInCalendarDays(examDate, new Date())} days`}
          note={format(examDate, "d MMMM yyyy")}
          icon={CalendarDays}
        />
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        <Card>
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle>Topic progress</CardTitle>
              <CardDescription className="mt-2">
                Coverage across the core syllabus.
              </CardDescription>
            </div>
            <Badge variant="secondary">
              {Math.round((completed / total) * 100)}% complete
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            {topics.map((topic) => {
              const percent = Math.round(
                (topic.completed / topic.questions) * 100,
              );
              return (
                <div key={topic.id}>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">{topic.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {topic.completed} of {topic.questions} questions
                      </p>
                    </div>
                    <span className="text-sm tabular-nums text-muted-foreground">
                      {percent}%
                    </span>
                  </div>
                  <Progress value={percent} />
                </div>
              );
            })}
            <Button asChild variant="outline" className="w-full">
              <Link href="/practice">
                View all practice topics <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s focus</CardTitle>
            <CardDescription>Based on your recent performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted/30 p-5">
              <div className="mb-4 flex items-start justify-between">
                <span className="grid size-10 place-items-center rounded-lg bg-primary/15 text-primary">
                  <Target className="size-5" />
                </span>
                <Badge>Recommended</Badge>
              </div>
              <h3 className="font-semibold">Transaction schedules</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Strengthen conflict serialisability and precedence graph
                analysis.
              </p>
              <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <TimerReset className="size-3.5" />
                  20 min
                </span>
                <span>10 questions</span>
              </div>
              <Button asChild className="mt-5 w-full">
                <Link href="/practice">Begin focus set</Link>
              </Button>
            </div>
            <div className="mt-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Daily goal
              </p>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-semibold">
                  12{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    / 20 questions
                  </span>
                </span>
                <span className="text-xs text-primary">8 to go</span>
              </div>
              <Progress value={60} className="mt-3" />
            </div>
          </CardContent>
        </Card>
      </section>
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold">Recent activity</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your latest completed work.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/statistics">
              View statistics <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-3">
          {recentActivity.map((activity) => (
            <Card
              key={activity.id}
              className="transition-colors hover:bg-card/80"
            >
              <CardContent className="flex items-center gap-4 p-4 sm:p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                  <CheckCircle2 className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {activity.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {activity.type} ·{" "}
                    {formatDistanceToNow(new Date(activity.completedAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold tabular-nums">
                    {activity.score}/{activity.total}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((activity.score / activity.total) * 100)}%
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
