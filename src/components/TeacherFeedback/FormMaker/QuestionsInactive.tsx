import useQuestionEdit from "./useQuestionEdit"
import QuestionEditInput from "./QuestionEditInput"

interface IQuestionsInactive {
    reducer: ReturnType<typeof useQuestionEdit>
}

const QuestionsInactive = ({reducer}:IQuestionsInactive) => {
    return(
        <div
        className="flex flex-col gap-5"
        >
            {reducer.state.questions.map( question => (

                <div>
                    {!question.active && (<div
                        className="bg-[#F1F1F1] rounded-3xl flex flex-col"
                    >
                        <div
                            className="pl-10 pt-4 text-wrap flex-grow"
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

                        <button
                        className="flex-grow self-center pb-4 pt-1"
                        onClick={() => (reducer.setQuestionActive(question.id, !question.active))}
                        >
                            Ativar
                        </button>
                    </div>)}

                </div>
            ))}
        </div>
    )
}

export default QuestionsInactive;