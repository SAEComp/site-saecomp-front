import React from "react";
import { GetPublicAnswerDetailsOut } from "../../../schemas/teacherEvaluation/output/answer.schema";


interface IQuestionCardProps {
  setShowQuestionCard: React.Dispatch<React.SetStateAction<boolean>>;
  cardData: GetPublicAnswerDetailsOut | null;
  selectedQuestion : number | null;
}

const QuestionCard = ({setShowQuestionCard, cardData, selectedQuestion}: IQuestionCardProps) => {

  return (
    <div
      onClick={()=>setShowQuestionCard(false)}
      className="bg-slate-400">
      {cardData?.answers
      .filter(answer => answer.questionId === selectedQuestion)
      .map((answer) => (
                <div
                  key={answer.questionId}
                  className="p-2 my-2 mx-3 bg-[#BCBCBC] rounded">
                  <div
                    className="text-lg font-semibold mb-2">
                    {answer.answer}
                  </div>
                </div>
              ))}
    </div>
  );
};

export default QuestionCard;
