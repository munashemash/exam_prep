"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronRight,
  Keyboard,
  RotateCw,
  X,
} from "lucide-react";
import { mcqQuestions } from "@/data/questions";
import { topicLabels } from "@/lib/dashboard-analytics";
import { useStudyStore } from "@/store/use-study-store";
import type { Difficulty, MCQQuestion, Topic } from "@/types/questions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type TopicFilter = Topic | "all";
type DifficultyFilter = Difficulty | "all";

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function PracticeMode() {
  const [topic, setTopic] = useState<TopicFilter>("all");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [randomizeKey, setRandomizeKey] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const recordAttempt = useStudyStore((state) => state.recordAttempt);

  useEffect(() => {
    const requestedTopic = new URLSearchParams(window.location.search).get(
      "topic",
    );
    if (requestedTopic && requestedTopic in topicLabels) {
      setTopic(requestedTopic as Topic);
    }
  }, []);

  const questions = useMemo(() => {
    const filtered = mcqQuestions.filter(
      (question) =>
        (topic === "all" || question.topic === topic) &&
        (difficulty === "all" || question.difficulty === difficulty),
    );
    return randomizeKey > 0 ? shuffle(filtered) : filtered;
  }, [difficulty, randomizeKey, topic]);

  const currentQuestion = questions[questionIndex];
  const answered = selectedAnswer !== null;

  const resetQuestion = useCallback(() => {
    setQuestionIndex(0);
    setSelectedAnswer(null);
  }, []);

  const selectAnswer = useCallback(
    (answerIndex: number) => {
      if (!currentQuestion || selectedAnswer !== null) return;
      setSelectedAnswer(answerIndex);
      recordAttempt({
        questionId: currentQuestion.id,
        questionType: "mcq",
        topic: currentQuestion.topic,
        correct: answerIndex === currentQuestion.correctAnswer,
      });
    },
    [currentQuestion, recordAttempt, selectedAnswer],
  );

  const nextQuestion = useCallback(() => {
    if (!answered || questions.length === 0) return;
    setQuestionIndex((current) => (current + 1) % questions.length);
    setSelectedAnswer(null);
  }, [answered, questions.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName)) return;
      if (["1", "2", "3", "4"].includes(event.key) && !answered) {
        const answerIndex = Number(event.key) - 1;
        if (answerIndex < (currentQuestion?.options.length ?? 0)) {
          event.preventDefault();
          selectAnswer(answerIndex);
        }
      }
      if (event.key === "Enter" && answered) {
        event.preventDefault();
        nextQuestion();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [answered, currentQuestion, nextQuestion, selectAnswer]);

  const updateTopic = (value: TopicFilter) => {
    setTopic(value);
    resetQuestion();
  };
  const updateDifficulty = (value: DifficultyFilter) => {
    setDifficulty(value);
    resetQuestion();
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="MCQ practice"
        title="Practice one concept at a time"
        description="Filter the question bank, answer with the keyboard or mouse, and review the reasoning immediately."
      />

      <Card>
        <CardContent className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]">
          <label className="grid gap-2 text-xs font-medium text-muted-foreground">
            Topic
            <select
              value={topic}
              onChange={(event) =>
                updateTopic(event.target.value as TopicFilter)
              }
              className="h-10 rounded-md border bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All topics</option>
              {Object.entries(topicLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-xs font-medium text-muted-foreground">
            Difficulty
            <select
              value={difficulty}
              onChange={(event) =>
                updateDifficulty(event.target.value as DifficultyFilter)
              }
              className="h-10 rounded-md border bg-background px-3 text-sm capitalize text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
          <Button
            variant="outline"
            className="self-end"
            onClick={() => {
              setRandomizeKey((key) => key + 1);
              resetQuestion();
            }}
          >
            <RotateCw className="size-4" />
            Randomize
          </Button>
        </CardContent>
      </Card>

      {currentQuestion ? (
        <Card className="mx-auto max-w-4xl">
          <CardHeader className="border-b">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <Badge>{topicLabels[currentQuestion.topic]}</Badge>
                <Badge variant="secondary" className="capitalize">
                  {currentQuestion.difficulty}
                </Badge>
                <Badge variant="outline">{currentQuestion.year}</Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                Question {questionIndex + 1} of {questions.length}
              </span>
            </div>
            <Progress
              value={((questionIndex + 1) / questions.length) * 100}
              className="mt-4"
            />
            <CardTitle className="pt-5 text-xl leading-8 sm:text-2xl">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-5 sm:p-6">
            <div className="grid gap-3">
              {currentQuestion.options.map((option, index) => {
                const correct = index === currentQuestion.correctAnswer;
                const selected = index === selectedAnswer;
                return (
                  <button
                    key={option}
                    type="button"
                    disabled={answered}
                    onClick={() => selectAnswer(index)}
                    className={cn(
                      "flex min-h-12 items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default disabled:opacity-100",
                      !answered && "hover:border-primary/50 hover:bg-primary/5",
                      answered && correct && "border-primary bg-primary/10",
                      answered &&
                        selected &&
                        !correct &&
                        "border-destructive bg-destructive/10",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-7 shrink-0 place-items-center rounded-md bg-secondary text-xs font-semibold",
                        answered &&
                          correct &&
                          "bg-primary text-primary-foreground",
                        answered &&
                          selected &&
                          !correct &&
                          "bg-destructive text-destructive-foreground",
                      )}
                    >
                      {answered && correct ? (
                        <Check className="size-4" />
                      ) : answered && selected ? (
                        <X className="size-4" />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <span className="flex-1">{option}</span>
                  </button>
                );
              })}
            </div>

            {answered && (
              <AnswerFeedback
                question={currentQuestion}
                selectedAnswer={selectedAnswer}
              />
            )}

            <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Keyboard className="size-4" />
                Use 1–4 to answer and Enter to continue.
              </p>
              <Button onClick={nextQuestion} disabled={!answered}>
                Next question <ChevronRight className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-10 text-center">
            <h2 className="font-semibold">No questions match these filters</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose another topic or difficulty.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AnswerFeedback({
  question,
  selectedAnswer,
}: {
  question: MCQQuestion;
  selectedAnswer: number;
}) {
  const correct = selectedAnswer === question.correctAnswer;
  return (
    <div className="space-y-4" aria-live="polite">
      <div
        className={cn(
          "flex items-start gap-3 rounded-lg border p-4",
          correct
            ? "border-primary/30 bg-primary/5"
            : "border-destructive/30 bg-destructive/5",
        )}
      >
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-full",
            correct
              ? "bg-primary text-primary-foreground"
              : "bg-destructive text-destructive-foreground",
          )}
        >
          {correct ? <Check className="size-4" /> : <X className="size-4" />}
        </span>
        <div>
          <p className="text-sm font-semibold">
            {correct ? "Correct" : "Not quite"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Correct answer: {question.options[question.correctAnswer]}
          </p>
        </div>
      </div>
      <div className="rounded-lg border p-4">
        <h3 className="text-sm font-semibold">Explanation</h3>
        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">
          {question.explanation}
        </p>
      </div>
      <div className="rounded-lg border border-amber-400/20 bg-amber-400/5 p-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-200">
          <AlertTriangle className="size-4" />
          Common mistakes
        </h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
          {question.commonMistakes.map((mistake) => (
            <li key={mistake}>{mistake}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
