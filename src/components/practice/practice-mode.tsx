"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
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
type PracticeState = "active" | "complete";

type PracticeAnswer = {
  questionId: string;
  topic: Topic;
  selectedAnswer: number;
  correctAnswer: number;
  correct: boolean;
};

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
  const [practiceState, setPracticeState] = useState<PracticeState>("active");
  const [sessionAnswers, setSessionAnswers] = useState<PracticeAnswer[]>([]);
  const questionStartedAt = useRef(Date.now());
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
  const isLastQuestion = questionIndex === questions.length - 1;

  const resetQuestion = useCallback(() => {
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setPracticeState("active");
    setSessionAnswers([]);
    questionStartedAt.current = Date.now();
  }, []);

  const selectAnswer = useCallback(
    (answerIndex: number) => {
      if (!currentQuestion || selectedAnswer !== null) return;
      setSelectedAnswer(answerIndex);
      setSessionAnswers((current) => [
        ...current,
        {
          questionId: currentQuestion.id,
          topic: currentQuestion.topic,
          selectedAnswer: answerIndex,
          correctAnswer: currentQuestion.correctAnswer,
          correct: answerIndex === currentQuestion.correctAnswer,
        },
      ]);
      recordAttempt({
        questionId: currentQuestion.id,
        questionType: "mcq",
        topic: currentQuestion.topic,
        correct: answerIndex === currentQuestion.correctAnswer,
        source: "practice",
        durationSeconds: Math.max(
          1,
          Math.round((Date.now() - questionStartedAt.current) / 1000),
        ),
      });
    },
    [currentQuestion, recordAttempt, selectedAnswer],
  );

  const nextQuestion = useCallback(() => {
    if (!answered || questions.length === 0) return;
    if (isLastQuestion) {
      setPracticeState("complete");
      return;
    }
    setQuestionIndex((current) => current + 1);
    setSelectedAnswer(null);
    questionStartedAt.current = Date.now();
  }, [answered, isLastQuestion, questions.length]);

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

  if (practiceState === "complete") {
    return (
      <PracticeResults
        answers={sessionAnswers}
        questions={questions}
        topic={topic}
        difficulty={difficulty}
        onRestart={resetQuestion}
      />
    );
  }

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
              className="h-10 rounded-md border bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
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
              className="h-10 rounded-md border bg-background px-3 text-sm capitalize text-foreground outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
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
              aria-label={`Question ${questionIndex + 1} of ${questions.length}`}
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
                    aria-pressed={selected}
                    aria-label={`Answer ${index + 1}: ${option}`}
                    onClick={() => selectAnswer(index)}
                    className={cn(
                      "flex min-h-12 items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-default disabled:opacity-100",
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
                {isLastQuestion ? "Show results" : "Next question"}{" "}
                <ChevronRight className="size-4" />
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

function PracticeResults({
  answers,
  questions,
  topic,
  difficulty,
  onRestart,
}: {
  answers: PracticeAnswer[];
  questions: MCQQuestion[];
  topic: TopicFilter;
  difficulty: DifficultyFilter;
  onRestart: () => void;
}) {
  const correctAnswers = answers.filter((answer) => answer.correct).length;
  const percentage =
    answers.length > 0 ? Math.round((correctAnswers / answers.length) * 100) : 0;
  const sectionLabel = [
    topic === "all" ? "All topics" : topicLabels[topic],
    difficulty === "all" ? "all difficulties" : `${difficulty} difficulty`,
  ].join(" · ");
  const questionMap = new Map(
    questions.map((question) => [question.id, question]),
  );
  const incorrect = answers.filter((answer) => !answer.correct);
  const breakdown = Object.entries(
    answers.reduce(
      (result, answer) => {
        const current = result[answer.topic] ?? { correct: 0, total: 0 };
        current.total += 1;
        current.correct += answer.correct ? 1 : 0;
        result[answer.topic] = current;
        return result;
      },
      {} as Partial<Record<Topic, { correct: number; total: number }>>,
    ),
  ).map(([topicKey, result]) => ({
    topic: topicKey as Topic,
    correct: result.correct,
    total: result.total,
    accuracy: Math.round((result.correct / result.total) * 100),
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Practice results"
        title={`${percentage}% section grade`}
        description={`${correctAnswers} correct from ${answers.length} questions · ${sectionLabel}.`}
      >
        <Button onClick={onRestart}>
          <RotateCw className="size-4" />
          Practice this section again
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <CheckCircle2 className="size-5 text-primary" />
            <p className="mt-4 text-3xl font-semibold">
              {correctAnswers}/{answers.length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Final score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <AlertTriangle className="size-5 text-amber-400" />
            <p className="mt-4 text-3xl font-semibold">{incorrect.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Questions to revisit
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <Keyboard className="size-5 text-primary" />
            <p className="mt-4 text-3xl font-semibold">{breakdown.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Topics covered
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Section breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {breakdown.map((item) => (
            <div key={item.topic}>
              <div className="mb-2 flex justify-between gap-4 text-sm">
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
          <CardTitle>Review missed questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {incorrect.length === 0 ? (
            <p className="text-sm text-primary">
              Perfect score — no missed questions in this section.
            </p>
          ) : (
            incorrect.map((answer, index) => {
              const question = questionMap.get(answer.questionId);
              if (!question) return null;
              return (
                <div key={answer.questionId} className="rounded-lg border p-4">
                  <p className="text-sm font-semibold">
                    {index + 1}. {question.question}
                  </p>
                  <p className="mt-3 text-sm text-destructive">
                    Your answer: {question.options[answer.selectedAnswer]}
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

function AnswerFeedback({
  question,
  selectedAnswer,
}: {
  question: MCQQuestion;
  selectedAnswer: number;
}) {
  const correct = selectedAnswer === question.correctAnswer;
  return (
    <div className="space-y-4" role="status" aria-live="polite">
      <div
        className={cn(
          "flex items-start gap-3 rounded-lg border p-4",
          correct
            ? "border-primary/30 bg-primary/5"
            : "border-destructive/30 bg-destructive/5",
        )}
      >
        <span
          aria-hidden="true"
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
