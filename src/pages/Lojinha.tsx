import { Link } from "react-router";
import { useAuth } from "../auth/AuthContext";

const Lojinha = () => {
    const { user } = useAuth();
    
    const handleGoToStore = () => {
        // URL da lojinha hospedada (você pode ajustar conforme necessário)
        window.open('https://lojinha-saecomp.netlify.app', '_blank');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Lojinha SAEComp
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Bem-vindo à nossa loja virtual! Aqui você encontra doces, salgados e bebidas 
                        para tornar seus estudos ainda mais saborosos.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            O que você encontra na nossa lojinha:
                        </h2>
                        <ul className="space-y-3">
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 mr-2">🍪</span>
                                Doces variados para adoçar seu dia
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 mr-2">🥪</span>
                                Salgados frescos e deliciosos
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 mr-2">🥤</span>
                                Bebidas refrescantes
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-green-500 mr-2">💰</span>
                                Preços especiais para estudantes
                            </li>
                        </ul>
                        
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <span className="text-yellow-400">ℹ️</span>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        <strong>Horário de funcionamento:</strong> Durante o período letivo, 
                                        conforme disponibilidade dos membros da SAEComp.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Faça seu pedido agora!
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Acesse nossa loja virtual e faça seu pedido de forma prática e rápida.
                            </p>
                            <button
                                onClick={handleGoToStore}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105 mb-4"
                            >
                                Acessar Lojinha Externa
                            </button>
                            
                            <Link 
                                to="/lojinha/loja"
                                className="block bg-[#03B04B] hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105"
                            >
                                🛒 Loja Integrada
                            </Link>
                            
                            {user?.permissions?.includes('users:edit') && (
                                <Link 
                                    to="/lojinha/admin"
                                    className="block mt-4 bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                                >
                                    ⚙️ Gerenciar Lojinha
                                </Link>
                            )}
                            
                            <p className="text-sm text-gray-500 mt-4">
                                Escolha entre a loja externa ou nossa nova loja integrada
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-16 bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                        Como funciona?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="bg-[#03B04B] text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                                1
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">Escolha seus produtos</h3>
                            <p className="text-gray-600 text-sm">
                                Navegue pelo catálogo e adicione os itens desejados ao carrinho
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-[#03B04B] text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                                2
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">Finalize o pedido</h3>
                            <p className="text-gray-600 text-sm">
                                Confirme seus dados e finalize a compra
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-[#03B04B] text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                                3
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">Retire na SAEComp</h3>
                            <p className="text-gray-600 text-sm">
                                Retire seu pedido na sala da SAEComp conforme agendado
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Lojinha;
