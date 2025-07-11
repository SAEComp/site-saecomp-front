import { teacherEvaluationProvider } from "../providers";
import { Classes, getClassesOutSchema, ActiveQuestions, getActiveQuestionsOutSchema, Teacher, Course, getTeachersOutSchema, getCoursesOutSchema } from "../schemas/teacherEvaluation/output/evaluation.schema";
import { IEvaluation, createEvaluationInSchema } from "../schemas/teacherEvaluation/input/evaluation.schema";
import { toast } from "sonner";
import { ZodError } from "zod";

class EvaluationService {
    async getClasses(idealYear?: number): Promise<Classes[] | null> {
        try {
            const response = await teacherEvaluationProvider.get('/classes', {
                params: { idealYear }
            });
            const data = getClassesOutSchema.parse(response.data);
            return data.results;
        } catch (error) {
            console.error("Error fetching classes:", error);
            return null;
        }
    }
    async getTeachers(): Promise<Teacher[] | null> {
        try {
            const response = await teacherEvaluationProvider.get('/teachers');
            const data = getTeachersOutSchema.parse(response.data);
            return data.teachers;
        } catch (error) {
            console.error("Error fetching teachers:", error);
            return null;
        }
    }
    async getCourses(): Promise<Course[] | null> {
        try {
            const response = await teacherEvaluationProvider.get('/courses');
            const data = getCoursesOutSchema.parse(response.data);
            return data.courses;
        } catch (error) {
            console.error("Error fetching courses:", error);
            return null;
        }
    }
    async getQuestions(): Promise<ActiveQuestions | null> {
        try {
            const response = await teacherEvaluationProvider.get('/questions');
            const data = getActiveQuestionsOutSchema.parse(response.data);
            return data.questions;
        } catch (error) {
            console.error("Error fetching active questions:", error);
            return null;
        }
    }
    async createEvaluation(evaluations: IEvaluation[]): Promise<boolean | null> {
        try {
            const body = createEvaluationInSchema.parse({ evaluations });
            await teacherEvaluationProvider.post('/create', body);
            return true;
        } catch (error) {
            console.error("Error creating evaluation:", error);
            if (error instanceof ZodError) {
                toast.error("Erro ao criar avaliação: " + error.errors.map(e => e.message).join(", "));
            }
            return null;
        }
    }
}

export const evaluationService = new EvaluationService();