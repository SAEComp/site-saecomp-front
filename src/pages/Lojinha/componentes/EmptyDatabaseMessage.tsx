import React from 'react';

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
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
                <div className="text-6xl">⚠️</div>
                <h3 className="text-xl font-semibold text-yellow-900">
                    Banco de Dados Vazio
                </h3>
                <p className="text-yellow-700 max-w-md">
                    Não é possível acessar a aba de <strong>{featureName}</strong> porque não há produtos cadastrados no banco de dados.
                </p>
                <p className="text-yellow-600 text-sm">
                    Por favor, cadastre produtos na aba <strong>Produtos</strong> para acessar esta funcionalidade.
                </p>
                <div className="mt-4 p-4 bg-yellow-100 rounded-md">
                    <p className="text-sm text-yellow-800">
                        💡 <strong>Dica:</strong> Vá para a aba "Produtos" e adicione itens ao catálogo da lojinha.
                    </p>
                </div>
            </div>
        </div>
    );
};
