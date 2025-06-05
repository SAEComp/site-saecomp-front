import { avaliacoes } from "./mock";

const ReviewList = () => {
  return (
    <div className="flex flex-col  w-full h-full overflow-auto p-2">
      {avaliacoes.map((avaliacao) => (
        <div
          key={avaliacao.evaluationId}
          className={` p-4 mb-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300
          ${
              avaliacao.status === "Pendente" ? "bg-white" : avaliacao.status === "Aprovado" ? "bg-green-900" :
              avaliacao.status === "Reprovado" ? "bg-red-500" : "bg-yellow-500"
            }
          `}>
          <h3 className="text-lg font-semibold">{avaliacao.teacherName}</h3>
          <p className="text-sm text-gray-600">{avaliacao.courseName}</p>
          <p className="text-sm text-gray-500">{avaliacao.courseCode}</p>
          <p className="text-sm text-gray-500">Status: {avaliacao.status}</p>
          <p className="text-sm text-gray-500">
            Semestre: {avaliacao.semester}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
