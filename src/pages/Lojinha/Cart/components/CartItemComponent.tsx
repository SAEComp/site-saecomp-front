import React from 'react';
import { getProductImageUrl } from '../../utils/imageUtils';
import { CartItem as CartItemType } from '../../types';

// Item individual do carrinho
interface CartItemProps {
    item: CartItemType;
    onQuantityChange: (productId: string, quantity: number) => void;
    onRemove: (productId: string) => void;
}

const CartItemComponent: React.FC<CartItemProps> = ({ item, onQuantityChange, onRemove }) => (
    <div className="p-6 flex items-center space-x-4">
        <img 
            src={getProductImageUrl(item)} 
            alt={item.name} 
            className="w-16 h-16 object-cover rounded-lg"
        />
        
        <div className="flex-1">
            <h3 className="font-medium text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
            <p className="text-lg font-semibold text-green-600 mt-2">
                R$ {item.price.toFixed(2)}
            </p>
        </div>
        
        <div className="flex items-center space-x-2">
            <button
                onClick={() => onQuantityChange(item._id, item.quantity - 1)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
            >
                -
            </button>
            
            <span className="font-medium text-gray-900 w-8 text-center">
                {item.quantity}
            </span>
            
            <button
                onClick={() => onQuantityChange(item._id, item.quantity + 1)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
            >
                +
            </button>
        </div>
        
        <div className="text-right">
            <p className="font-semibold text-gray-900">
                R$ {(item.price * item.quantity).toFixed(2)}
            </p>
            <button
                onClick={() => onRemove(item._id)}
                className="text-red-600 hover:text-red-800 text-sm mt-1"
            >
                Remover
            </button>
        </div>
    </div>
);

export default CartItemComponent;