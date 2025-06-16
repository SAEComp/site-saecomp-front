import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { GetPublicAnswerDetailsOut } from "../../../schemas/teacherEvaluation/output/answer.schema";
import { answersService } from "../../../services/answers.service";

interface CardProps {
    evaluationId: number | null;
    setShowCard: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Card({ evaluationId, setShowCard }: CardProps) {
    const [cardData, setCardData] = useState<GetPublicAnswerDetailsOut | null>(null);

    useEffect(() => {
        async function fetchCardData() {
            if (!evaluationId) return;
            const data = await answersService.getAnswersDetails(evaluationId);
            if (data) {
                setCardData(data);
            } else {
                alert("Erro ao buscar os detalhes da avaliação. Tente novamente mais tarde.");
            }
        }

        fetchCardData();
    }, [evaluationId]);

    return (
        <div
            onClick={() => setShowCard(false)}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative bg-[#CD0000] w-[396px] h-[529px] rounded-3xl flex flex-col z-30"
            >
                <div className="flex justify-between items-center px-6 pt-6">
                    <div className="flex space-x-2">
                        <span className="bg-white text-black text-xs font-inter rounded-full px-2.5 py-0.5">
                            {cardData?.instituteCode}
                        </span>
                        <span className="bg-slate-200 text-black text-xs font-inter rounded-full px-2.5 py-0.5">
                            {cardData?.departmentCode}
                        </span>
                    </div>
                    <button
                        onClick={() => setShowCard(false)}
                        className="bg-[#A60000] w-9 h-9 flex items-center justify-center rounded-full cursor-pointer z-30"
                    >
                        <CloseIcon className="text-white" fontSize="small" />
                    </button>
                </div>

                <div className="flex flex-col items-center flex-grow -mt-10">
                    <div className="relative w-64 h-64">
                        {/* Outer border */}
                        <div className="absolute inset-0 rounded-full border-6 border-white" />
                        {/* Photo background and image */}
                        <div className="absolute inset-3 flex items-center justify-center rounded-full bg-[#D9D9D9]">
                            <img
                                src={`${import.meta.env.VITE_FILES}/${cardData?.teacherId}.jpg`}
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                    </div>

                    <div className="-mt-16 bg-[#CD0020] z-10 px-4 py-1 rounded-lg text-white font-inter text-sm">
                        {cardData?.teacherName}
                    </div>

                    <div className="flex-grow bg-white w-full rounded-b-3xl z-10 mt-2">
                        {cardData?.answers.map((answer) => (
                            <div
                                key={answer.questionId}
                                className="p-2"
                            >
                                <div className="text-lg font-semibold mb-2">
                                    {answer.question}
                                </div>
                                <p className="text-gray-700 bg-slate-300 rounded py-2 px-4">
                                    {answer.answer}
                                </p>
                            </div>
                        ))}
                    </div>




                </div>
            </div>
        </div>
    );
}
