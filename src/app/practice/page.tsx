import type { Metadata } from "next";
import { PracticeMode } from "@/components/practice/practice-mode";

export const metadata: Metadata = { title: "Practice" };

export default function PracticePage() {
  return <PracticeMode />;
}
