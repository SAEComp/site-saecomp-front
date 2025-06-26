import QuestionsEdit from "./QuestionsEdit";


const FormMaker = () => {

    return (
        <div
            className="flex flex-col justify-center items-center gap-10 w-full bg-[#03B04B] py-8 sm:px-8 md:px-10 px-2"

        >
            <div
                className="flex flex-col justify-center items-center w-full gap-4 md:flex-row md:gap-[10%]"
            >
                <span
                    className="font-inter text-white"
                >
                    Quantas disciplinas você cursou esse semestre?
                </span>

            </div>
            <div
                className="flex flex-col bg-white w-full rounded-xl p-5 md:p-12 gap-5 relative"
            >
                <QuestionsEdit />
            </div>
        </div>
    )
}

export default FormMaker;