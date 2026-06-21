import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { topicLabels } from "@/lib/dashboard-analytics";
import type { TopicPerformance } from "@/types/progress";

export function RecommendationCard({ topic }: { topic: TopicPerformance }) {
  return (
    <Card className="border-primary/25">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
            <Sparkles className="size-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Recommended next topic
            </p>
            <h2 className="mt-2 text-xl font-semibold">
              {topicLabels[topic.topic]}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Your current accuracy is {topic.accuracy}% from {topic.answered}{" "}
              {topic.answered === 1 ? "question" : "questions"}. A focused set
              here offers the clearest improvement.
            </p>
          </div>
        </div>
        <Button asChild className="mt-5 w-full">
          <Link href={`/practice?topic=${topic.topic}`} prefetch={false}>
            Practice this topic <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
