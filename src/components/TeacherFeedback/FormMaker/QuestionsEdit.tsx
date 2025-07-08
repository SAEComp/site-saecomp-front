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
                    {reducer.state.questions.map((question, j) => (
                        question.active&& (<QuestionEditComponent
                        key={j}
                        question={question}
                        reducer={reducer}
                        />)
                    ))}
                </div>

                <button
                    className="align-self-center flex justify-center align-center bg-white rounded-xl box-border border-8 my-10 w-20 h-20 group"
                    onClick={() => { reducer.addQuestion() }}
                >
                    <div
                        className="box-border -mt-1 font-bold text-center text-6xl align-top "
                    >
                        <AddIcon
                        className="box-border group-hover:scale-125 transition-transform ease-in-out"
                        />
                    </div>
                </button>
            </div>
        )
    };

    export default QuestionsEdit;