import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Product } from '../../../types';
import { ITableColumn } from '../../../../../components/Inputs';
import { getProductImageUrl } from '../../../utils/imageUtils';

interface ProductTableColumnsProps {
    onEditProduct: (product: Product) => void;
    onDeleteProduct: (product: Product) => void;
    formatCurrency: (value: number) => string;
    getCategoryLabel: (category: string) => string;
    getCategoryColor: (category: string) => string;
}

export const useProductTableColumns = ({
    onEditProduct,
    onDeleteProduct,
    formatCurrency,
    getCategoryLabel,
    getCategoryColor
}: ProductTableColumnsProps): ITableColumn<Product>[] => {
    return [
        {
            key: 'product',
            title: 'Produto',
            render: (_, product) => (
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                        <img 
                            className="h-12 w-12 rounded-lg object-cover" 
                            src={getProductImageUrl(product)} 
                            alt={product.name}
                        />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                            {product.name}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                            {product.description}
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'category',
            title: 'Categoria',
            render: (_, product) => (
                <span className={`text-sm font-medium ${getCategoryColor(product.category)}`}>
                    {getCategoryLabel(product.category)}
                </span>
            )
        },
        {
            key: 'price',
            title: 'Preço',
            render: (_, product) => (
                <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(product.value)}
                </span>
            )
        },
        {
            key: 'stock',
            title: 'Estoque',
            render: (_, product) => (
                <span className={`text-sm font-medium ${
                    product.quantity > 10 
                        ? 'text-[#03B04B]'
                        : product.quantity > 0
                        ? 'text-orange-600'
                        : 'text-red-600'
                }`}>
                    {product.quantity} unidades
                </span>
            )
        },
        {
            key: 'status',
            title: 'Status',
            render: (_, product) => (
                <span className={`text-sm font-medium ${
                    product.isActive 
                        ? 'text-[#03B04B]'
                        : 'text-red-600'
                }`}>
                    {product.isActive ? 'Ativo' : 'Inativo'}
                </span>
            )
        },
        {
            key: 'actions',
            title: 'Ações',
            align: 'right',
            render: (_, product) => (
                <div className="flex items-center justify-end space-x-2">
                    <button
                        onClick={() => onEditProduct(product)}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                        title="Editar produto"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => onDeleteProduct(product)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir produto"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            )
        }
    ];
};
