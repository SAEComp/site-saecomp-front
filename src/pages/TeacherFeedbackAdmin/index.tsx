import FeedbackEdition from "../../components/TeacherFeedbackAdmin/FeedbackEdition";

const TeacherFeedbackAdmin = () => {
  return (
    <div className=" w-screen font-inter">
      <div className="pt-1">
        <div className="flex flex-col gap-2 px-[5%] my-5">
          <span className="text-3xl font-semibold font-inter">
            Revisão da avaliação de professores
          </span>
          <span className="text-base font-light text-[#828282] font-inter">
            Todo semestre, a SAEComp realiza a Avaliação de Professores, com o
            intuito de fiscalizar e fomentar uma maior comunicação dos discentes
            com a coordenação e a Secretaria. Para isso, avalie os professores e
            exponha pontos positivos e negativos de conviver com o professor na
            sala de aula, e dê uma nota final a cada um de 0 a 10. Os
            professores mais bem avaliados receberão um certificado pelo bom
            desempenho. Pegaremos o feedback escrito para dar um repasse para os
            professores.
          </span>
        </div>

        <FeedbackEdition />
      </div>
    </div>
  );
};

export default TeacherFeedbackAdmin;
