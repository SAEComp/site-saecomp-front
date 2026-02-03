import React from 'react';
import { Product } from '../../types';
import { getProductImageUrl } from '../../utils/imageUtils';

interface OrderSummaryProps {
    cartItems: any[];
    products: Product[];
    totalAmount: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cartItems, products, totalAmount }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo do Pedido</h2>
            <div className="space-y-4">
                {cartItems.map((item, index) => {
                    const isCartItem = 'productId' in item;
                    const product = isCartItem ? products.find(p => p.id === item.productId) : null;
                    const displayName = item.productName;
                    
                    return (
                        <div key={item.id || index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                            <img 
                                src={product ? getProductImageUrl(product) : `https://via.placeholder.com/64x64/e0e0e0/666666?text=${encodeURIComponent(displayName)}`}
                                alt={displayName}
                                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900">{displayName}</h3>
                                <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                                <p className="text-sm text-gray-600">Preço unitário: R$ {item.value.toFixed(2)}</p>
                                <p className="font-medium text-gray-900">
                                    Subtotal: R$ {(item.value * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-green-600">R$ {totalAmount.toFixed(2)}</span>
                </div>
                
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Pontuação da compra:</span>
                        <span className="text-base font-bold text-[#03B04B]">
                            +{Math.floor(totalAmount * 100).toLocaleString('pt-BR')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
