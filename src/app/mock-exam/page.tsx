import { ArrowRight, Clock3, FileCheck2, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Mock Exam" };
const exams = [
  { title: "Mock Exam 1", status: "Completed", score: "68%", questions: 40 },
  { title: "Mock Exam 2", status: "Completed", score: "74%", questions: 40 },
  { title: "Mock Exam 3", status: "Ready", score: null, questions: 45 },
];
export default function MockExamPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Exam conditions"
        title="Test your readiness"
        description="Timed papers that mirror the structure and pressure of the final assessment."
      />
      <Card className="overflow-hidden border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card">
        <CardContent className="grid gap-8 p-7 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <span className="mb-4 inline-grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Clock3 className="size-5" />
            </span>
            <h2 className="text-2xl font-semibold">Full timed simulation</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              90 minutes, 100 marks, and no hints. Your answers are submitted
              automatically when time expires.
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <FileCheck2 className="size-4" />
                45 questions
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4" />
                One sitting
              </span>
            </div>
          </div>
          <Button size="lg">
            Start mock exam <ArrowRight className="size-4" />
          </Button>
        </CardContent>
      </Card>
      <section>
        <h2 className="mb-4 text-lg font-semibold">Available papers</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {exams.map((exam) => (
            <Card key={exam.title}>
              <CardHeader>
                <div className="mb-3 flex justify-between">
                  <Badge
                    variant={exam.status === "Ready" ? "default" : "secondary"}
                  >
                    {exam.status}
                  </Badge>
                  {exam.score && (
                    <span className="text-lg font-semibold text-primary">
                      {exam.score}
                    </span>
                  )}
                </div>
                <CardTitle className="text-base">{exam.title}</CardTitle>
                <CardDescription>
                  {exam.questions} questions · 90 minutes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant={exam.status === "Ready" ? "default" : "outline"}
                  className="w-full"
                >
                  {exam.status === "Ready" ? "Begin paper" : "Review answers"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
