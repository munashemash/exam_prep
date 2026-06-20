import { ArrowRight, FilePenLine, Layers3, Timer } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Long Questions" };
const questions = [
  {
    title: "Normalise a university database",
    topic: "Normalisation",
    marks: 20,
    time: 30,
    description: "Identify dependencies and decompose a schema into BCNF.",
  },
  {
    title: "Analyse a concurrent schedule",
    topic: "Transactions",
    marks: 25,
    time: 35,
    description:
      "Build a precedence graph and assess conflict serialisability.",
  },
  {
    title: "Design an indexing strategy",
    topic: "Physical design",
    marks: 20,
    time: 30,
    description: "Compare index options for a mixed analytical workload.",
  },
];
export default function LongQuestionsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Written practice"
        title="Long-form questions"
        description="Develop structured, mark-ready answers for multi-part problems and design scenarios."
      />
      <div className="grid gap-5">
        {questions.map((question, index) => (
          <Card
            key={question.title}
            className="transition-colors hover:border-primary/35"
          >
            <CardContent className="grid gap-5 p-6 sm:grid-cols-[auto_1fr_auto] sm:items-center">
              <span className="grid size-12 place-items-center rounded-xl bg-secondary text-primary">
                <FilePenLine className="size-5" />
              </span>
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{question.topic}</Badge>
                  <span className="text-xs text-muted-foreground">
                    Question {index + 1}
                  </span>
                </div>
                <h2 className="font-semibold">{question.title}</h2>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                  {question.description}
                </p>
                <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Layers3 className="size-3.5" />
                    {question.marks} marks
                  </span>
                  <span className="flex items-center gap-1">
                    <Timer className="size-3.5" />
                    {question.time} min
                  </span>
                </div>
              </div>
              <Button variant="outline">
                Open question <ArrowRight className="size-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
