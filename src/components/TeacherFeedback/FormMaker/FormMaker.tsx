import QuestionsEdit from "./QuestionsEdit";
import QuestionsInactive from "./QuestionsInactive";
import { useEffect } from "react";
import useQuestionEdit from "./useQuestionEdit";
import { adminQuestionsService } from "../../../services/adminQuestions.service";

const FormMaker = () => {
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
            className="flex flex-col justify-center items-center gap-10 w-full bg-[#03B04B] py-8 sm:px-8 md:px-10 px-2"

        >
            <div
                className="flex flex-col justify-center items-center w-full gap-4 md:flex-row md:gap-[30%]"
            >

                <button
                onClick={() => {getQuestionsDB()}}
                className="text-center bg-white rounded-xl p-5"
                >
                    Resetar Formulário
                </button>

                <button
                onClick={() => {getQuestionsDB()}}
                className="text-center bg-white rounded-xl p-5"
                >
                    Salvar Formulário
                </button>

            </div>
            <div
                className="flex flex-col bg-white w-full rounded-xl p-5 md:p-12 gap-5 relative"
            >
                <QuestionsEdit
                reducer= {questionEdit}
                />

            </div>

            <span
            className="font-inter text-white"
            >
                Perguntas Desativadas
            </span>

             <div
                className="flex flex-col bg-white w-full rounded-xl p-5 md:p-12 gap-5 relative"
            >
                <QuestionsInactive
                reducer= {questionEdit}
                />

            </div>
        </div>
    )
}

export default FormMaker;