import { status, answer2 } from "./mock";
import QuestionComponent from "../TeacherFeedback/Form/QuestionComponent";
import TextInput from "../Inputs/TextInput";
import SaveIcon from "@mui/icons-material/Save";
import ReplayIcon from "@mui/icons-material/Replay";
import UndoIcon from "@mui/icons-material/Undo";

const CardEdition = () => {
  return (
    <div>
      <div className="flex flex-col gap-4 p-3 w-full h-full bg-gray-500 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-black">
          Edição de Avaliação
        </h2>

        <div className="flex flex-col md:flex-row w-full justify-around gap-4 ">
          <select className="p-2 rounded bg-gray-800 text-white w-full md:w-[50%]">
            {status.map((s) => (
              <option key={s.id} value={s.label}>
                {s.label}
              </option>
            ))}
          </select>

          <div className=" relative group inline-block w-full md:w-[15%] ">
            <button
              data-ripple-light="true"
              data-tooltip-target="tooltip"
              className="active:scale-95 transition duration-150 ease-in-out shadow-md active:shadow-lg w-full  bg-black text-center flex items-center justify-center h-12 rounded-md">
              <ReplayIcon htmlColor="white" />
            </button>
            <div className=" absolute z-10 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-700 text-white text-xs rounded-lg p-2">
              Recarrega a avaliação original do aluno
            </div>
          </div>

          <div className="relative group inline-block w-full md:w-[15%] ">
            <button
              data-ripple-light="true"
              data-tooltip-target="tooltip"
              className="active:scale-95 transition duration-150 ease-in-out shadow-md active:shadow-lg w-full  bg-black text-center flex items-center justify-center h-12 rounded-md">
              <UndoIcon htmlColor="white" />
            </button>
            <div className=" absolute z-10 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-700 text-white text-xs rounded-lg p-2">
              Recarrega a avaliação editada do aluno
            </div>
          </div>
          <div className=" relative group inline-block w-full md:w-[15%] ">
            <button
              data-ripple-light="true"
              data-tooltip-target="tooltip"
              className="active:scale-95 transition duration-150 ease-in-out shadow-md active:shadow-lg w-full  bg-black text-center flex items-center justify-center h-12 rounded-md">
              <SaveIcon htmlColor="white" />
            </button>
            <div className="  absolute z-10 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-700 text-white text-xs rounded-lg p-2">
              Salvar avaliação editada
            </div>
          </div>
        </div>

        {answer2.answers.map((question) => (
          <div>
            <QuestionComponent
              label={question.question}
              component={TextInput}
              componentProps={{
                multiline: true,
                rows: 4,
                label: "Sua resposta",
                value: question.answer,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardEdition;
