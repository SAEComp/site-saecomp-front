import React from 'react';

interface StatsCardsProps {
    stats: {
        totalOrders: number;
        totalRevenue: number;
        completedOrders: number;
        totalItemsSold: number;
        totalProductsInStock: number;
        maxPotentialRevenue?: number;
    };
    formatCurrency: (value: number) => string;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, formatCurrency }) => {
    return (
        <div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">Visão Geral</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {/* Primeira linha */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                    <div>
                        <p className="text-sm md:text-lg font-medium text-gray-900 mb-1">Total de Pedidos</p>
                        <p className="text-xl md:text-2xl font-medium text-green-600">{stats.totalOrders}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                    <div>
                        <p className="text-sm md:text-lg font-medium text-gray-900 mb-1">Receita Total</p>
                        <p className="text-xl md:text-2xl font-medium text-green-600">{formatCurrency(stats.totalRevenue)}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                    <div>
                        <p className="text-sm md:text-lg font-medium text-gray-900 mb-1">Pedidos Concluídos</p>
                        <p className="text-xl md:text-2xl font-medium text-green-600">{stats.completedOrders}</p>
                    </div>
                </div>

                {/* Segunda linha */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                    <div>
                        <p className="text-sm md:text-lg font-medium text-gray-900 mb-1">Itens Vendidos</p>
                        <p className="text-xl md:text-2xl font-medium text-green-600">{stats.totalItemsSold}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                    <div>
                        <p className="text-sm md:text-lg font-medium text-gray-900 mb-1">Produtos em Estoque</p>
                        <p className="text-xl md:text-2xl font-medium text-green-600">{stats.totalProductsInStock || 0}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                    <div>
                        <p className="text-sm md:text-lg font-medium text-gray-900 mb-1">Valor em Estoque</p>
                        <p className="text-xl md:text-2xl font-medium text-green-600">{formatCurrency(stats.maxPotentialRevenue || 0)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsCards;
