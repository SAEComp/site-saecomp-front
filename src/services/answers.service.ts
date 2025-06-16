import { teacherEvaluationProvider } from "../providers";
import { GetPublicAnswersOut, getPublicAnswersOutSchema, GetPublicAnswerDetailsOut, getPublicAnswerDetailsOutSchema } from "../schemas/teacherEvaluation/output/answer.schema";

class AnswersService {
    async getAnswers(page?: number, pageSize?: number, teacherId?: number, courseId?: number): Promise<GetPublicAnswersOut | null> {
        try {
            const response = await teacherEvaluationProvider.get('/answers', {
                params: { page, pageSize, teacherId, courseId }
            });
            const data = getPublicAnswersOutSchema.parse(response.data);
            return data;
        } catch (error) {
            console.error("Error fetching answers:", error);
            return null;
        }
    }
    async getAnswersDetails(answerId: number): Promise<GetPublicAnswerDetailsOut | null> {
        try {
            const response = await teacherEvaluationProvider.get(`/answers/${answerId}`);
            const data = getPublicAnswerDetailsOutSchema.parse(response.data);
            return data;
        } catch (error) {
            console.error("Error fetching answer details:", error);
            return null;
        }
    }
}

export const answersService = new AnswersService();