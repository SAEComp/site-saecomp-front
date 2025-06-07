import { status, answer1 } from "./mock";
import QuestionComponent from "../TeacherFeedback/Form/QuestionComponent";
import TextInput from "../Inputs/TextInput";
import SaveIcon from "@mui/icons-material/Save";
import ReplayIcon from "@mui/icons-material/Replay";
import UndoIcon from "@mui/icons-material/Undo";

const CardEdition = () => {
  return (
    <div>
      <div className="flex flex-col gap-4 p-3 w-full h-full bg-white rounded-lg shadow-lg">
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

          <div className="active:scale-95 transition duration-150 ease-in-out shadow-md active:shadow-lg w-full md:w-[15%]  bg-black text-center flex items-center justify-center h-12 rounded-md">
            <ReplayIcon htmlColor="white" />
            <span className="mx-2 text-white md:text-sm md:hidden 2xl:inline">
              Recarregar avaliação original
            </span>
          </div>

          <div className="active:scale-95 transition duration-150 ease-in-out shadow-md active:shadow-lg w-full md:w-[15%]  bg-black text-center flex items-center justify-center h-12 rounded-md">
            <UndoIcon htmlColor="white" />
            <span className="mx-2 text-white md:text-sm md:hidden 2xl:inline">
              Recarregar avaliação editada
            </span>
          </div>

          <div className="active:scale-95 transition duration-150 ease-in-out shadow-md active:shadow-lg w-full md:w-[15%]  bg-black text-center flex items-center justify-center h-12 rounded-md">
            <SaveIcon htmlColor="white" />
            <span className="mx-2 text-white md:text-sm md:hidden 2xl:inline">
              Salvar avaliação editada
            </span>
          </div>
        </div>

        {answer1.answers.map((question) => (
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
