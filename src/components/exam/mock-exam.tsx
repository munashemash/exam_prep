"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileCheck2,
  RotateCcw,
} from "lucide-react";
import { mcqQuestions } from "@/data/questions";
import { gradeExam, generateMockExam } from "@/lib/mock-exam";
import { topicLabels } from "@/lib/dashboard-analytics";
import { useStudyStore } from "@/store/use-study-store";
import type { ExamAttempt } from "@/types/progress";
import type { MCQQuestion, Topic } from "@/types/questions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const EXAM_SECONDS = 60 * 60;
type ExamState = "ready" | "active" | "results";

export function MockExam() {
  const [state, setState] = useState<ExamState>("ready");
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(EXAM_SECONDS);
  const [result, setResult] = useState<ExamAttempt | null>(null);
  const saveExamAttempt = useStudyStore((store) => store.saveExamAttempt);
  const examAttempts = useStudyStore((store) => store.examAttempts);

  const submitExam = useCallback(() => {
    if (state !== "active" || !startedAt || questions.length === 0) return;
    const completedAt = new Date();
    const gradedAnswers = gradeExam(questions, answers);
    const attempt: ExamAttempt = {
      id: crypto.randomUUID(),
      startedAt: startedAt.toISOString(),
      completedAt: completedAt.toISOString(),
      durationSeconds: Math.min(
        EXAM_SECONDS,
        Math.round((completedAt.getTime() - startedAt.getTime()) / 1000),
      ),
      totalQuestions: questions.length,
      correctAnswers: gradedAnswers.filter((answer) => answer.correct).length,
      answers: gradedAnswers,
    };
    saveExamAttempt(attempt);
    setResult(attempt);
    setState("results");
  }, [answers, questions, saveExamAttempt, startedAt, state]);

  useEffect(() => {
    if (state !== "active" || !startedAt) return;
    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - startedAt.getTime()) / 1000);
      setRemainingSeconds(Math.max(0, EXAM_SECONDS - elapsed));
    };
    updateTimer();
    const timer = window.setInterval(updateTimer, 1_000);
    return () => window.clearInterval(timer);
  }, [startedAt, state]);

  useEffect(() => {
    if (state === "active" && remainingSeconds === 0) submitExam();
  }, [remainingSeconds, state, submitExam]);

  const startExam = () => {
    const generated = generateMockExam(mcqQuestions);
    setQuestions(generated);
    setAnswers({});
    setCurrentIndex(0);
    setStartedAt(new Date());
    setRemainingSeconds(EXAM_SECONDS);
    setResult(null);
    setState("active");
  };

  if (state === "active") {
    return (
      <ActiveExam
        questions={questions}
        answers={answers}
        setAnswers={setAnswers}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        remainingSeconds={remainingSeconds}
        onSubmit={submitExam}
      />
    );
  }
  if (state === "results" && result) {
    return (
      <ExamResults
        attempt={result}
        questions={questions}
        onRestart={startExam}
      />
    );
  }

  const latest = examAttempts.at(-1);
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Mock exam"
        title="Simulate exam conditions"
        description="A 50-question paper weighted to match historical COS332 topic coverage."
      />
      <Card className="overflow-hidden border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card">
        <CardContent className="grid gap-8 p-7 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <span className="mb-4 inline-grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Clock3 className="size-5" />
            </span>
            <h2 className="text-2xl font-semibold">60-minute simulation</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Answer 50 randomized MCQs. You can navigate freely, and the exam
              submits automatically when time expires.
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <FileCheck2 className="size-4" />
                50 questions
              </span>
              <span className="flex items-center gap-1.5">
                <Clock3 className="size-4" />
                60 minutes
              </span>
            </div>
          </div>
          <Button size="lg" onClick={startExam}>
            Start mock exam <ArrowRight className="size-4" />
          </Button>
        </CardContent>
      </Card>
      {latest && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Most recent attempt</CardTitle>
            <CardDescription>
              {new Date(latest.completedAt).toLocaleDateString("en-ZA")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-semibold">
                {Math.round(
                  (latest.correctAnswers / latest.totalQuestions) * 100,
                )}
                %
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {latest.correctAnswers} / {latest.totalQuestions} correct
              </p>
            </div>
            <Badge variant="secondary">Saved locally</Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

type ActiveExamProps = {
  questions: MCQQuestion[];
  answers: Record<string, number>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  remainingSeconds: number;
  onSubmit: () => void;
};
function ActiveExam({
  questions,
  answers,
  setAnswers,
  currentIndex,
  setCurrentIndex,
  remainingSeconds,
  onSubmit,
}: ActiveExamProps) {
  const question = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  return (
    <div className="space-y-5">
      <div className="sticky top-16 z-30 -mx-4 flex items-center justify-between gap-4 border-b bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div>
          <p className="text-xs text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </p>
          <Progress
            value={(answeredCount / questions.length) * 100}
            aria-label={`${answeredCount} of ${questions.length} questions answered`}
            className="mt-2 w-32 sm:w-52"
          />
        </div>
        <div
          role="timer"
          aria-label={`${minutes} minutes and ${seconds} seconds remaining`}
          className={cn(
            "flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-sm",
            remainingSeconds < 300 && "border-red-400/50 text-red-400",
          )}
        >
          <Clock3 className="size-4" />
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap gap-2">
              <Badge>{topicLabels[question.topic]}</Badge>
              <Badge variant="secondary" className="capitalize">
                {question.difficulty}
              </Badge>
            </div>
            <CardTitle className="pt-4 text-xl leading-8">
              {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {question.options.map((option, optionIndex) => (
              <button
                key={option}
                type="button"
                aria-pressed={answers[question.id] === optionIndex}
                aria-label={`Answer ${optionIndex + 1}: ${option}`}
                onClick={() =>
                  setAnswers((current) => ({
                    ...current,
                    [question.id]: optionIndex,
                  }))
                }
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  answers[question.id] === optionIndex &&
                    "border-primary bg-primary/10",
                )}
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-md bg-secondary text-xs font-semibold">
                  {optionIndex + 1}
                </span>
                {option}
              </button>
            ))}
            <div className="flex justify-between border-t pt-5">
              <Button
                variant="outline"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(currentIndex - 1)}
              >
                Previous
              </Button>
              <Button
                disabled={currentIndex === questions.length - 1}
                onClick={() => setCurrentIndex(currentIndex + 1)}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="h-fit lg:sticky lg:top-36">
          <CardHeader>
            <CardTitle className="text-sm">Question navigation</CardTitle>
            <CardDescription>
              {answeredCount} of {questions.length} answered
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-current={index === currentIndex ? "step" : undefined}
                  aria-label={`Go to question ${index + 1}${answers[item.id] !== undefined ? ", answered" : ", unanswered"}`}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "grid aspect-square place-items-center rounded-md border text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    index === currentIndex &&
                      "border-primary ring-1 ring-primary",
                    answers[item.id] !== undefined &&
                      "bg-primary/15 text-primary",
                  )}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <Button
              variant="destructive"
              className="mt-5 w-full"
              onClick={onSubmit}
            >
              Submit exam
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ExamResults({
  attempt,
  questions,
  onRestart,
}: {
  attempt: ExamAttempt;
  questions: MCQQuestion[];
  onRestart: () => void;
}) {
  const percentage = Math.round(
    (attempt.correctAnswers / attempt.totalQuestions) * 100,
  );
  const breakdown = useMemo(() => {
    const map = new Map<Topic, { correct: number; total: number }>();
    for (const answer of attempt.answers) {
      const current = map.get(answer.topic) ?? { correct: 0, total: 0 };
      current.total += 1;
      current.correct += answer.correct ? 1 : 0;
      map.set(answer.topic, current);
    }
    return [...map.entries()].map(([topic, value]) => ({
      topic,
      ...value,
      accuracy: Math.round((value.correct / value.total) * 100),
    }));
  }, [attempt.answers]);
  const weak = breakdown
    .filter((item) => item.accuracy < 80)
    .sort((a, b) => a.accuracy - b.accuracy);
  const incorrect = attempt.answers.filter((answer) => !answer.correct);
  const questionMap = new Map(
    questions.map((question) => [question.id, question]),
  );
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Exam results"
        title={`${percentage}% final score`}
        description={`${attempt.correctAnswers} correct answers from ${attempt.totalQuestions} questions.`}
      >
        <Button onClick={onRestart}>
          <RotateCcw className="size-4" />
          New exam
        </Button>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <CheckCircle2 className="size-5 text-primary" />
            <p className="mt-4 text-3xl font-semibold">
              {attempt.correctAnswers}/{attempt.totalQuestions}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Final score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <Clock3 className="size-5 text-primary" />
            <p className="mt-4 text-3xl font-semibold">
              {Math.ceil(attempt.durationSeconds / 60)} min
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Time used</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <AlertTriangle className="size-5 text-amber-400" />
            <p className="mt-4 text-3xl font-semibold">{weak.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">Weak topics</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Topic breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {breakdown.map((item) => (
            <div key={item.topic}>
              <div className="mb-2 flex justify-between text-sm">
                <span>{topicLabels[item.topic]}</span>
                <span>
                  {item.correct}/{item.total} · {item.accuracy}%
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
      <Card>
        <CardHeader>
          <CardTitle>Review incorrect answers</CardTitle>
          <CardDescription>
            {incorrect.length} questions to revisit.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {incorrect.length === 0 ? (
            <p className="text-sm text-primary">
              Perfect score—no incorrect answers.
            </p>
          ) : (
            incorrect.map((answer, index) => {
              const question = questionMap.get(answer.questionId)!;
              return (
                <div key={answer.questionId} className="rounded-lg border p-4">
                  <p className="text-sm font-semibold">
                    {index + 1}. {question.question}
                  </p>
                  <p className="mt-3 text-sm text-destructive">
                    Your answer:{" "}
                    {answer.selectedAnswer === null
                      ? "Not answered"
                      : question.options[answer.selectedAnswer]}
                  </p>
                  <p className="mt-1 text-sm text-primary">
                    Correct: {question.options[answer.correctAnswer]}
                  </p>
                  <p className="mt-3 whitespace-pre-line text-xs leading-6 text-muted-foreground">
                    {question.explanation}
                  </p>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
