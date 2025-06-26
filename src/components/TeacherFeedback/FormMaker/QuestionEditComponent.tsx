import useQuestionEdit, { IQuestionEdit } from "./useQuestionEdit";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import QuestionEditInput from "./QuestionEditInput";
import TextInput from "../../Inputs/TextInput";
import questionTypes from "../../../types/questionTypes";
import DropDown from "../../Inputs/DropDown";
import { Question } from "../../../schemas/adminQuestions.schema";

interface IQuestionEditComponent {
    question: IQuestionEdit;
    reducer: ReturnType<typeof useQuestionEdit>;
}

const options = questionTypes.map( (t,j) => ({
    id: j,
    label: t
}))

const QuestionEditComponent = ({ question, reducer }: IQuestionEditComponent) => {
    return (
        <div
            className="bg-[#F1F1F1] rounded-3xl flex flex-col"
        >

            <div
                className="flex flex-row items-center px-3 gap-2 mt-4"
            >

                <div
                    className="flex flex-col"
                >
                    <button
                        onClick={() => { }}
                        className="group"
                    >
                        <KeyboardDoubleArrowUpIcon
                            className="group-hover:-translate-y-1 transition-transform duration-300 ease-in-out"
                        />
                    </button>
                    <button
                        onClick={() => { }}
                        className="group"
                    >
                        <KeyboardDoubleArrowDownIcon 
                        className="group-hover:translate-y-1 transition-transform duration-300 ease-in-out"
                        />
                    </button>
                </div>


                {/* <DropDown
                    options={questionOptions}
                    placeholder={"lael"}
                    value={null}
                    onChange={() => { }
                    }
                    /> */}
                {!question.editing ? (
                <div
                className="text-wrap flex-grow"
                >
                    {question.question}
                </div>
                ) : (
                <div
                className="flex flex-grow justify-center"
                >
                    <DropDown
                    className="h-8 w-40"
                    options={options}
                    searchable={false}
                    clearable={false}
                    value={options.find(o => (o.label===question.type)) ?? null}
                    onChange={(newValue) => reducer.setQuestionType(question.id,newValue!.label as Question['type'])}
                    />
                </div>
                )}

                <button
                    onClick={() => { reducer.setQuestionEditing(question.id, !question.editing) }}
                >
                    {question.editing ? (<CheckIcon />) : (<EditIcon />)}
                </button>
            </div>

            {question.editing ? (
                <div
                    className="bg-[#F1F1F1] rounded-3xl flex flex-col gap-5 p-4"
                >
                    <TextInput
                        label="Sua pergunta..."
                        value={question.question}
                        multiline={true}
                        rows={4}
                        onChange={(e) => { reducer.setQuestionText(question.id, e) }}
                    />
                </div>
            ) : (
                <div
                className="gap-5 p-4"
                >
                    <QuestionEditInput
                    q={question}
                    />
                </div>)}
                


            <div
                className="flex flex-row justify-between px-3 pb-4 pt-1 border-t-2"
            >

                <button
                    onClick={() => { }}
                >
                    Pergunta obrigatória {question.required ? "( O )" : "(   )"}
                </button>

                <button
                    onClick={() => { }}
                >
                    <ContentCopyIcon />
                </button>

                <button
                    onClick={() => { }}
                >
                    <DeleteForeverIcon />
                </button>



            </div>



        </div>
    )
}

export default QuestionEditComponent;