import React from 'react';
import { Product } from '../../types';
import { getProductImageUrl } from '../../utils/imageUtils';

// Imagem do produto
interface ProductImageProps {
    product: Product;
}

export const ProductImage: React.FC<ProductImageProps> = ({ product }) => (
    <div className="w-full lg:w-1/2">
        <div className="aspect-[5/3] md:aspect-square bg-gray-50 p-1 md:p-8 flex items-center justify-center">
            <img 
                src={getProductImageUrl(product)} 
                alt={`Imagem do produto ${product.name}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-md"
            />
        </div>
    </div>
);