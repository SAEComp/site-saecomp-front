import { teacherEvaluationProvider } from "../providers";
import { IGetSemesters, IGetTeachersCourses } from "../interfaces/teacherEvalService.interface";
import { semester } from "./mock";
import { getAdminAnswersOutSchema, GetAdminAnswersOut, GetAdminAnswerDetailsOut, getAdminAnswerDetailsOutSchema, UpdateAnswerPayload } from "../schemas/adminAnswers.schema";

export type Status = 'approved' | 'rejected' | 'pending';

class TeacherEvalService {
    async getTeachersCourses(idealYear?: number): Promise<IGetTeachersCourses[] | null> {
        try {
            const response = await teacherEvaluationProvider.get('/classes', { params: { idealYear } });
            if (response.status !== 200) return null;
            return response.data.results;
        }
        catch (error) {
            return null;
        }
    }
    async getSemesters(): Promise< IGetSemesters[] | null> {
        try {
            // const response = await teacherEvaluationProvider.get('/semesters');
            // if (response.status !== 200) return null;
            // return response.data.results;
            return semester;
        }
        catch (error) {
            return null;
        }
    }
    async getAdminAnswers(page?: number, pageSize?: number, teacherId?:number, courseId?: number, status?: Status, semester?: string ): Promise <  GetAdminAnswersOut | null> {
        try {
            const response = await teacherEvaluationProvider.get('/admin/answers', { params: { page, pageSize, teacherId, courseId, status, semester } });
            if (response.status !== 200) return null;
            return getAdminAnswersOutSchema.parse(response.data);
        }
        catch (error) {
            return null;
        }
    }

    async getAdminAnswerDetails(evaluationId: number): Promise< GetAdminAnswerDetailsOut | null> {
        try {
            const response = await teacherEvaluationProvider.get(`/admin/answers/${evaluationId}`);
            if (response.status !== 200) return null;
            return getAdminAnswerDetailsOutSchema.parse(response.data);
        }
        catch (error) {
            return null;
        }
    }

    async  updateAnswer(body : UpdateAnswerPayload, id: number): Promise <boolean | null> {
        try{
            const response = await teacherEvaluationProvider.put(`/admin/answers/${id}`, body);
            if (response.status !== 204) return null;
            return true;
        }
        catch (error) {
            console.error("Error updating answer:", error);
            return null;
        }
    }

}



export const teacherEvalService = new TeacherEvalService();