import { z } from "zod";

export const topicSchema = z.enum([
  "subnetting",
  "tcp",
  "utf8",
  "dns",
  "routing",
  "http",
  "email",
  "asn1",
  "layer2",
  "ipv4_ipv6",
  "osi",
]);

export const difficultySchema = z.enum(["easy", "medium", "hard"]);
export const questionTypeSchema = z.enum(["mcq", "long"]);

export type Topic = z.infer<typeof topicSchema>;
export type Difficulty = z.infer<typeof difficultySchema>;
export type QuestionType = z.infer<typeof questionTypeSchema>;

const baseQuestionSchema = z.object({
  id: z.string().trim().min(1),
  topic: topicSchema,
  year: z.number().int().min(2000).max(2100),
  difficulty: difficultySchema,
  marks: z.number().int().positive(),
  question: z.string().trim().min(1),
});

export const mcqQuestionSchema = baseQuestionSchema
  .extend({
    type: z.literal("mcq"),
    options: z.array(z.string().trim().min(1)).min(2),
    correctAnswer: z.number().int().nonnegative(),
    explanation: z.string().trim().min(1),
    commonMistakes: z.array(z.string().trim().min(1)).min(1),
  })
  .refine(({ correctAnswer, options }) => correctAnswer < options.length, {
    message: "correctAnswer must reference an existing option",
    path: ["correctAnswer"],
  });

export const longQuestionAnswerSchema = z.object({
  definition: z.string().trim().min(1),
  mechanism: z.string().trim().min(1),
  purpose: z.string().trim().min(1),
  example: z.string().trim().min(1).optional(),
});

export const longQuestionSchema = baseQuestionSchema.extend({
  type: z.literal("long"),
  answer: longQuestionAnswerSchema,
});

export const questionSchema = z.union([mcqQuestionSchema, longQuestionSchema]);

export const questionBankSchema = z
  .array(questionSchema)
  .superRefine((questions, context) => {
    const seenIds = new Set<string>();

    questions.forEach((question, index) => {
      if (seenIds.has(question.id)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate question id: ${question.id}`,
          path: [index, "id"],
        });
      }

      seenIds.add(question.id);
    });
  });

export interface MCQQuestion {
  id: string;
  type: "mcq";
  topic: Topic;
  year: number;
  difficulty: Difficulty;
  marks: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  commonMistakes: string[];
}

export interface LongQuestion {
  id: string;
  type: "long";
  topic: Topic;
  year: number;
  difficulty: Difficulty;
  marks: number;
  question: string;
  answer: {
    definition: string;
    mechanism: string;
    purpose: string;
    example?: string;
  };
}

export type Question = MCQQuestion | LongQuestion;
