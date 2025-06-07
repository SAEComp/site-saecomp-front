import { avaliacoes } from "./mock";

const ReviewList = () => {
  return (
    <div className="flex flex-col  w-full h-full overflow-auto p-2">
      {avaliacoes.map((avaliacao) => (
        <div
          key={avaliacao.evaluationId}
          className={` p-4 mb-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300
          ${
            avaliacao.status === "Pendente"
              ? "bg-white"
              : avaliacao.status === "Aprovado"
              ? "bg-green-900"
              : avaliacao.status === "Reprovado"
              ? "bg-red-500"
              : "bg-yellow-500"
          }
          active:scale-95
          transition duration-300 
          ease-in-out
          shadow-md active:shadow-lg
          cursor-pointer select-none
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
