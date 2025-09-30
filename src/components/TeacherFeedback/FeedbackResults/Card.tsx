import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { GetPublicAnswerDetailsOut } from "../../../schemas/teacherEvaluation/output/answer.schema";
import { answersService } from "../../../services/answers.service";
import { getInstituteTheme } from "./CardColors";
import { PublicAnswer } from "../../../schemas/teacherEvaluation/output/answer.schema";


interface CardProps {
  classId: number | null;
  classInfo: PublicAnswer | null | undefined;
  setShowCard: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Card({
  classId,
  setShowCard,
  classInfo
}: CardProps) {
  const [cardData, setCardData] = useState<GetPublicAnswerDetailsOut | null>(
    null
  );
  const [UniqueEvaluationId, setUniqueEvaluationId] = useState<number[]>([]);

  useEffect(() => {
    async function fetchCardData() {
      if (!classId) return;
      const data = await answersService.getAnswersDetails(classId);
      if (data) {
        setCardData(data);
        setUniqueEvaluationId([...new Set(data.answers.map(answer => answer.evaluationId))])
      } else {
        alert(
          "Erro ao buscar os detalhes da avaliação. Tente novamente mais tarde."
        );
      }
    }

    fetchCardData();
  }, [classId]);

  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [showQuestionCard, setShowQuestionCard] = useState<boolean>(false);

  const loadQuestionCard = (questionId: number) => {
    setSelectedQuestion(questionId);
    setShowQuestionCard(true);
  };

  const unloadQuestionCard = () => {
    setSelectedQuestion(null);
    setShowQuestionCard(false);
  };

  let theme = getInstituteTheme(classInfo?.instituteCode);



  return (
    <>
      {/* CARD ORIGINAL */}
      {!showQuestionCard && (
        <div //fundo transparente
          onClick={() => setShowCard(false)}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div //card
            onClick={(e) => e.stopPropagation()}
            className={`relative flex justify-center  overflow-hidden h-[90%] w-[300px] sm:w-[350px] md:w-[400px] lg:w-[35%] xl:w-[35%] 2xl:w-[35%] z-30 rounded-3xl ${theme.bgColor} pt-2`}>
            <div className="relative flex flex-col w-[40vh] h-[40vh]">

              <div className="absolute inset-3 flex items-center justify-center rounded-full bg-[#D9D9D9]">
                <img
                  src={`${import.meta.env.VITE_FILES}/${classInfo?.teacherId
                    }.jpg`}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <div
                className={`absolute top-[68%] left-1/2 -translate-x-1/2 -translate-y-[50%] z-10 p-1 rounded-lg text-white font-inter text-base text-center ${theme.auxColor}`}>
                {classInfo?.teacherName}
              </div>
            </div>

            <div className=" absolute top-[11%] left-[50%] -translate-x-1/2 -translate-y-[50%] h-[10%] w-[95%] px-6 py-3 flex flex-row justify-between items-center">
              <div className="flex flex-col gap-2">
                <span className="bg-white text-black text-xs font-inter rounded-full px-2.5 py-0.5 text-center">
                  {classInfo?.instituteCode}
                </span>
                <span className="bg-white text-black text-xs font-inter rounded-full px-2.5 py-0.5 text-center">
                  {classInfo?.departmentCode}
                </span>
              </div>

              <button
                onClick={() => setShowCard(false)}
                className={` p-2 flex items-center justify-center rounded-full cursor-pointer z-30 ${theme.auxColor}`}>
                <CloseIcon className="text-white" fontSize="small" />
              </button>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-[60%] bg-white rounded-3xl overflow-auto">
              <div className="flex flex-col w-full rounded-b-3xl z-10 p-[2%] gap-1 items-center justify-center">
                <div className="text-lg font-semibold  bg-gray-400 rounded-lg p-1 w-[80%] text-center">
                  {classInfo?.courseName} <br></br> {classInfo?.courseCode}
                </div>

                <div className="text-lg font-semibold  bg-gray-400 rounded-lg p-1 w-[80%] text-center">
                  {classInfo?.semesterCode}
                </div>

                <div className="text-lg font-semibold  bg-gray-400 rounded-lg p-1 w-[80%] text-center">
                  {"Nota geral: " + classInfo?.averageScore?.toPrecision(2)}
                </div>

              </div>

              <hr className="my-1 mx-3" />

              <div className=" rounded-xl my-1 mx-[5%] w-[90%] text-lg font-semibold text-center">
                Avaliações disponíveis
              </div>

              <div className="flex flex-col gap-1 items-center">
                {
                  UniqueEvaluationId.map((evalId) => (
                    <div
                      key={evalId}
                      className="p-1 bg-gray-400 rounded-xl mb-2 w-[90%] px-[5%]"
                      onClick={() => loadQuestionCard(evalId)}>
                      <div className="text-lg font-semibold mb-2 text-center">
                        <div>Nota: {cardData?.answers.find(answer => answer.evaluationId === evalId && answer.questionId === 47)?.answerText} </div>
                        <hr></hr>
                        <div>{cardData?.answers.find(answer => answer.evaluationId === evalId && answer.questionId === 46)?.answerText}</div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CARD PARA VER RESPOSTAS DE UMA CERTA PERGUNTA */}
      {showQuestionCard && (
        <div //fundo transparente
          onClick={() => setShowCard(false)}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div //card
            onClick={(e) => e.stopPropagation()}
            className={`flex flex-col gap-1 items-center overflow-auto h-[90%] w-[300px] sm:w-[300px] md:w-[300px] lg:w-[30%] xl:w-[30%] 2xl:w-[30%] z-30 rounded-3xl ${theme.bgColor}`}>
            <div className="h-[10%] w-[95%] px-6 py-3 flex flex-row gap-1 justify-between items-center mt-1">
              <span className="bg-white text-black font-inter rounded-full px-2.5 py-0.5">
                Perguntas detalhadas
              </span>

              <button
                onClick={() => unloadQuestionCard()}
                className={`p-2 flex items-center justify-center rounded-full cursor-pointer z-30 ${theme.auxColor}`}>
                <CloseIcon className="text-white" fontSize="small" />
              </button>
            </div>

            <div className="flex flex-col w-full rounded-3xl mt-1 gap-3 items-center overflow-auto px-[5%]">
              {cardData?.answers
                .filter(answer => answer.evaluationId === selectedQuestion)
                .map((answer2) => (
                  <div
                    className="rounded-2xl overflow-hidden"
                    key={answer2.questionId}>
                    <div className={`p-2 text-center  bg-white overflow-hidden`}>{answer2.question}</div>
                    <hr className="bg-red-500"></hr>
                    <div className={`p-2 text-center bg-white over`}>{answer2.answerText}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
