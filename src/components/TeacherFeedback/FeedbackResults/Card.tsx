import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { GetPublicAnswerDetailsOut } from "../../../schemas/teacherEvaluation/output/answer.schema";
import { answersService } from "../../../services/answers.service";

interface CardProps {
  evaluationScore: number | null;
  evaluationId: number | null;
  setShowCard: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Card({
  evaluationScore,
  evaluationId,
  setShowCard,
}: CardProps) {
  const [cardData, setCardData] = useState<GetPublicAnswerDetailsOut | null>(
    null
  );

  useEffect(() => {
    async function fetchCardData() {
      if (!evaluationId) return;
      const data = await answersService.getAnswersDetails(evaluationId);
      if (data) {
        setCardData(data);
      } else {
        alert(
          "Erro ao buscar os detalhes da avaliação. Tente novamente mais tarde."
        );
      }
    }

    fetchCardData();
  }, [evaluationId]);

  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [showQuestionCard, setShowQuestionCard] = useState<boolean>(false);

  const loadQuestionCard = (questionId: number) => {
    setSelectedQuestion(questionId);
    setShowQuestionCard(true);
    console.log(bgcolor);
  };

  const unloadQuestionCard = () => {
    setSelectedQuestion(null);
    setShowQuestionCard(false);
  };

  // CORES=====================================================================
  const instituteColors = {
    EESC: "bg-yellow-500",
    ICMC: "bg-blue-800",
    IAU: "bg-red-700",
    IFSC: "bg-blue-400",
    IQSC: "bg-green-500",
    DEFAULT: "bg-black-400",
  };

  const auxInstituteColors = {
    EESC: "bg-yellow-400",
    ICMC: "bg-blue-400",
    IAU: "bg-red-500",
    IFSC: "bg-blue-200",
    IQSC: "bg-green-300",
    DEFAULT: "bg-black-200",
  };

  type InstituteCodeKey = keyof typeof instituteColors;
  type auxInstituteCodeKey = keyof typeof auxInstituteColors;

  function isInstituteKey(key: string): key is InstituteCodeKey {
    return key in instituteColors;
  }
  function isAuxInstituteKey(key: string): key is auxInstituteCodeKey {
    return key in auxInstituteColors;
  }

  let bgcolor = instituteColors.DEFAULT; // Começa com a cor padrão
  let auxcolor = auxInstituteColors.DEFAULT;

  const instituteKey = cardData?.instituteCode;

  // 2. Usa a função para verificar a chave antes de acessar o objeto
  if (
    instituteKey &&
    isInstituteKey(instituteKey) &&
    isAuxInstituteKey(instituteKey)
  ) {
    // Dentro deste if, o TypeScript sabe que 'instituteKey' é do tipo InstituteCodeKey
    bgcolor = instituteColors[instituteKey];
    auxcolor = auxInstituteColors[instituteKey];
  }
  //===========================================================================

  return (
    <>
      {/* CARD ORIGINAL */}
      {!showQuestionCard && (
        <div //fundo transparente
          onClick={() => setShowCard(false)}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div //card
            onClick={(e) => e.stopPropagation()}
            className={`relative flex justify-center items-center overflow-hidden h-[90%] w-[300px] sm:w-[300px] md:w-[300px] lg:w-[30%] xl:w-[30%] 2xl:w-[30%] z-30 rounded-3xl ${bgcolor}`}>
            <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-[50%] w-[40vh] h-[40vh]">
              <div className="absolute inset-0 rounded-full border-6 border-white" />

              <div className="absolute inset-3 flex items-center justify-center rounded-full bg-[#D9D9D9]">
                <img
                  src={`${import.meta.env.VITE_FILES}/${
                    cardData?.teacherId
                  }.jpg`}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <div
                className={`absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-[50%] z-10 p-1 rounded-lg text-white font-inter text-sm text-center ${auxcolor}`}>
                {cardData?.teacherName}
              </div>
            </div>

            <div className=" absolute top-[11%] left-[50%] -translate-x-1/2 -translate-y-[50%] h-[10%] w-[95%] px-6 py-3 flex flex-row justify-between items-center">
              <div className="flex flex-col gap-2">
                <span className="bg-white text-black text-xs font-inter rounded-full px-2.5 py-0.5">
                  {cardData?.instituteCode}
                </span>
                <span className="bg-white text-black text-xs font-inter rounded-full px-2.5 py-0.5">
                  {cardData?.departmentCode}
                </span>
              </div>

              <button
                onClick={() => setShowCard(false)}
                className={` p-2 flex items-center justify-center rounded-full cursor-pointer z-30 ${auxcolor}`}>
                <CloseIcon className="text-white" fontSize="small" />
              </button>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-[60%] bg-white rounded-3xl overflow-auto">
              <div className="flex flex-col w-full rounded-b-3xl z-10 p-[2%] gap-1 items-center justify-center">
                <div className="text-lg font-semibold  bg-gray-400 rounded-lg p-1 w-[80%] text-center">
                  {cardData?.courseName + " - " + cardData?.courseCode}
                </div>

                <div className="text-lg font-semibold  bg-gray-400 rounded-lg p-1 w-[80%] text-center">
                  {"Nota geral: " + evaluationScore?.toPrecision(2)}
                </div>
              </div>

              <hr className="my-1 mx-3" />

              <div className=" rounded-xl my-1 mx-[5%] w-[90%] text-lg font-semibold text-center">
                Perguntas disponíveis
              </div>

              <div className="flex flex-col gap-1 items-center">
                {cardData?.answers.map((answer) => (
                  <div
                    key={answer.questionId}
                    className="p-1 bg-gray-400 rounded-xl mt-2 w-[90%]"
                    onClick={() => loadQuestionCard(answer.questionId)}>
                    <div className="text-lg font-semibold mb-2 text-center">
                      {answer.question}
                    </div>
                  </div>
                ))}
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
            className={`flex flex-col gap-1 items-center overflow-auto h-[90%] w-[300px] sm:w-[300px] md:w-[300px] lg:w-[30%] xl:w-[30%] 2xl:w-[30%] z-30 rounded-3xl ${bgcolor}`}>
            <div className="h-[10%] w-[95%] px-6 py-3 flex flex-row gap-1 justify-between items-center mt-1">
              <span className="bg-white text-black font-inter rounded-full px-2.5 py-0.5">
                {
                  cardData?.answers.find(
                    (answer) => answer.questionId === selectedQuestion
                  )?.question
                }
              </span>

              <button
                onClick={() => unloadQuestionCard()}
                className={`p-2 flex items-center justify-center rounded-full cursor-pointer z-30 ${auxcolor}`}>
                <CloseIcon className="text-white" fontSize="small" />
              </button>
            </div>

            <div className=" flex flex-col w-full items-center rounded-3xl mt-1 gap-1">
              {cardData?.answers
                .filter((answer) => answer.questionId === selectedQuestion)
                .map((answer2) => (
                  <div
                    key={answer2.questionId}
                    className="p-2 text-center w-[80%] bg-white rounded-xl">
                    {answer2.answer}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
