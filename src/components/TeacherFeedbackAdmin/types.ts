export interface IAnswersFilter { 
    status: string | null;
    teacherId: string | null;
    courseCode: string | null;
    semester: string | null;
}

export type TAutocompleteOptions = {
    label: string;
    id: number | string;
    subtitle?: string;
};