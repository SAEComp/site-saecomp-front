import React from 'react';

const NextSteps: React.FC = () => {
    return (
        <div className="bg-green-50 border border-green-500 rounded-lg p-4 mb-4 text-left">
            <div className="flex items-center mb-2">
                <p className="font-medium text-gray-900">Próximos Passos</p>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
                <p>• Você pode retirar seu pedido na lojinha SAEComp</p>
                <p>• Aguarde a confirmação do pagamento</p>
            </div>
        </div>
    );
};

export default NextSteps;