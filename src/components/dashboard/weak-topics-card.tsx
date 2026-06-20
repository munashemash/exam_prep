import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { topicLabels } from "@/lib/dashboard-analytics";
import type { TopicPerformance } from "@/types/progress";

export function WeakTopicsCard({ topics }: { topics: TopicPerformance[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weak topics</CardTitle>
        <CardDescription>
          Attempted topics below the 80% target.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {topics.length === 0 ? (
          <div className="flex gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium">No weak topics detected</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Every attempted topic is currently at or above 80%.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {topics.map((topic) => (
              <div
                key={topic.topic}
                className="flex items-center gap-3 rounded-lg border bg-muted/20 p-3"
              >
                <AlertTriangle className="size-4 shrink-0 text-amber-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {topicLabels[topic.topic]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {topic.answered} answered
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="border-amber-400/30 text-amber-300"
                >
                  {topic.accuracy}%
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
