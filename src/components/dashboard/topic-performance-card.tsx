import { BarChart3 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { topicLabels } from "@/lib/dashboard-analytics";
import type { TopicPerformance } from "@/types/progress";

export function TopicPerformanceCard({
  performance,
}: {
  performance: TopicPerformance[];
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Topic performance</CardTitle>
            <CardDescription className="mt-2">
              Accuracy across attempted topics.
            </CardDescription>
          </div>
          <span className="grid size-9 place-items-center rounded-lg bg-secondary text-primary">
            <BarChart3 className="size-4" />
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {performance.map((item) => (
          <div key={item.topic}>
            <div className="mb-2 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{topicLabels[item.topic]}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.correct} correct from {item.answered}
                </p>
              </div>
              <span className="text-sm font-semibold tabular-nums">
                {item.accuracy}%
              </span>
            </div>
            <Progress
              value={item.accuracy}
              aria-label={`${topicLabels[item.topic]} accuracy: ${item.accuracy}%`}
              className={
                item.accuracy < 80 ? "[&>div]:bg-amber-400" : undefined
              }
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
