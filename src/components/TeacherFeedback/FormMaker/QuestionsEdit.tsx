import { useEffect } from "react";
import { adminQuestionsService } from "../../../services/adminQuestions.service";
import useQuestionEdit from "./useQuestionEdit";
import QuestionEditComponent from "./QuestionEditComponent";
import AddIcon from '@mui/icons-material/Add';

interface IQuestionsEdit {
    reducer: ReturnType<typeof useQuestionEdit>
}

const QuestionsEdit = ({reducer}: IQuestionsEdit) => {
        return (
            <div
                className="flex flex-col gap-5"
            >
                <div
                    className="flex flex-col gap-5"
                >
                    {reducer.state.questions.map((question, i) => (
                        question.active&& (<QuestionEditComponent
                        question={question}
                        reducer={reducer}
                        />)
                    ))}
                </div>

                <button
                    className="align-self-center flex justify-center align-center bg-white rounded-xl box-border border-8 my-10 w-20 h-20"
                    onClick={() => { reducer.addQuestion() }}
                >
                    <text
                        className="box-border -mt-1 font-bold text-center text-6xl align-top"
                    >
                        <AddIcon/>
                    </text>
                </button>
            </div>
        )
    };

    export default QuestionsEdit;