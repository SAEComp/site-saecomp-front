import { useEffect, useState } from "react";
import useIsMobile from "./useIsMobile";
import NumberInput from "../../Inputs/NumberInput";
import { Classes, ActiveQuestions, Teacher, Course } from "../../../schemas/teacherEvaluation/output/evaluation.schema";
import Counter from "./Counter";
import Questions from "./Questions";
import AnimatedCarousel from "../../AnimatedCarousel/AnimatedCarousel";
import { evaluationService } from "../../../services/evaluation.service";
import useEvaluationForm from "./useEvaluationForm";
import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DropDown, { IOption } from "../../Inputs/DropDown";
import { useNavigate } from "react-router";
import Spinner from "../../Spinner/Spinner";
import { toast } from "sonner";


const idealYearOptions: IOption[] = [
    { label: '1° período', id: 1 },
    { label: '3° período', id: 3 },
    { label: '5° período', id: 5 },
    { label: '7° período', id: 7 },
    { label: '9° período', id: 9 },
]



const Form = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState<Classes[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [teacherDropdown, setTeacherDropdown] = useState<IOption[]>([]);
    const [courseDropdown, setCourseDropdown] = useState<IOption[]>([]);
    const [questions, setQuestions] = useState<ActiveQuestions>([]);
    const [idealYear, setIdealYear] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const isMobile = useIsMobile();
    const evaluationForm = useEvaluationForm();

    const sortTeachersClassFirst = (selectedCourse: IOption | null) => {
        if (!selectedCourse) {
            return (a: IOption, b: IOption) => String(a.label).localeCompare(String(b.label));
        }
        const filteredClasses = classes.filter(c => c.courseId === selectedCourse.id);
        const teacherIdsInClass = new Set(filteredClasses.map(c => c.teacherId));
        return (a: IOption, b: IOption) => {
            const aInClass = teacherIdsInClass.has(a.id as number);
            const bInClass = teacherIdsInClass.has(b.id as number);
            if (aInClass && !bInClass) return -1;
            if (!aInClass && bInClass) return 1;
            return String(a.label).localeCompare(String(b.label));
        }
    }

    const sortCoursesClassFirst = (selectedTeacher: IOption | null) => {
        if (!selectedTeacher) {
            return (a: IOption, b: IOption) => String(a.label).localeCompare(String(b.label));
        }
        const filteredClasses = classes.filter(c => c.teacherId === selectedTeacher.id);
        const courseIdsInClass = new Set(filteredClasses.map(c => c.courseId));
        return (a: IOption, b: IOption) => {
            const aInClass = courseIdsInClass.has(a.id as number);
            const bInClass = courseIdsInClass.has(b.id as number);
            if (aInClass && !bInClass) return -1;
            if (!aInClass && bInClass) return 1;
            return String(a.label).localeCompare(String(b.label));
        }
    }

    const fetchInitialData = async () => {
        const [_classes, _teachers, _courses, _questions] = await Promise.all([
            evaluationService.getClasses(),
            evaluationService.getTeachers(),
            evaluationService.getCourses(),
            evaluationService.getQuestions()
        ]);
        if (!_classes) toast.error('Erro ao buscar as disciplinas.');
        else setClasses(_classes);
        if (!_teachers) toast.error('Erro ao buscar os professores.');
        else setTeachers(_teachers);
        if (!_courses) toast.error('Erro ao buscar as disciplinas.');
        else setCourses(_courses);
        if (!_questions) toast.error('Erro ao buscar as perguntas.');
        else setQuestions(_questions);
        if (!_classes || !_teachers || !_courses) return;
        setTeacherDropdown(
            _teachers.map(t => ({ id: t.teacherId, label: t.teacherName }))
        );
        setCourseDropdown(
            _courses.map(c => ({ id: c.courseId, label: c.courseName, subtitle: c.courseCode }))
        );
    }

    useEffect(() => {
        fetchInitialData();
    }, []);

    const createFeedback = async () => {
        setLoading(true);
        for (const evaluation of evaluationForm.state.evaluations) {
            if (!evaluation.teacherId || !evaluation.courseId) {
                toast.error('Por favor, preencha todas as informações das disciplinas e professores.');
                setLoading(false);
                return;
            }
            for (const question of questions) {
                if (!evaluation.answers.find(e => e.questionId == question.id)?.answer.trim() && question.required) {
                    toast.error('Por favor, responda todas as perguntas obrigatórias.');
                    setLoading(false);
                    return;
                }
            }
        }
        const result = await evaluationService.createEvaluation(evaluationForm.state.evaluations);
        setLoading(false);
        if (!result) {
            console.error(result);
            toast.error('Erro ao enviar a avaliação.');
            return;
        }
        toast.success('Avaliação enviada com sucesso!');
        navigate('/avaliacoes', { replace: true });
    };

    const getIdealYear = async (idealYear: number | null) => {
        evaluationForm.resetForm();
        console.log(evaluationForm.state)
        if (idealYear === null) return;
        const _idealClasses = await evaluationService.getClasses(idealYear);
        if (!_idealClasses || _idealClasses.length === 0) return;
        evaluationForm.setTotalEvaluations(_idealClasses.length)
        _idealClasses.forEach((el, i) => {
            evaluationForm.updateEvaluationClass(i, el.classId, el.teacherId, el.courseId);
        })
    }


    return (
        <div
            className="flex flex-col justify-center items-center gap-10 w-full bg-[#03B04B] py-8 sm:px-8 md:px-10 px-2"

        >
            <div
                className="flex flex-col justify-center items-center w-full gap-4 md:flex-row md:justify-between md:w-[40%] text-center"
            >
                <span
                    className="font-inter text-white"
                >
                    Quantas disciplinas você cursou esse semestre?
                </span>
                <NumberInput
                    key={evaluationForm.state.totalEvaluations}
                    min={1}
                    max={50}
                    defaultValue={evaluationForm.state.totalEvaluations}
                    onChange={(newValue) => newValue ? evaluationForm.setTotalEvaluations(newValue) : null}
                    mobile={isMobile}
                />
            </div>
            <div
                className="flex flex-col justify-center items-center w-full gap-4 md:flex-row md:justify-between md:w-[40%] text-center"
            >
                <span
                    className="font-inter text-white"
                >
                    Qual o seu período ideal?
                </span>
                <DropDown
                    options={idealYearOptions}
                    value={idealYearOptions.find(option => option.id === idealYear) || null}
                    onChange={(option) => {
                        setIdealYear(option ? Number(option.id) : null);
                        getIdealYear((option?.id ?? null) as number | null);
                    }}
                    searchable={false}
                    placeholder="Selecione o período ideal"
                />
            </div>
            <div className="flex flex-col bg-white w-full rounded-xl p-5 md:p-12 gap-5 relative">
                <div className="flex justify-between">
                    <Counter
                        setCurrentQuestion={evaluationForm.setCurrentEvaluation}
                        totalQuestions={evaluationForm.state.totalEvaluations}
                        currentQuestion={evaluationForm.state.currentEvaluation}
                    />
                    <div className="flex my-auto gap-5">
                        <div
                            className="bg-black rounded-lg flex justify-center items-center p-2 cursor-pointer group"
                            title="Resetar todos os formulários"
                            onClick={() => evaluationForm.resetForm()}
                        >
                            <RestartAltIcon className="text-white group-hover:animate-spinOnce h-6 w-6" />
                        </div>
                        {evaluationForm.state.totalEvaluations > 1 && (<div
                            className="bg-black rounded-lg flex justify-center items-center p-2 cursor-pointer group"
                            title="Excluir formulário atual"
                            onClick={() => evaluationForm.removeEvaluation(evaluationForm.state.currentEvaluation)}
                        >
                            <CloseIcon className="text-white group-hover:scale-125 duration-100 transition-transform ease-in-out h-6 w-6" />
                        </div>)}

                    </div>




                </div>

                <AnimatedCarousel
                    index={evaluationForm.state.currentEvaluation}
                    setIndex={evaluationForm.setCurrentEvaluation}
                    className="w-full"
                >
                    {Array.from({ length: evaluationForm.state.totalEvaluations }).map((_, i) => (
                        <Questions
                            key={`${i}-${evaluationForm.state.evaluations[i]?.classId ?? 'none'}`}
                            evaluationState={evaluationForm.state.evaluations[i]}
                            updateEvaluationClass={(classId, teacherId, courseId) => evaluationForm.updateEvaluationClass(i, classId, teacherId, courseId)}
                            updateAnswer={(questionId, answer) => evaluationForm.updateAnswer(i, questionId, answer)}
                            classes={classes}
                            questions={questions}
                            teacherDropdown={teacherDropdown}
                            courseDropdown={courseDropdown}
                            sortTeachersClassFirst={sortTeachersClassFirst}
                            sortCoursesClassFirst={sortCoursesClassFirst}
                        />
                    ))}
                </AnimatedCarousel>

                <Counter
                    setCurrentQuestion={evaluationForm.setCurrentEvaluation}
                    totalQuestions={evaluationForm.state.totalEvaluations}
                    currentQuestion={evaluationForm.state.currentEvaluation}
                />
            </div>
            {loading ? (<Spinner/>) : (<button
                className={`bg-[#101010] text-white font-inter font-medium h-12 w-[80%] md:w-[30%] rounded-lg`}
                onClick={createFeedback}
            >
                Enviar
            </button>)}

        </div>
    )
}

export default Form;