import React from 'react';
import { ProductCard } from '../../componentes';
import { Product } from '../../types';

// Grid de produtos
interface ProductGridProps {
    products: Product[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {products.map(product => (
            <ProductCard key={product.id} product={product} />
        ))}
    </div>
);