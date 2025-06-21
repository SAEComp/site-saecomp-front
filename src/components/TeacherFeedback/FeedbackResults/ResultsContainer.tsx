import { useState, useEffect } from "react";
import arrow from "../../../assets/svg/arrow.svg";
import Card from "./Card";
import Filter from "./Filter";
import Spinner from "../../Spinner/Spinner";
import { answersService } from "../../../services/answers.service";
import { evaluationService } from "../../../services/evaluation.service";
import { Classes } from "../../../schemas/teacherEvaluation/output/evaluation.schema";
import { GetPublicAnswersOut } from "../../../schemas/teacherEvaluation/output/answer.schema";

const ResultsContainer = () => {
  const [loadingTeachers, setLoadingTeachers] = useState<boolean>(false);
  const [loadingCard, setLoadingCard] = useState<boolean>(false);
  const [showCard, setShowCard] = useState<boolean>(false);
  const [classes, setClasses] = useState<Classes[]>([]);
  const [answers, setAnswers] = useState<GetPublicAnswersOut>({
    isLastPage: false,
    score: 0,
    evaluations: [],
  });
  const [selectedEvaluation, setSelectedEvaluation] = useState<number | null>(
    null
  );

  const fetchInitialData = async () => {
    setLoadingTeachers(true);
    const _classes = await evaluationService.getClasses();
    if (!_classes) {
      alert("Erro ao buscar as turmas. Tente novamente mais tarde.");
      return;
    }
    setClasses(_classes);
    const _answers = await answersService.getAnswers();
    if (!_answers) {
      alert("Erro ao buscar as respostas. Tente novamente mais tarde.");
      return;
    }
    setAnswers(_answers);
    setLoadingTeachers(false);
  };

  const loadCard = async (evaluationId: number) => {
    setLoadingCard(true);
    setSelectedEvaluation(evaluationId);
    setLoadingCard(false);
    setShowCard(true);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  return (
    <>
      {showCard && (
        <Card evaluationId={selectedEvaluation} setShowCard={setShowCard} />
      )}
      <div
        className="bg-[#03B04B] w-full flex flex-col items-center justify-center py-[50px] gap-[50px]"
        style={{
          overflowY: showCard ? "hidden" : "auto",
        }}>
        <Filter classes={classes} setAnswers={setAnswers} />
        <div className="flex flex-wrap mx-[1vw] sm:mx-[10vw] md:mx-[5vw] lg:mx-[5vw] xl:mx-[10vw] justify-center items-center">
          {answers.evaluations.length ? (
            answers.evaluations.map((evaluation) => (
              <div
                key={evaluation.evaluationId}
                className="h-[50vh] w-[85vw] sm:w-[60vw] md:w-[40vw] lg:w-[25vw] xl:w-[20vw] bg-white rounded-[30px] m-[10px] flex flex-col items-center justify-center gap-[5%] transform transition-transform duration-300 hover:-translate-y-2 cursor-pointer"
                onClick={() => loadCard(evaluation.evaluationId)}>
                <div className="w-[60%] aspect-square bg-[#d9d9d9] rounded-full overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={`${import.meta.env.VITE_FILES}/${
                      evaluation.teacherId
                    }.jpg`}
                  />
                </div>

                <p className="font-inter bg-[#d9d9d9] text-slate-700 rounded-[12px] px-[10px] py-[5px] font-medium">
                  {evaluation.teacherName}
                </p>
                <p className="font-inter bg-[#d9d9d9] text-slate-700 text-center rounded-[12px] px-[10px] py-[5px] font-medium">
                  {evaluation.courseCode} <br /> {evaluation.courseName}
                </p>
                <p className="font-inter bg-[#d9d9d9] text-slate-700 rounded-[12px] px-[10px] py-[5px] font-medium">
                  {evaluation.score}
                </p>
              </div>
            ))
          ) : (
            <div className="h-[40vh] w-full flex items-center justify-center text-green-200 font-bold text-2xl text-shadow-lg select-none">
              Nenhuma avaliação encontrada
            </div>
          )}
        </div>

        {loadingTeachers && <Spinner />}
      </div>
    </>
  );
};

export default ResultsContainer;
