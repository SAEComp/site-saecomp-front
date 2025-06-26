import { useEffect } from "react";
import { adminQuestionsService } from "../../../services/adminQuestions.service";
import useQuestionEdit from "./useQuestionEdit";
import QuestionEditComponent from "./QuestionEditComponent";
import AddIcon from '@mui/icons-material/Add';


const QuestionsEdit = () => {
    const questionEdit = useQuestionEdit();

    const getQuestionsDB = async () => {
        const newQuestList = await adminQuestionsService.getQuestionList();
        if (newQuestList === null) {
            console.log("vish");
            return;
        };
        questionEdit.setQuestionList(newQuestList.map(q => ({
            ...q,
            editing: false,
            required: false
        })));
    }

        useEffect(() => {
            getQuestionsDB().catch(console.error);
        }, [])


        return (
            <div
                className="flex flex-col gap-5"
            >
                <div
                    className="flex flex-col gap-5"
                >
                    {questionEdit.state.questions.map((question, i) => (
                        <QuestionEditComponent
                        question={question}
                        reducer={questionEdit}
                        />
                    ))}
                </div>

                <button
                    className="align-self-center flex justify-center align-center bg-white rounded-xl box-border border-8 my-10 w-20 h-20"
                    onClick={() => { }}
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