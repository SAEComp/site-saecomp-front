import React from 'react';

interface OrderDetailsProps {
    orderId: string;
    earnedPoints?: number;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId }) => {
    return (
        <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">Detalhes do Pedido</h3>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Número do Pedido:</span>
                    <span className="font-medium">#{orderId}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">Concluído</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Método de Pagamento:</span>
                    <span className="font-medium">PIX</span>
                </div>
            </div>
            
            {/* Pontuação adquirida */}
            {earnedPoints !== undefined && (
                <div className="bg-green-50 rounded-lg p-3 mt-3 border border-green-200">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Pontuação da compra:</span>
                        <span className="text-base font-bold text-[#03B04B]">
                            +{earnedPoints.toLocaleString('pt-BR')}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetails;