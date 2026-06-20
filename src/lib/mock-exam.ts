import type { ExamAnswer } from "@/types/progress";
import type { MCQQuestion, Topic } from "@/types/questions";

const allocations: Partial<Record<Topic, number>> = {
  subnetting: 10,
  tcp: 10,
  utf8: 8,
  dns: 7,
  routing: 5,
};

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function generateMockExam(bank: MCQQuestion[]): MCQQuestion[] {
  const selected: MCQQuestion[] = [];
  const weightedTopics = Object.keys(allocations) as Topic[];

  for (const topic of weightedTopics) {
    selected.push(
      ...shuffle(bank.filter((question) => question.topic === topic)).slice(
        0,
        allocations[topic],
      ),
    );
  }

  const remaining = bank.filter(
    (question) => !weightedTopics.includes(question.topic),
  );
  selected.push(...shuffle(remaining).slice(0, 10));
  return shuffle(selected);
}

export function gradeExam(
  questions: MCQQuestion[],
  answers: Record<string, number>,
): ExamAnswer[] {
  return questions.map((question) => {
    const selectedAnswer = answers[question.id] ?? null;
    return {
      questionId: question.id,
      topic: question.topic,
      selectedAnswer,
      correctAnswer: question.correctAnswer,
      correct: selectedAnswer === question.correctAnswer,
    };
  });
}
