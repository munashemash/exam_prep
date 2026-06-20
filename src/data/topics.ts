import { addDays, subDays } from "date-fns";
import { z } from "zod";
import type { Activity, Topic } from "@/types";

const topicSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  questions: z.number().int().positive(),
  completed: z.number().int().nonnegative(),
  difficulty: z.enum(["Foundation", "Intermediate", "Advanced"]),
});

const rawTopics = [
  {
    id: "sql",
    title: "SQL & Relational Algebra",
    description: "Queries, joins, grouping, and relational operations.",
    questions: 42,
    completed: 28,
    difficulty: "Foundation",
  },
  {
    id: "normalisation",
    title: "Database Normalisation",
    description: "Functional dependencies through BCNF.",
    questions: 30,
    completed: 16,
    difficulty: "Intermediate",
  },
  {
    id: "transactions",
    title: "Transactions & Concurrency",
    description: "Schedules, serialisability, locks, and recovery.",
    questions: 36,
    completed: 12,
    difficulty: "Advanced",
  },
  {
    id: "indexing",
    title: "Indexing & File Structures",
    description: "B+ trees, hashing, and query optimisation.",
    questions: 24,
    completed: 8,
    difficulty: "Advanced",
  },
] as const;

export const topics: Topic[] = z.array(topicSchema).parse(rawTopics);

export const recentActivity: Activity[] = [
  {
    id: "1",
    title: "SQL joins drill",
    score: 9,
    total: 10,
    completedAt: subDays(new Date(), 1).toISOString(),
    type: "Practice",
  },
  {
    id: "2",
    title: "Mock exam #3",
    score: 72,
    total: 100,
    completedAt: subDays(new Date(), 3).toISOString(),
    type: "Mock exam",
  },
  {
    id: "3",
    title: "Two-phase locking",
    score: 14,
    total: 20,
    completedAt: subDays(new Date(), 5).toISOString(),
    type: "Long question",
  },
];

export const examDate = addDays(new Date(), 24);
