import React from 'react';

interface OrderDetailsProps {
    orderId: string;
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
        </div>
    );
};

export default OrderDetails;