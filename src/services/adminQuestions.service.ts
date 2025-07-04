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

    async postQuestion(question : Omit<Question,'id'>) {
        try{
            const response = await teacherEvaluationProvider.post("/admin/questions",{
                ...question
            })
            return response.data.questionId 
        } catch (error){
            console.error ("Error posting Form question", error);
            return null;
        }
    }
    
    async putQuestion(question : Question) {
        try{
            await teacherEvaluationProvider.put(`/admin/questions/${question.id}`,{
                question: question.question,
                type: question.type,
                active: question.active,
                order: question.order,
                isScore: question.isScore
            })
        } catch (error){
            console.error ("Error putting Form question", error);
        }
    }

    async deleteQuestion(id : number) {
        try{
            const response = await teacherEvaluationProvider.delete(`/admin/questions/${id}`,{
            })
            return response.data.deleted
        } catch (error){
            console.error ("Error deleting Form question", error);
            return null;
        }
    }

}

export const adminQuestionsService = new AdminQuestionsService();