import React from 'react';
import { Product } from '../../../types';
import { getProductImageUrl } from '../../../utils/imageUtils';

interface ProductMobileCardProps {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
    formatCurrency: (value: number) => string;
    getCategoryLabel: (category: string) => string;
    getCategoryColor: (category: string) => string;
}

const ProductMobileCard: React.FC<ProductMobileCardProps> = ({
    product,
    onEdit,
    onDelete,
    formatCurrency,
    getCategoryLabel,
    getCategoryColor
}) => {
    return (
        <div className="p-4">
            <div className="flex items-start gap-3 mb-3">
                <img 
                    className="h-16 w-16 rounded-lg object-cover flex-shrink-0" 
                    src={getProductImageUrl(product)} 
                    alt={product.name}
                />
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                        {product.description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-medium ${getCategoryColor(product.category)}`}>
                            {getCategoryLabel(product.category)}
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                            product.isActive 
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                        }`}>
                            {product.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                    <span className="text-gray-500 text-xs">Preço:</span>
                    <div className="font-medium text-gray-900">
                        {formatCurrency(product.value)}
                    </div>
                </div>
                <div>
                    <span className="text-gray-500 text-xs">Estoque:</span>
                    <div className={`font-medium ${
                        product.quantity > 10 
                            ? 'text-[#03B04B]'
                            : product.quantity > 0
                            ? 'text-orange-600'
                            : 'text-red-600'
                    }`}>
                        {product.quantity} un.
                    </div>
                </div>
            </div>
            <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                    onClick={() => onEdit(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 px-3 py-2 rounded-lg transition-colors"
                    title="Editar produto"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                </button>
                <button
                    onClick={() => onDelete(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                    title="Excluir produto"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Excluir
                </button>
            </div>
        </div>
    );
};

export default ProductMobileCard;
