

export interface IGetTeachersCourses {
    classId: number
    teacherId: number;
    teacherName: string;
    courseId: number;
    courseName: string;
    courseCode: string;
}

export interface IGetSemesters {
    id: number; 
    value: string;
}