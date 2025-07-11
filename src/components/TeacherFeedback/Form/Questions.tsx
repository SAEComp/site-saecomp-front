import QuestionComponent from "./QuestionComponent";
import TextInput from "../../Inputs/TextInput";
import SliderInput from "../../Inputs/SliderInput";
import DropDown from "../../Inputs/DropDown";
import { IEvaluation } from "../../../schemas/teacherEvaluation/input/evaluation.schema";
import { Classes } from "../../../schemas/teacherEvaluation/output/evaluation.schema";
import { IOption } from "../../Inputs/DropDown";
import questionTypes from "../../../schemas/teacherEvaluation/questionTypes";
import { ActiveQuestions } from "../../../schemas/teacherEvaluation/output/evaluation.schema";


export const componentTypes: Record<typeof questionTypes[number], React.ComponentType<any>> = {
    text: TextInput,
    slider: SliderInput,
    numeric: SliderInput
}


interface QuestionProps {
    evaluationState: IEvaluation;
    updateEvaluationClass: (classId?: number, teacherId?: number, courseId?: number) => void;
    updateAnswer: (questionId: number, answer: string) => void;
    classes: Classes[];
    questions: ActiveQuestions;
    teacherDropdown: IOption[];
    courseDropdown: IOption[];
    sortTeachersClassFirst: (selectedCourse: IOption | null) => (a: IOption, b: IOption) => number;
    sortCoursesClassFirst: (selectedTeacher: IOption | null) => (a: IOption, b: IOption) => number;
}

const Questions = ({ evaluationState, updateEvaluationClass, updateAnswer, classes, questions, teacherDropdown, courseDropdown, sortCoursesClassFirst, sortTeachersClassFirst }: QuestionProps) => {

    function changeTeacher(newTeacher: IOption | null) {
        const foundClass = classes.find(q => q.teacherId === newTeacher?.id && q.courseId === evaluationState.courseId);
        updateEvaluationClass(foundClass?.classId, newTeacher?.id as number | undefined, evaluationState.courseId);
    }

    function changeCourse(newCourse: IOption | null) {
        const foundClass = classes.find(q => q.teacherId === evaluationState.teacherId && q.courseId === newCourse?.id);
        updateEvaluationClass(foundClass?.classId, evaluationState.teacherId, newCourse?.id as number | undefined);
    }

    return (
        <div
            className="flex flex-col gap-5"
        >
            <div
                className="flex flex-col w-full gap-5 md:gap-10 md:flex-row"
            >
                <QuestionComponent
                    label="Nome do Docente:"
                    component={DropDown}
                    componentProps={{
                        options: teacherDropdown.sort(sortTeachersClassFirst(courseDropdown.find(el => el.id === evaluationState.courseId) ?? null)),
                        placeholder: "Sua resposta",
                        searchable: true,
                        value: teacherDropdown.find(el => el.id === evaluationState.teacherId) ?? null,
                        onChange: (newValue: IOption | null) => {
                            changeTeacher(newValue);
                        }
                    }}
                    sx={{
                        flexGrow: '1'
                    }}
                />
                <QuestionComponent
                    label="Nome e/ou Código da Disciplina"
                    component={DropDown}
                    componentProps={{
                        options: courseDropdown.sort(sortCoursesClassFirst(teacherDropdown.find(el => el.id === evaluationState.teacherId) ?? null)),
                        placeholder: "Sua resposta",
                        searchable: true,
                        showSubtitle: true,
                        value: courseDropdown.find(el => el.id === evaluationState.courseId) ?? null,
                        searchFilter: (search, option) => {
                            const normalizedSearch = search.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            return (
                                option.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedSearch.toLowerCase()) ||
                                option.subtitle?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedSearch.toLowerCase())
                            ) ?? false;
                        },
                        onChange: (newValue: IOption | null) => {
                            changeCourse(newValue);
                        }
                    }}
                    sx={{
                        flexGrow: '2'
                    }}
                />
            </div>
            {questions && questions.map(question => (
                <QuestionComponent
                    key={question.id}
                    label={question.question}
                    component={componentTypes[question.type]}
                    componentProps={{
                        multiline: true,
                        rows: 4,
                        label: 'Sua resposta',
                        value: evaluationState.answers.find(an => an.questionId === question.id)?.answer || '',
                        onChange: (newValue: string) => {
                            updateAnswer(question.id, String(newValue));
                        }
                    }}
                />
            ))}

        </div>
    )
}

export default Questions;
