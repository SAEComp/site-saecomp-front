import { teacherEvaluationProvider } from "../providers";
import { Question } from "../schemas/adminQuestions.schema";

class AdminQuestionsService {
    async getQuestionList() : Promise<Question[] | null> {
        try{
            const response = await teacherEvaluationProvider.get("/admin/questions", {
            })
            return response.data.questions;
        } catch (error){
            console.error ("Error fetching Form Data", error);
            return null;
        }
    }
}

export const adminQuestionsService = new AdminQuestionsService();