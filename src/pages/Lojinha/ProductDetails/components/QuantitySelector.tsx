import React from 'react';

// Seletor de quantidade
interface QuantitySelectorProps {
    quantity: number;
    maxQuantity: number;
    onQuantityChange: (quantity: number) => void;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({ 
    quantity, 
    maxQuantity, 
    onQuantityChange 
}) => (
    <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
            Quantidade:
        </label>
        <div className="flex items-center space-x-3 justify-center md:justify-start">
            <button 
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
            </button>
            <input
                id="quantity"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                min="1"
                max={maxQuantity}
                value={quantity}
                onChange={(e) => onQuantityChange(Math.min(maxQuantity, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-20 h-10 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03B04B] focus:border-[#03B04B]"
            />
            <button 
                onClick={() => onQuantityChange(Math.min(maxQuantity, quantity + 1))}
                disabled={quantity >= maxQuantity}
                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </button>
        </div>
    </div>
);