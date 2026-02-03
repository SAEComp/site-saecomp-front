import React from 'react';
import { Link } from 'react-router';
import tristeIcon from '../../../assets/lojinha-icons/perrys/triste.png';

interface EmptyDatabaseMessageProps {
    allowedFeature?: boolean;
    featureName: string;
}

export const EmptyDatabaseMessage: React.FC<EmptyDatabaseMessageProps> = ({ 
    allowedFeature = false,
    featureName 
}) => {
    if (allowedFeature) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <img 
                        src={tristeIcon} 
                        alt="Perry triste" 
                        className="w-28 h-28 md:w-32 md:h-32 mx-auto mb-4 object-contain drop-shadow-lg"
                    />
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                        Nenhum produto cadastrado
                    </h2>
                    <p className="text-gray-600 mb-6">
                        A aba de <strong>{featureName}</strong> só ficará disponível após adicionar produtos ao catálogo.
                    </p>
                    <Link 
                        to="/lojinha/admin" 
                        className="inline-block bg-[#03B04B] hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                    >
                        Ir para Produtos
                    </Link>
                </div>
            </div>
        </div>
    );
};
