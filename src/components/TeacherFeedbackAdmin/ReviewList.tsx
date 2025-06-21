import { GetAdminAnswersOut } from "../../schemas/adminAnswers.schema";

interface IReviewListProps {
  answersList: GetAdminAnswersOut | null;
  detailedAnswerIndex: number | null;
  onReviewClick: (id: number) => void
}

const ReviewList = (
  {answersList,
detailedAnswerIndex,
  onReviewClick

} : IReviewListProps
) => {
  return (
    <div className="flex flex-col  w-full h-full p-2 overflow-auto overscroll-" >
      {answersList?.answers.map((avaliacao) => (
        <div
          onClick={() => {onReviewClick(avaliacao.evaluationId)}}
          key={avaliacao.evaluationId}
          className={` p-4 mb-4 mr-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300
          ${
            avaliacao.status === "pending"
              ? "bg-yellow-500"
              : avaliacao.status === "approved"
              ? "bg-green-900"
              : avaliacao.status === "rejected"
              ? "bg-red-500" : "bg-purple-100"
          }
          active:scale-95
          transition-all duration-300 
          ease-in-out
          shadow-md active:shadow-lg
          cursor-pointer select-none
          ${detailedAnswerIndex === avaliacao.evaluationId ? "translate-x-5" : ""}
          `}>
          <h3 className="text-lg text-black font-semibold">
            {avaliacao.teacherName}
          </h3>
          <p className="text-sm text-black">{avaliacao.courseName}</p>
          <p className="text-sm text-black">{avaliacao.courseCode}</p>

          <div className="flex flex-row ">
            <div>
              <p className="text-sm text-black">Status: {avaliacao.status}</p>
              <p className="text-sm text-black">
                Semestre: {avaliacao.semester}
              </p>
            </div>
            <div className="ml-auto">
              <br />
              <p className="text-sm text-black">Id: {avaliacao.evaluationId}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
