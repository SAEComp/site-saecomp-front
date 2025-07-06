import { useEffect, useState } from "react";
import useIsMobile from "./useIsMobile";
import NumberInput from "../../Inputs/NumberInput";
import { Classes, ActiveQuestions } from "../../../schemas/teacherEvaluation/output/evaluation.schema";
import Counter from "./Counter";
import Questions from "./Questions";
import AnimatedCarousel from "../../AnimatedCarousel/AnimatedCarousel";
import { evaluationService } from "../../../services/evaluation.service";
import useEvaluationForm from "./useEvaluationForm";
import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';


const Form = () => {
    const [classes, setClasses] = useState<Classes[]>([]);
    const [questions, setQuestions] = useState<ActiveQuestions>([]);
    const isMobile = useIsMobile();
    const evaluationForm = useEvaluationForm();

    const fetchInitialData = async () => {
        const _classes = await evaluationService.getClasses();
        if (!_classes) {
            alert('Erro ao buscar as turmas. Tente novamente mais tarde.');
            return;
        }
        setClasses(_classes);
        const _questions = await evaluationService.getQuestions();
        if (!_questions) {
            alert('Erro ao buscar as perguntas. Tente novamente mais tarde.');
            return;
        }
        setQuestions(_questions);
    }

    useEffect(() => {
        fetchInitialData();
    }, []);

    const createFeedback = async () => {
        await evaluationService.createEvaluation("0000000", evaluationForm.state.evaluations)
    };


    return (
        <div
            className="flex flex-col justify-center items-center gap-10 w-full bg-[#03B04B] py-8 sm:px-8 md:px-10 px-2"

        >
            <div
                className="flex flex-col justify-center items-center w-full gap-4 md:flex-row md:gap-[10%]"
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
                            title="Resetar formulário"
                            onClick={() => evaluationForm.resetForm()}
                        >
                            <RestartAltIcon className="text-white group-hover:animate-spinOnce h-6 w-6" />
                        </div>
                        {evaluationForm.state.totalEvaluations > 1 && (<div
                            className="bg-black rounded-lg flex justify-center items-center p-2 cursor-pointer group"
                            title="Limpar todos os formulários"
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
                            key={i}
                            evaluationState={evaluationForm.state.evaluations[i]}
                            updateEvaluationClass={(classId) => evaluationForm.updateEvaluationClass(i, classId)}
                            updateAnswer={(questionId, answer) => evaluationForm.updateAnswer(i, questionId, answer)}
                            classes={classes}
                            questions={questions}
                        />
                    ))}
                </AnimatedCarousel>

                <Counter
                    setCurrentQuestion={evaluationForm.setCurrentEvaluation}
                    totalQuestions={evaluationForm.state.totalEvaluations}
                    currentQuestion={evaluationForm.state.currentEvaluation}
                />
            </div>
            <button
                className={`bg-[#101010] text-white font-inter font-medium h-12 w-[80%] md:w-[30%] rounded-lg`}
                onClick={createFeedback}
            >
                Enviar
            </button>

        </div>
    )
}

export default Form;