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
import Mark from "./Mark";

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
                        onClick={() => { reducer.moveQuestionUp(question.id) }}
                        className="group"
                    >
                        <KeyboardDoubleArrowUpIcon
                            className="group-hover:-translate-y-1 transition-transform duration-300 ease-in-out"
                        />
                    </button>
                    <button
                        onClick={() => { reducer.moveQuestionDown(question.id) }}
                        className="group"
                    >
                        <KeyboardDoubleArrowDownIcon 
                        className="group-hover:translate-y-1 transition-transform duration-300 ease-in-out"
                        />
                    </button>
                </div>

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
                    {question.editing ? (
                        <CheckIcon 
                        className="fill text-3xl hover:text-[#03B04B]"
                        />) : (
                        <EditIcon 
                        className="fill hover:text-[#03B04B]"
                        />)}
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
                className="flex md:flex-row flex-col justify-between px-5 pb-4 pt-1 border-t-2"
            >
                
                <div
                    className="flex flex-row gap-5 justify-between md:justify-start"
                >
                    <div
                        className="flex flex-row items-center"
                    >

                        <div>
                            Pergunta Obrigatória
                        </div>

                        <button
                            onClick={() => { reducer.setQuestionRequired(question.id, !question.required) }}
                        >
                            <Mark
                                marked={!question.required}
                            />
                        </button>

                    </div>

                    <div
                        className="flex flex-row items-center"
                    >

                        <div>
                            Pergunta Desativada
                        </div>

                        <button
                            onClick={() => { reducer.setQuestionActive(question.id, !question.active) }}
                        >
                            <Mark
                                marked={!question.active}
                            />
                        </button>

                    </div>

                </div>

                <div
                className="flex flex-row gap-10 pt-4 md:pt-0 md:justify-start justify-between md:border-l-2 px-5 md:pr-0 md:pl-5"
                >
                    <button
                        onClick={() => { reducer.copyQuestion(question.id) }}
                    >
                        <ContentCopyIcon
                            className="fill text-2xl hover:text-[#03B04B]"
                        />
                    </button>

                    <button
                        onClick={() => { reducer.deleteQuestion(question.id) }}
                    >
                        <DeleteForeverIcon
                            className="fill text-2xl hover:text-red-600"
                        />
                    </button>
                </div>

            </div>

        </div>
    )
}

export default QuestionEditComponent;