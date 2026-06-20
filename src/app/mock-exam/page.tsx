import type { Metadata } from "next";
import { MockExam } from "@/components/exam/mock-exam";

export const metadata: Metadata = { title: "Mock Exam" };

export default function MockExamPage() {
  return <MockExam />;
}
