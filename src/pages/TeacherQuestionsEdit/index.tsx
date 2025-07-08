import FormMaker from "../../components/TeacherFeedback/FormMaker/FormMaker";


const TeacherQuestionsEdit = () =>{
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
                        Nesta página você pode definir que perguntas estarão presentes no formulário de Avalição dos Professores. As perguntas aparecerão no tipo e ordem apresentadas e você pode marcar-la como obrigatória. Também e possível ativar e desativar perguntas. Perguntas desativadas não estarão no formulário e também não serão contabilizadas para os resultados das avaliações.
                        <br/>
                        Após realizar suas alterações no formulário, você pode descartá-las, retornando o formulário para a última versão salva, ou salvá-las, em que serão apresentadas um sumário das alterações antes de confirmar as mudanças.
                    </span>
                </div>
                <FormMaker/>
            </div>
        </div>
    )
}

export default TeacherQuestionsEdit;