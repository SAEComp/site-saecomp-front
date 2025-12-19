import React from 'react';
import { Product } from '../../types';
import { StockIndicator } from '../../componentes';

// Informações básicas do produto
interface ProductInfoProps {
    product: Product;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => (
    <div className="mb-3 md:mb-8">
        <div className="mb-2 md:mb-4">
            <h1 className="text-lg md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">{product.name}</h1>
            <p className="text-xs md:text-sm text-[#03B04B] font-medium uppercase tracking-wider">
                {product.category}
            </p>
        </div>
        
        <p className="text-sm md:text-base text-gray-700 mb-3 md:mb-6 leading-relaxed">
            {product.description}
        </p>
        
        <div className="text-xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-6">
            R$ {product.value.toFixed(2)}
        </div>
        
        <StockIndicator stock={product.quantity} showWarning={true} />
    </div>
);