import FormMaker from "../../components/TeacherFeedback/FormMaker/FormMaker";


const FeedbackEdit = () =>{
    return(
        <div
            className="w-screen font-inter"
        >
            <div
                className="pt-1"
            >
                <div
                className="flex flex-col gap-2 px-[5%] my-5"
                >
                    <span
                        className="text-3xl font-semibold font-inter"
                    >
                        Edição do Formulário de Avaliação de Professores
                    </span>
                    <span
                    className="text-base font-light text-[#828282] font-inter"
                    >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse auctor nulla non lectus ullamcorper malesuada. Aenean suscipit, tellus ac malesuada rutrum, nulla ipsum elementum mauris, nec aliquam lorem dolor sit amet erat. In at consequat metus. Aenean nisi arcu, condimentum tristique lacinia ac, sollicitudin id libero. Duis euismod risus at lorem feugiat fringilla. Vivamus aliquam sit amet velit auctor tempus. Quisque aliquet elit mauris, sit amet condimentum dui porta at. Pellentesque rutrum orci tortor, non porttitor nunc tincidunt ut.
                    </span>
                </div>
                <FormMaker/>
            </div>
        </div>
    )
}

export default FeedbackEdit;