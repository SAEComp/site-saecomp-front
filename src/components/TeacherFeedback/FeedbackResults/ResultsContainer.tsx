import { useState, useEffect, useCallback } from "react";
import Card from "./Card";
import Filter from "./Filter";
import Spinner from "../../Spinner/Spinner";
import { answersService } from "../../../services/answers.service";
import { evaluationService } from "../../../services/evaluation.service";
import { Classes } from "../../../schemas/teacherEvaluation/output/evaluation.schema";
import { GetPublicAnswersOut } from "../../../schemas/teacherEvaluation/output/answer.schema";
import { getInstituteTheme } from "./CardColors";
import { distinct } from "../../../utils/distinct";

const ResultsContainer = () => {
    const [loadingTeachers, setLoadingTeachers] = useState<boolean>(false);
    const [loadingCard, setLoadingCard] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [showCard, setShowCard] = useState<boolean>(false);
    const [classes, setClasses] = useState<Classes[]>([]);
    const [answers, setAnswers] = useState<GetPublicAnswersOut>({
        isLastPage: false,
        teacherGeneralInfo: [],
    });
    const [selectedEvaluation, setSelectedEvaluation] = useState<number | null>(
        null
    );
    const [currentPage, setCurrentPage] = useState<number>(1);

    const fetchInitialData = async () => {
        setLoadingTeachers(true);
        const _classes = await evaluationService.getClasses();
        if (!_classes) {
            alert("Erro ao buscar as turmas. Tente novamente mais tarde.");
            return;
        }
        setClasses(_classes);
        const _answers = await answersService.getAnswers(1, 20);
        if (!_answers) {
            alert("Erro ao buscar as respostas. Tente novamente mais tarde.");
            return;
        }
        setAnswers(_answers);
        setCurrentPage(1);
        setLoadingTeachers(false);
    };

    const loadMoreAnswers = useCallback(async () => {
        if (loadingMore || answers.isLastPage) return;

        setLoadingMore(true);
        const nextPage = currentPage + 1;
        const newAnswers = await answersService.getAnswers(nextPage, 20);

        if (newAnswers) {
            setAnswers((prev) => ({
                isLastPage: newAnswers.isLastPage,
                teacherGeneralInfo: distinct([
                    ...prev.teacherGeneralInfo,
                    ...newAnswers.teacherGeneralInfo,
                ], ["classId", "teacherId"]),
            }));
            setCurrentPage(nextPage);
        }
        setLoadingMore(false);
    }, [currentPage, loadingMore, answers.isLastPage]);

    const handleScroll = useCallback(() => {
        if (showCard) return;

        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.offsetHeight;

        if (scrollTop + windowHeight >= docHeight - 100) {
            loadMoreAnswers();
        }
    }, [showCard, loadMoreAnswers]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    const loadCard = async (evaluationId: number) => {
        setLoadingCard(true);
        setSelectedEvaluation(evaluationId);
        setLoadingCard(false);
        setShowCard(true);
    };

    return (
        <>
            {showCard && selectedEvaluation !== null && (
                <Card
                    classInfo={answers.teacherGeneralInfo.find(
                        (turma) => turma.classId === selectedEvaluation
                    )}
                    classId={selectedEvaluation}
                    setShowCard={setShowCard}
                />
            )}
            <div
                className="bg-[#03B04B] w-full flex flex-col items-center justify-center py-[50px] gap-[50px]"
                style={{
                    overflowY: showCard ? "hidden" : "auto",
                }}
            >
                <Filter classes={classes} setAnswers={setAnswers} />
                <div className="flex flex-wrap mx-[1vw] sm:mx-[10vw] md:mx-[5vw] lg:mx-[5vw] xl:mx-[10vw] justify-center items-center">
                    {answers.teacherGeneralInfo.length ? (
                        answers.teacherGeneralInfo.map((evaluation) => {
                            let theme = getInstituteTheme(evaluation.instituteCode);
                            return (
                                <div
                                    key={`${evaluation.classId}-${evaluation.teacherId}`}
                                    className={`h-[50vh] w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[25vw] xl:w-[20vw] ${theme.bgColor} rounded-[30px] m-[10px] flex flex-col items-center justify-center gap-[5%] transform transition-transform duration-300 hover:-translate-y-2 cursor-pointer px-3 py-2`}
                                    onClick={() => loadCard(evaluation.classId)}
                                >
                                    <div className="aspect-square bg-[#d9d9d9] rounded-full overflow-hidden">
                                        <img
                                            className="w-full h-full object-cover aspect-square"
                                            src={`${import.meta.env.VITE_FILES}/${evaluation.teacherId}.jpg`}
                                        />
                                    </div>

                                    <p className="font-inter bg-[#d9d9d9] text-slate-700 rounded-[12px] px-[10px] py-[5px] font-medium text-sm">
                                        {evaluation.teacherName}
                                    </p>
                                    <p className="font-inter bg-[#d9d9d9] text-slate-700 text-center rounded-[12px] px-[10px] py-[5px] font-medium text-sm">
                                        {evaluation.courseCode} <br /> {evaluation.courseName}
                                    </p>
                                    <p className="font-inter bg-[#d9d9d9] text-slate-700 rounded-[12px] px-[10px] py-[5px] font-medium text-sm">
                                        {evaluation.semesterCode}
                                    </p>
                                    <p className="font-inter bg-[#d9d9d9] text-slate-700 rounded-[12px] px-[10px] py-[5px] font-medium text-sm">
                                        {evaluation.averageScore !== null && evaluation.averageScore !== undefined
                                            ? evaluation.averageScore.toFixed(1)
                                            : "N/A"}
                                    </p>
                                </div>
                            );
                        })
                    ) : (
                        <div className="h-[40vh] w-full flex items-center justify-center text-green-200 font-bold text-2xl text-shadow-lg select-none">
                            Nenhuma avaliação encontrada
                        </div>
                    )}
                </div>

                {loadingTeachers && <Spinner />}
                {loadingMore && (
                    <div className="flex justify-center py-4">
                        <Spinner />
                    </div>
                )}
            </div>
        </>
    );
};

export default ResultsContainer;
