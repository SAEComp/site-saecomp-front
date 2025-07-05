import { useState, useEffect } from "react";
import { Modal } from "@mui/material";
import useQuestionEdit, { IQuestionEdit } from "./useQuestionEdit";
import ModifiedQuestion from "./ModifiedQuestion";
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { adminQuestionsService } from "../../../services/adminQuestions.service";



interface ISaveEdit {
    reducer: ReturnType<typeof useQuestionEdit>
    original: IQuestionEdit[]
    save: boolean
    setSave: React.Dispatch<React.SetStateAction<boolean>>
}

export interface IQuestionService {
    question: IQuestionEdit,
    method: 'Post'|'Put'|'Delete'
}

const SaveEdit = ({reducer, original, save, setSave}:ISaveEdit ) => {
    const [changedQuestions, setChangedQuestions] = useState<IQuestionService[]>([]);

    const getChangeList = () => {
        const changeList : IQuestionService[] = reducer.state.questions.reduce<IQuestionService[]>((changeList, question) => {
            if(question.id < 0) {
                return([
                    ...changeList,
                    {
                        question: question,
                        method: 'Post'
                }])
            }
            const kuestion = original.find((q) => q.id===question.id);
            if(!kuestion){
                throw new Error('Error loading changes.')
            }
            const modified = Object.entries(question).reduce((acc, cur) => kuestion[cur[0] as keyof IQuestionEdit]===cur[1]? acc : acc+1, 0 );
            if(modified>0){
                return([
                    ...changeList,
                    {
                        question: question,
                        method: 'Put'
                }])
            }
            return(changeList);
        }, [])

        const changeList2 : IQuestionService[] = [
            ...changeList,
            ...original.filter( (q) => (
                !reducer.state.questions.find( (l) => q.id===l.id)
                )).map<IQuestionService>( (q) => ({
                    question: q,
                    method: 'Delete'
                }))
        ]

        setChangedQuestions(changeList2);
    }

    useEffect(() => {
        if(save) getChangeList()
        }, [save])

    const saveChangesDB = async () => {

        changedQuestions.map(async (cur) => {
            const {editing, required, ...reducedQ} = cur.question;
            switch (cur.method) {
                case 'Post':
                    const newQuestionId = await adminQuestionsService.postQuestion(reducedQ);
                    if(newQuestionId){
                        reducer.setQuestionId(cur.question.id, newQuestionId);
                    }
                    break;
                case 'Put':
                    await adminQuestionsService.putQuestion(reducedQ);
                    break;
                case 'Delete':
                    const deleted = await adminQuestionsService.deleteQuestion(cur.question.id);
                    if(!deleted){
                        reducer.copyDeletedQuestion(cur.question)
                    }
                    break;
            }
        })
    }

    return(
        <Modal
            open={save}
            className="flex justify-center items-center p-12"
        >

            <div
            className="flex flex-col max-h-[80vh] overflow-auto scrollbarWidth-none bg-white rounded-xl p-5 gap-5"
            style={{scrollbarWidth: "none"}}
            >
                <span
                className="text-2xl font-bold text-center flex-grow px-5"
                >
                    Lista de alterações no formulário:
                </span>

                <div
                className="flex flex-col items-center gap-5 p-5"
                >
                    {
                        changedQuestions.map(question => {
                            return (
                                <ModifiedQuestion
                                question={question.question}
                                method={question.method}
                                />
                            )
                        })
                    }
                </div>

                <div
                className="flex flex-row justify-between px-5 gap-5"
                >
                    <button
                    className="rounded-xl bg-black text-white p-5 "
                    onClick={() => {setSave(false)}}
                    >
                        <KeyboardReturnIcon/>
                    </button>

                    <button
                    className="rounded-xl bg-[#03B04B] text-white p-5 "
                    onClick={() => {saveChangesDB()}}
                    >
                        Salvar
                    </button>
                </div>
            </div>

        </Modal>
    ) 
}

export default SaveEdit;