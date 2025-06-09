import { Link } from "react-router";


const Error = () => {
    return (
        <div className="flex w-screen h-screen justify-center items-center bg-gray-100">
            <div className="flex flex-col items-center justify-center gap-4 p-8 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold text-red-600">Erro 404</h1>
                <p className="text-gray-700">Página não encontrada.</p>
                <p className="text-gray-500">A página que você está procurando não existe ou foi movida.</p>
                <Link to="/" className="mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-center">
                    Voltar para a página inicial
                </Link>
            </div>
        </div>
    );
};

export default Error;
