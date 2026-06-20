"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  History,
} from "lucide-react";
import { longQuestions } from "@/data/questions";
import { topicLabels } from "@/lib/dashboard-analytics";
import { useStudyStore } from "@/store/use-study-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Progress } from "@/components/ui/progress";

export function LongQuestionPractice() {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [markedInSession, setMarkedInSession] = useState(false);
  const revisions = useStudyStore((state) => state.revisions);
  const markRevised = useStudyStore((state) => state.markRevised);
  const question = longQuestions[index];
  const revisionCount = useMemo(
    () =>
      revisions.filter((revision) => revision.questionId === question.id)
        .length,
    [question.id, revisions],
  );

  const move = (direction: number) => {
    setIndex(
      (current) =>
        (current + direction + longQuestions.length) % longQuestions.length,
    );
    setRevealed(false);
    setMarkedInSession(false);
  };

  const handleMarkRevised = () => {
    if (markedInSession) return;
    markRevised(question.id, question.topic);
    setMarkedInSession(true);
  };

  const answerSections = [
    { label: "Definition", value: question.answer.definition },
    { label: "Mechanism", value: question.answer.mechanism },
    { label: "Purpose", value: question.answer.purpose },
    ...(question.answer.example
      ? [{ label: "Example", value: question.answer.example }]
      : []),
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Long-question practice"
        title="Build complete, mark-ready answers"
        description="Attempt each response before revealing the memorandum structure, then mark it as revised."
      />
      <Card className="mx-auto max-w-4xl">
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <Badge>{topicLabels[question.topic]}</Badge>
              <Badge variant="secondary" className="capitalize">
                {question.difficulty}
              </Badge>
              <Badge variant="outline">{question.marks} marks</Badge>
              <Badge variant="outline">{question.year}</Badge>
            </div>
            <span className="text-xs text-muted-foreground">
              Question {index + 1} of {longQuestions.length}
            </span>
          </div>
          <Progress
            value={((index + 1) / longQuestions.length) * 100}
            className="mt-4"
          />
          <CardTitle className="pt-5 text-xl leading-8 sm:text-2xl">
            {question.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-5 sm:p-6">
          <div className="rounded-lg border border-dashed bg-muted/20 p-6 text-center">
            <BookOpen className="mx-auto size-7 text-primary" />
            <p className="mt-3 text-sm font-medium">
              Form your answer before checking the memorandum.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Use Definition → Mechanism → Purpose → Example.
            </p>
            <Button
              className="mt-5"
              variant={revealed ? "outline" : "default"}
              onClick={() => setRevealed((value) => !value)}
            >
              {revealed ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
              {revealed ? "Hide answer" : "Reveal answer"}
            </Button>
          </div>
          {revealed && (
            <div className="grid gap-4" aria-live="polite">
              {answerSections.map((section, sectionIndex) => (
                <section key={section.label} className="rounded-lg border p-5">
                  <div className="flex items-center gap-3">
                    <span className="grid size-7 place-items-center rounded-md bg-primary/15 text-xs font-semibold text-primary">
                      {sectionIndex + 1}
                    </span>
                    <h2 className="font-semibold">{section.label}</h2>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {section.value}
                  </p>
                </section>
              ))}
              <Button
                onClick={handleMarkRevised}
                disabled={markedInSession}
                size="lg"
              >
                {markedInSession ? (
                  <Check className="size-4" />
                ) : (
                  <History className="size-4" />
                )}
                {markedInSession ? "Marked as revised" : "Mark as revised"}
              </Button>
            </div>
          )}
          <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Revised {revisionCount} {revisionCount === 1 ? "time" : "times"}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => move(-1)}>
                <ChevronLeft className="size-4" />
                Previous
              </Button>
              <Button onClick={() => move(1)}>
                Next <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
