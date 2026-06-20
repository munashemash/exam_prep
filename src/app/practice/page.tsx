import { ArrowRight, BookOpenCheck, Filter } from "lucide-react";
import { topics } from "@/data/topics";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const metadata = { title: "Practice" };
export default function PracticePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Question bank"
        title="Practice by topic"
        description="Build accuracy with short, targeted question sets. Progress is saved automatically."
      >
        <Button variant="outline">
          <Filter className="size-4" />
          Filter topics
        </Button>
      </PageHeader>
      <div className="grid gap-5 md:grid-cols-2">
        {topics.map((topic) => {
          const percent = Math.round((topic.completed / topic.questions) * 100);
          return (
            <Card
              key={topic.id}
              className="group flex flex-col transition-colors hover:border-primary/40"
            >
              <CardHeader>
                <div className="mb-4 flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-lg bg-secondary text-primary">
                    <BookOpenCheck className="size-5" />
                  </span>
                  <Badge
                    variant={
                      topic.difficulty === "Advanced" ? "outline" : "secondary"
                    }
                  >
                    {topic.difficulty}
                  </Badge>
                </div>
                <CardTitle>{topic.title}</CardTitle>
                <CardDescription className="leading-6">
                  {topic.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                  <span>
                    {topic.completed} / {topic.questions} completed
                  </span>
                  <span>{percent}%</span>
                </div>
                <Progress value={percent} />
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="secondary">
                  Continue topic{" "}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
