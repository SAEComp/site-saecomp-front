import QuestionsEdit from "./QuestionsEdit";
import QuestionsInactive from "./QuestionsInactive";
import { IQuestionEdit } from "./useQuestionEdit";
import { useCallback, useEffect, useRef, useState } from "react";
import useQuestionEdit from "./useQuestionEdit";
import { adminQuestionsService } from "../../../services/adminQuestions.service";
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';
import SaveEdit from "./SaveEdit";


const FormMaker = () => {
    const questionEdit = useQuestionEdit();
    const originalQuestions = useRef<IQuestionEdit[]>([]);
    const [save, setSave] = useState(false);
    
    const setOriginalQuestions = useCallback((questions: IQuestionEdit[]) => {
        originalQuestions.current = questions
    },[])

    const getQuestionsDB = async () => {
        const newQuestList = await adminQuestionsService.getQuestionList();
        if (newQuestList === null) {
            console.log("Lista de Perguntas Vazia");
            return;
        };
        const originalForm = newQuestList.map(q => ({
            ...q,
            editing: false,
        }));
        questionEdit.setQuestionList(originalForm);
        setOriginalQuestions(originalForm);
    }

    useEffect(() => {
        getQuestionsDB().catch(console.error);
    }, [])


    return (
    <>
    <SaveEdit
    reducer={questionEdit}
    original={originalQuestions}
    getQuestionsDB={getQuestionsDB}
    save={save}
    setSave={setSave}
    />

        <div
            className="flex flex-col justify-center items-center gap-10 w-full bg-[#03B04B] py-8 sm:px-8 md:px-10 px-2"

        >

            <div
                className="flex flex-col bg-white w-full rounded-xl  p-5 md:p-12 md:pt-5 gap-5 "
            >

                <div
                    className="flex flex-row justify-between items-center w-full gap-4 px-10"
                >

                    <button
                        onClick={() => { getQuestionsDB() }}
                        className="text-center bg-black text-white rounded-xl p-4 group"
                        title="Restaura o formulário para o salvo."
                    >
                        <RestoreIcon
                            className="text-3xl group-hover:animate-spinOnce"
                        />
                    </button>

                    <button
                        onClick={() => { setSave(!save) }}
                        className="text-center bg-black text-white rounded-xl p-4 group"
                        title="Salvar alterações."
                    >
                        <SaveIcon
                            className="text-3xl group-hover:scale-110 duration-200 transition-transform ease-in-out"
                        />
                    </button>

                </div>

                <QuestionsEdit
                    reducer={questionEdit}
                />

            </div>



            <span
                className="font-inter text-white text-2xl"
            >
                Perguntas Desativadas
            </span>

            <div
                className="flex flex-col bg-white w-full rounded-xl p-5 md:p-12 gap-5 relative"
            >
                <QuestionsInactive
                    reducer={questionEdit}
                />

            </div>



        </div>
    </>
    )
}

export default FormMaker;