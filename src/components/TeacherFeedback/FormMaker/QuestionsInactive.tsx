import useQuestionEdit from "./useQuestionEdit"
import QuestionEditInput from "./QuestionEditInput"
import Mark from "./Mark"

interface IQuestionsInactive {
    reducer: ReturnType<typeof useQuestionEdit>
}

const QuestionsInactive = ({reducer}:IQuestionsInactive) => {
    return(
        <div
            className="flex flex-col gap-5"
        >
            {reducer.state.questions.map( (question,j) => (

                <div
                key={j}
                >
                    {!question.active && (<div
                        className="bg-[#F1F1F1] rounded-3xl flex flex-col"
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

                        <div
                        className="flex-grow"
                        >
                            <div
                                className="flex flex-row items-center px-5 pb-4 pt-1"
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
                    </div>)}

                </div>
            ))}
        </div>
    )
}

export default QuestionsInactive;