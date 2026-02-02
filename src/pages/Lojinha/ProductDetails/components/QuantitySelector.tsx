import React from 'react';
import NumberInput from '../../../../components/Inputs/NumberInput';

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
        <NumberInput
            label="Quantidade"
            value={quantity}
            onChange={onQuantityChange}
            min={1}
            max={maxQuantity}
            mobile={true}
        />
    </div>
);