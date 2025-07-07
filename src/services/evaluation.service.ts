import { teacherEvaluationProvider } from "../providers";
import { Classes, getClassesOutSchema, ActiveQuestions, getActiveQuestionsOutSchema } from "../schemas/teacherEvaluation/output/evaluation.schema";
import { IEvaluation, createEvaluationInSchema } from "../schemas/teacherEvaluation/input/evaluation.schema";

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
            const response = await teacherEvaluationProvider.post('/create', body);
            return response.status === 201;
        } catch (error) {
            console.error("Error creating evaluation:", error);
            return null;
        }
    }
}

export const evaluationService = new EvaluationService();