import React from 'react';
import { Product } from '../../../types';
import { getProductImageUrl } from '../../../utils/imageUtils';
import { Table, ITableColumn } from '../../../../../components/Inputs';

interface TopProductsTablesProps {
    productsWithMoreSoldQuantity: any[];
    productsWithMoreRevenueValue: any[];
    getProductById: (id: number) => Product | undefined;
    formatCurrency: (value: number) => string;
}

const TopProductsTables: React.FC<TopProductsTablesProps> = ({
    productsWithMoreSoldQuantity,
    productsWithMoreRevenueValue,
    getProductById,
    formatCurrency
}) => {
    // Colunas para a tabela de produtos mais vendidos (por quantidade)
    const topSoldProductsColumns: ITableColumn[] = [
        {
            key: 'product',
            title: 'Produto',
            render: (_, item: any) => {
                const product = getProductById(item.id);
                return (
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                            {product ? (
                                <img 
                                    className="h-12 w-12 rounded-lg object-cover" 
                                    src={getProductImageUrl(product)} 
                                    alt={item.name}
                                />
                            ) : (
                                <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">?</span>
                                </div>
                            )}
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                                {item.name}
                            </div>
                        </div>
                    </div>
                );
            }
        },
        {
            key: 'sold',
            title: 'Vendidos',
            render: (_, item: any) => (
                <span className="text-sm font-medium text-gray-900">
                    {item.soldQuantity} unidades
                </span>
            )
        }
    ];

    // Colunas para a tabela de produtos que mais geraram receita
    const topRevenueProductsColumns: ITableColumn[] = [
        {
            key: 'product',
            title: 'Produto',
            render: (_, item: any) => {
                const product = getProductById(item.id);
                return (
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                            {product ? (
                                <img 
                                    className="h-12 w-12 rounded-lg object-cover" 
                                    src={getProductImageUrl(product)} 
                                    alt={item.name}
                                />
                            ) : (
                                <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">?</span>
                                </div>
                            )}
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                                {item.name}
                            </div>
                        </div>
                    </div>
                );
            }
        },
        {
            key: 'revenue',
            title: 'Receita',
            render: (_, item: any) => (
                <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(item.revenueValue)}
                </span>
            )
        }
    ];

    return (
        <div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">Top 4 Produtos</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mais vendidos por quantidade */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Mais Vendidos</h3>
                        <p className="text-sm text-gray-500">Por quantidade de unidades</p>
                    </div>
                    <Table
                        columns={topSoldProductsColumns}
                        data={Array.isArray(productsWithMoreSoldQuantity) ? productsWithMoreSoldQuantity : []}
                        emptyText="Nenhum produto vendido ainda"
                        responsive={true}
                        mobileView={(item, index) => {
                            const product = getProductById(item.id);
                            return (
                                <div className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            {product ? (
                                                <img 
                                                    className="h-10 w-10 rounded-lg object-cover" 
                                                    src={getProductImageUrl(product)} 
                                                    alt={item.name}
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-400 text-xs">?</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        #{index + 1}
                                                    </p>
                                                </div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {item.soldQuantity} un.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }}
                    />
                </div>

                {/* Maiores receitas */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Maiores Receitas</h3>
                        <p className="text-sm text-gray-500">Por valor arrecadado</p>
                    </div>
                    <Table
                        columns={topRevenueProductsColumns}
                        data={Array.isArray(productsWithMoreRevenueValue) ? productsWithMoreRevenueValue : []}
                        emptyText="Nenhum produto vendido ainda"
                        responsive={true}
                        mobileView={(item, index) => {
                            const product = getProductById(item.id);
                            return (
                                <div className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            {product ? (
                                                <img 
                                                    className="h-12 w-12 rounded-lg object-cover" 
                                                    src={getProductImageUrl(product)} 
                                                    alt={item.name}
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-400 text-xs">?</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        #{index + 1}
                                                    </p>
                                                </div>
                                                <div className="text-sm font-medium text-green-600">
                                                    {formatCurrency(item.revenueValue)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default TopProductsTables;
