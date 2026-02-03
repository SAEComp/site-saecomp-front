import React from 'react';
import { getProductImageUrl } from '../../utils/imageUtils';
import { CartItem as CartItemType } from '../../types';

// Item individual do carrinho
interface CartItemProps {
    item: CartItemType;
    onQuantityChange: (productId: number, quantity: number) => void;
    onRemove: (productId: number) => void;
}

const CartItemComponent: React.FC<CartItemProps> = ({ item, onQuantityChange, onRemove }) => {
    // Converte CartItem para o formato Product para usar com getProductImageUrl
    const productData = {
        imgUrl: null,
        name: item.productName
    };
    
    return (
        <div className="p-6 flex items-center space-x-4">
            <img 
                src={getProductImageUrl(productData)} 
                alt={item.productName} 
                className="w-16 h-16 object-cover rounded-lg"
            />
            
            <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.productName}</h3>
                <p className="text-lg font-semibold text-green-600 mt-2">
                    R$ {item.value.toFixed(2)}
                </p>
            </div>
            
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onQuantityChange(item.productId, item.quantity - 1)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
            >
                -
            </button>
            
            <span className="font-medium text-gray-900 w-8 text-center">
                {item.quantity}
            </span>
            
            <button
                onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
                disabled={item.quantity >= item.productStock}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
                +
            </button>
        </div>
        
        <div className="text-right">
            <p className="font-semibold text-gray-900">
                R$ {(item.value * item.quantity).toFixed(2)}
            </p>
            <button
                onClick={() => onRemove(item.productId)}
                className="text-red-600 hover:text-red-800 text-sm mt-1"
            >
                Remover
            </button>
        </div>
    </div>
);
};

export default CartItemComponent;