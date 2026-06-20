import type { AnswerAttempt, TopicPerformance } from "@/types/progress";
import type { Topic } from "@/types/questions";

export const topicLabels: Record<Topic, string> = {
  subnetting: "Subnetting & CIDR",
  tcp: "TCP",
  utf8: "UTF-8",
  dns: "DNS",
  routing: "Routing",
  http: "HTTP & MIME",
  email: "Email protocols",
  asn1: "ASN.1 & BER",
  layer2: "Layer 2",
  ipv4_ipv6: "IPv4 & IPv6",
  osi: "OSI model",
};

const topicOrder = Object.keys(topicLabels) as Topic[];

export function calculateTopicPerformance(
  attempts: AnswerAttempt[],
): TopicPerformance[] {
  const results = new Map<Topic, { answered: number; correct: number }>();

  for (const attempt of attempts) {
    const current = results.get(attempt.topic) ?? { answered: 0, correct: 0 };
    current.answered += 1;
    current.correct += attempt.correct ? 1 : 0;
    results.set(attempt.topic, current);
  }

  return topicOrder
    .filter((topic) => results.has(topic))
    .map((topic) => {
      const result = results.get(topic)!;
      return {
        topic,
        answered: result.answered,
        correct: result.correct,
        accuracy: Math.round((result.correct / result.answered) * 100),
      };
    })
    .sort((a, b) => b.answered - a.answered || b.accuracy - a.accuracy);
}

export function calculateDashboardAnalytics(attempts: AnswerAttempt[]) {
  const questionsAnswered = attempts.length;
  const correctAnswers = attempts.filter((attempt) => attempt.correct).length;
  const overallAccuracy = questionsAnswered
    ? Math.round((correctAnswers / questionsAnswered) * 100)
    : 0;
  const topicPerformance = calculateTopicPerformance(attempts);
  const weakTopics = topicPerformance
    .filter((performance) => performance.accuracy < 80)
    .sort((a, b) => a.accuracy - b.accuracy || b.answered - a.answered);
  const recommendedTopic = weakTopics[0] ?? topicPerformance.at(-1) ?? null;

  return {
    questionsAnswered,
    correctAnswers,
    overallAccuracy,
    topicPerformance,
    weakTopics,
    recommendedTopic,
  };
}
