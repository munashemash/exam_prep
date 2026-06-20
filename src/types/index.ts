import type { LucideIcon } from "lucide-react";

export type NavItem = { title: string; href: string; icon: LucideIcon };
export type Topic = {
  id: string;
  title: string;
  description: string;
  questions: number;
  completed: number;
  difficulty: "Foundation" | "Intermediate" | "Advanced";
};
export type Activity = {
  id: string;
  title: string;
  score: number;
  total: number;
  completedAt: string;
  type: "Practice" | "Mock exam" | "Long question";
};
