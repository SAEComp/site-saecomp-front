import { useAuth } from "../../auth/AuthContext";
import { Link } from "react-router";

const Button = ({ to, text, color }: { to: string, text: string, color: 'green' | 'red' }) => {
    const classes = {
        green: 'bg-green-500 hover:bg-green-400 hover:text-green-800',
        red: 'bg-red-500 hover:bg-red-400 hover:text-red-800'
    }

    return (
        <Link to={to} className={"flex justify-center  rounded-xl w-64 py-2 text-white transition-all font-bold hover:-translate-y-1 ease-in-out duration-300 " + classes[color]}>
            {text}
        </Link>
    )
}


const teacherEvaluationMenu = () => {
    const { user } = useAuth();

    return (
        <div className="flex-grow flex w-screen bg-gray-100 justify-center items-center py-10">
            <div className="p-10 shadow flex flex-col justify-center items-center bg-gray-50 rounded-xl gap-2">
                <p className="text-center font-bold select-none mb-2">
                    Escolha a página
                </p>
                {user?.permissions.includes('evaluation:create') && (<Button 
                    to="./avaliacao"
                    text="Avaliação"
                    color="green"
                />)}
                {user?.permissions.includes('evaluation:results') && (<Button 
                    to="./resultados"
                    text="Resultados"
                    color="green"
                />)}
                {user?.permissions.includes('evaluation:edit') && (<Button 
                    to="./admin/questoes"
                    text="Questões"
                    color="red"
                />)}
                {user?.permissions.includes('evaluation:review') && (<Button 
                    to="./admin/resultados"
                    text="Resultados"
                    color="red"
                />)}
            </div>
        </div>
    )

}

export default teacherEvaluationMenu;