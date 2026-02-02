import React from 'react';

interface ProductFiltersProps {
    filter: 'all' | 'doces' | 'salgados' | 'bebidas';
    onFilterChange: (filter: 'all' | 'doces' | 'salgados' | 'bebidas') => void;
    onCreateProduct: () => void;
    totalProducts: number;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
    filter,
    onFilterChange,
    onCreateProduct,
    totalProducts
}) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
                <h2 className="text-xl font-semibold text-gray-900">Gerenciar Produtos</h2>
                <p className="text-sm text-gray-600 mt-1">
                    {totalProducts} produto{totalProducts !== 1 ? 's' : ''} encontrado{totalProducts !== 1 ? 's' : ''}
                </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <select
                    value={filter}
                    onChange={(e) => onFilterChange(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03B04B] focus:border-[#03B04B]"
                >
                    <option value="all">Todas as categorias</option>
                    <option value="doces">Doces</option>
                    <option value="salgados">Salgados</option>
                    <option value="bebidas">Bebidas</option>
                </select>
                
                <button
                    onClick={onCreateProduct}
                    className="px-4 py-2 bg-[#03B04B] text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                >
                    <span>+</span>
                    <span>Novo Produto</span>
                </button>
            </div>
        </div>
    );
};

export default ProductFilters;
