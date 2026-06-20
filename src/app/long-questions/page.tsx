import type { Metadata } from "next";
import { LongQuestionPractice } from "@/components/practice/long-question-practice";

export const metadata: Metadata = { title: "Long Questions" };

export default function LongQuestionsPage() {
  return <LongQuestionPractice />;
}
