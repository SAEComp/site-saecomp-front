import { IQuestionService } from "./SaveEdit";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import QuestionEditInput from "./QuestionEditInput";


const ModifiedQuestion = ({ question, method }: IQuestionService) => {

    const Icon = () => {
        switch (method) {
            case 'Post':
                return (
                    <AddIcon
                        className="fill text-4xl text-[#03B04B]"
                    />
                )
            case 'Put':
                return (
                    <EditIcon
                        className="fill text-4xl text-amber-300"
                    />
                )
            case 'Delete':
                return (
                    <DeleteForeverIcon
                        className="fill text-4xl text-red-600"
                    />
                )
        }
    }

    return (
        <div
            className="flex flex-row items-center w-full gap-5 pr-12"
        >
            <Icon />

            <div
                className={`${method === 'Post' ? 'bg-[#03B04B]' : ''} ${method === 'Put' ? 'bg-amber-300' : ''} ${method === 'Delete' ? 'bg-red-600' : ''} rounded-3xl flex flex-col flex-grow`}
            >
                <div
                    className="pl-5 pt-4 text-wrap flex-grow"
                >
                    {question.question}
                </div>

                <div
                    className="gap-5 p-4"
                >
                    <QuestionEditInput
                        q={question}
                    />
                </div>
            </div>

        </div>
    )
}

export default ModifiedQuestion;