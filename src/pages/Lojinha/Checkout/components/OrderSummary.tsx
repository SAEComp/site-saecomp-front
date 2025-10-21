import React from 'react';
import { getProductImageUrl } from '../../utils/imageUtils';
import { CartItem } from '../../types';
import profileIcon from '../../../../assets/lojinha-icons/perrys/profile.png';

// Resumo do pedido
interface OrderSummaryProps {
    items: CartItem[];
    totalAmount: number;
    customerName: string;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ items, totalAmount, customerName }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h2>
        
        {/* Customer info */}
        <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <img 
                src={profileIcon} 
                alt="Cliente" 
                className="w-8 h-8 object-contain"
            />
            <div>
                <p className="text-sm text-gray-600">Cliente</p>
                <p className="font-medium text-gray-900">{customerName}</p>
            </div>
        </div>
        
        {/* Items */}
        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
            {items.map((item) => (
                <div key={item._id} className="flex items-center space-x-3">
                    <img 
                        src={getProductImageUrl(item)} 
                        alt={item.name} 
                        className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-500">
                            {item.quantity}x R$ {item.price.toFixed(2)}
                        </p>
                    </div>
                    <p className="font-medium text-gray-900 text-sm">
                        R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                </div>
            ))}
        </div>
        
        {/* Total */}
        <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between text-lg font-semibold text-gray-900">
                <span>Total</span>
                <span>R$ {totalAmount.toFixed(2)}</span>
            </div>
        </div>
    </div>
);