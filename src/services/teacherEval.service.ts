import { teacherEvaluationProvider } from "../providers";
import { IGetTeachersCourses } from "../interfaces/teacherEvalService.interface";

class TeacherEvalService {
    async getTeachersCourses(idealYear?: number): Promise<IGetTeachersCourses[] | null> {
        try {
            const response = await teacherEvaluationProvider.get('/teachers-courses', { params: { idealYear } });
            if (response.status !== 200) return null;
            return response.data.results;
        }
        catch (error) {
            return null;
        }
    }
}

export const teacherEvalService = new TeacherEvalService();