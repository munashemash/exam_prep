import {
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  startOfDay,
  subDays,
} from "date-fns";
import { mcqQuestions } from "@/data/questions";
import {
  calculateTopicPerformance,
  topicLabels,
} from "@/lib/dashboard-analytics";
import type { AnswerAttempt, ExamAttempt } from "@/types/progress";

export function calculateStudyStatistics(
  attempts: AnswerAttempt[],
  examAttempts: ExamAttempt[],
) {
  const topicAccuracy = calculateTopicPerformance(attempts).map((item) => ({
    topic: topicLabels[item.topic],
    accuracy: item.accuracy,
    answered: item.answered,
  }));

  const today = startOfDay(new Date());
  const activityByDay = new Map<string, number>();
  attempts.forEach((attempt) => {
    const key = format(new Date(attempt.answeredAt), "yyyy-MM-dd");
    activityByDay.set(key, (activityByDay.get(key) ?? 0) + 1);
  });
  const activity = eachDayOfInterval({
    start: subDays(today, 13),
    end: today,
  }).map((day) => ({
    day: format(day, "d MMM"),
    questions: activityByDay.get(format(day, "yyyy-MM-dd")) ?? 0,
  }));

  const misses = new Map<string, number>();
  attempts
    .filter((attempt) => !attempt.correct)
    .forEach((attempt) =>
      misses.set(attempt.questionId, (misses.get(attempt.questionId) ?? 0) + 1),
    );
  const questionMap = new Map(
    mcqQuestions.map((question) => [question.id, question]),
  );
  const mostMissed = [...misses.entries()]
    .map(([questionId, count]) => ({
      question: questionMap.get(questionId),
      count,
    }))
    .filter((item) => item.question)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const activeDays = [
    ...new Set(
      attempts.map((attempt) =>
        format(new Date(attempt.answeredAt), "yyyy-MM-dd"),
      ),
    ),
  ]
    .map((date) => startOfDay(new Date(`${date}T12:00:00`)))
    .sort((a, b) => b.getTime() - a.getTime());
  let studyStreak = 0;
  if (activeDays.length > 0) {
    const gapFromToday = differenceInCalendarDays(today, activeDays[0]);
    if (gapFromToday <= 1) {
      studyStreak = 1;
      for (let index = 1; index < activeDays.length; index += 1) {
        if (
          differenceInCalendarDays(activeDays[index - 1], activeDays[index]) ===
          1
        ) {
          studyStreak += 1;
        } else {
          break;
        }
      }
    }
  }

  const timeSpentSeconds = attempts.reduce(
    (total, attempt) => total + (attempt.durationSeconds ?? 0),
    0,
  );

  return {
    topicAccuracy,
    activity,
    mostMissed,
    studyStreak,
    timeSpentSeconds,
    recentExams: [...examAttempts].reverse().slice(0, 5),
  };
}

export function formatStudyTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}
