import QuestionComponent from "./QuestionComponent";
import TextInput from "../../Inputs/TextInput";
import SliderInput from "../../Inputs/SliderInput";
import DropDown from "../../Inputs/DropDown";
import { IEvaluation } from "../../../schemas/teacherEvaluation/input/evaluation.schema";
import { Classes } from "../../../schemas/teacherEvaluation/output/evaluation.schema";
import { IOption } from "../../Inputs/DropDown";
import { useEffect, useState, useRef } from "react";
import { distinct } from "../FeedbackResults/Filter";
import questionTypes from "../../../types/questionTypes";
import { ActiveQuestions } from "../../../schemas/teacherEvaluation/output/evaluation.schema";


export const componentTypes: Record<typeof questionTypes[number], React.ComponentType<any>> = {
    text: TextInput,
    slider: SliderInput,
    numeric: SliderInput
}


interface QuestionProps {
    evaluationState: IEvaluation;
    updateEvaluationClass: (classId: number) => void;
    updateAnswer: (questionId: number, answer: string) => void;
    classes: Classes[];
    questions: ActiveQuestions;
}

const Questions = ({ evaluationState, updateEvaluationClass, updateAnswer, classes, questions }: QuestionProps) => {
    const [teachers, setTeachers] = useState<IOption[]>([]);
    const [courses, setCourses] = useState<IOption[]>([]);
    const [selectedTeacher, setSelectedTeacher] = useState<IOption | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<IOption | null>(null);
    const internalChange = useRef<boolean>(false);

    useEffect(() => {
        setTeachers(
            distinct(classes.map(q => ({
                id: q.teacherId,
                label: q.teacherName
            })), 'id')
        );
        setCourses(
            distinct(classes.map(q => ({
                id: q.courseId,
                label: q.courseName,
                subtitle: q.courseCode
            })), 'id')
        );
    }, [classes]);

    useEffect(() => {
        if (internalChange.current) {
            // Só atualiza os estados locais, não sobrescreve nada
            internalChange.current = false;
            return;
        }
        if (!evaluationState.classId || evaluationState.classId < 0) {
            setSelectedTeacher(null);
            setSelectedCourse(null);
            return;
        }
        const _class = classes.find(el => el.classId === evaluationState.classId)
        if (!_class) return;
        setSelectedTeacher({
            id: _class.teacherId,
            label: _class.teacherName
        });
        setSelectedCourse({
            id: _class.courseId,
            label: _class.courseName,
            subtitle: _class.courseCode
        });
    }, [evaluationState.classId, classes])

    function changeTeacher(newTeacher: IOption | null) {
        setSelectedTeacher(newTeacher);
        setCourses(
            distinct(classes.filter(q => !newTeacher ? true : q.teacherId === newTeacher.id).map(q => ({
                id: q.courseId,
                label: q.courseName,
                subtitle: q.courseCode
            })), 'id')
        );
        if (newTeacher && selectedCourse) {
            const foundClass = classes.find(q => q.teacherId === newTeacher.id && q.courseId === selectedCourse.id);
            if (foundClass) {
                updateEvaluationClass(foundClass.classId);
            }
        }
    }

    function changeCourse(newCourse: IOption | null) {
        setSelectedCourse(newCourse);
        setTeachers(
            distinct(classes.filter(q => !newCourse ? true : q.courseId === newCourse.id).map(q => ({
                id: q.teacherId,
                label: q.teacherName
            })), 'id')
        );
        if (newCourse && selectedTeacher) {
            const foundClass = classes.find(q => q.teacherId === selectedTeacher.id && q.courseId === newCourse.id);
            if (foundClass) {
                updateEvaluationClass(foundClass.classId);
            }
        }
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
                        options: teachers,
                        placeholder: "Sua resposta",
                        searchable: true,
                        value: selectedTeacher,
                        onChange: (newValue: IOption | null) => {
                            internalChange.current = true;
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
                        options: courses,
                        placeholder: "Sua resposta",
                        searchable: true,
                        showSubtitle: true,
                        value: selectedCourse,
                        searchFilter: (search, option) => {
                            const normalizedSearch = search.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            return (
                                option.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedSearch.toLowerCase()) ||
                                option.subtitle?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedSearch.toLowerCase())
                            ) ?? false;
                        },
                        onChange: (newValue: IOption | null) => {
                            internalChange.current = true;
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
