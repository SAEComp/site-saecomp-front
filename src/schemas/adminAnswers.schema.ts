import { z } from 'zod';
import questionTypes from '../types/questionTypes';

const adminEvaluationSchema = z.object({
    evaluationId: z.coerce.number().int().positive("O ID da avaliação deve ser um número inteiro positivo."),
    teacherName: z.string().min(3, "O nome do professor deve ter pelo menos 3 caracteres."),
    courseName: z.string().min(3, "O nome do curso deve ter pelo menos 3 caracteres."),
    courseCode: z.string().min(3, "O código do curso deve ter pelo menos 3 caracteres."),
    status: z.enum(['approved', 'rejected', 'pending']),
    semester: z.string().regex(/^[0-9]{4}-(1|2)$/, "O semestre deve estar no formato AAAA-S (ex: 2025-1).")
});

export type AdminEvaluation = z.infer<typeof adminEvaluationSchema>;

export const getAdminAnswersOutSchema = z.object({
    isLastPage: z.boolean(),
    answers: z.array(adminEvaluationSchema)
});

export type GetAdminAnswersOut = z.infer<typeof getAdminAnswersOutSchema>;

const adminAnswerDetailsSchema = z.object({
    questionId: z.coerce.number().int().positive("O ID da pergunta deve ser um número inteiro positivo."),
    questionType: z.enum(questionTypes),
    question: z.string().min(3, "A pergunta deve ter pelo menos 3 caracteres."),
    answer: z.string().nullable(),
    editedAnswer: z.string().nullable(),
    editedBy: z.string().nullable()
});

export type AdminAnswerDetails = z.infer<typeof adminAnswerDetailsSchema>;

const adminEvaluationDetailsSchema = z.object({
    evaluationId: z.coerce.number().int().positive("O ID da avaliação deve ser um número inteiro positivo."),
    userName: z.string().min(3, "O nome do usuário deve ter pelo menos 3 caracteres."),
    userEmail: z.string().email("O e-mail do usuário deve ser válido."),
    userNusp: z.string().regex(/^[0-9]{7,8}$/, "O NUSP do usuário deve ser válido."),
    status: z.enum(['approved', 'rejected', 'pending']),
    approvedBy: z.string().nullable(),
});

export type AdminEvaluationDetails = z.infer<typeof adminEvaluationDetailsSchema>;

export const getAdminAnswerDetailsOutSchema = adminEvaluationDetailsSchema.extend({
    answers: z.array(adminAnswerDetailsSchema),
});

export type GetAdminAnswerDetailsOut = z.infer<typeof getAdminAnswerDetailsOutSchema>;

export const getAdminAnswersInSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().optional().default(10),
  teacherId: z.coerce.number().int().positive().optional(),
  courseId: z.coerce.number().int().positive().optional(),
  status: z.enum(["approved", "rejected", "pending"]).optional(),
  semester: z
    .string()
    .regex(
      /^[0-9]{4}-(1|2)$/,
      "O semestre deve estar no formato AAAA-S (ex: 2025-1)."
    )
    .optional(),
});

export type GetAdminAnswersParams = z.infer<typeof getAdminAnswersInSchema>;

export const getAdminAnswerDetailsParamsInSchema = z.object({
  id: z.coerce
    .number()
    .int()
    .positive("O ID da avaliação deve ser um número inteiro positivo."),
});

export const updateAnswerParamsInSchema = z.object({
  id: z.coerce
    .number()
    .int()
    .positive("O ID da avaliação deve ser um número inteiro positivo."),
});

export const updateAnswerInSchema = z.object({
  status: z.enum(["approved", "rejected", "pending"]).optional(),
  answers: z
    .array(
      z.object({
        questionId: z.number().int().positive(),
        editedAnswer: z.string().nullable(),
      })
    )
    .optional(),
});

export type UpdateAnswerPayload = z.infer<typeof updateAnswerInSchema>;
