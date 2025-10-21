import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { Product, Order } from '../../types';
import { getProductImageUrl } from '../../utils/imageUtils';
import erroIcon from '../../../../assets/lojinha-icons/perrys/ERRO.png';
import { Table, ITableColumn } from '../../../../components/Inputs';

// Função utilitária para extrair primeiro e último nome
const getFirstAndLastName = (fullName: string): string => {
    if (!fullName || fullName.trim() === '' || fullName === 'Cliente Anônimo') {
        return 'Cliente Anônimo';
    }
    
    const nameParts = fullName.trim().split(' ').filter(part => part.length > 0);
    
    if (nameParts.length === 0) {
        return 'Cliente Anônimo';
    } else if (nameParts.length === 1) {
        return nameParts[0];
    } else {
        return `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;
    }
};

interface StatsData {
    totalOrders: number;
    totalRevenue: number;
    completedOrders: number;
    totalItemsSold: number;
    totalProductsInStock: number;
    totalItemsInStock: number;
    topProducts: Array<{
        product: Product;
        totalSold: number;
        revenue: number;
    }>;
    recentOrders: Order[];
}

const StatsManagement: React.FC = () => {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await adminService.getStats();
            if (response.success && response.data) {
                setStats(response.data);
            } else {
                throw new Error(response.message || 'Erro ao carregar estatísticas');
            }
        } catch (err: any) {
            console.error('Error loading stats:', err);
            setError(err.message || 'Erro ao carregar estatísticas');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Colunas para a tabela de produtos mais vendidos (por quantidade)
    const topSoldProductsColumns: ITableColumn[] = [
        {
            key: 'product',
            title: 'Produto',
            render: (_, item: any) => (
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                        <img 
                            className="h-12 w-12 rounded-lg object-cover" 
                            src={getProductImageUrl(item.product)} 
                            alt={item.product.name}
                        />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                            {item.product.name}
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'sold',
            title: 'Vendidos',
            render: (_, item: any) => (
                <span className="text-sm font-medium text-gray-900">
                    {item.totalSold} unidades
                </span>
            )
        }
    ];

    // Colunas para a tabela de produtos que mais geraram receita
    const topRevenueProductsColumns: ITableColumn[] = [
        {
            key: 'product',
            title: 'Produto',
            render: (_, item: any) => (
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                        <img 
                            className="h-12 w-12 rounded-lg object-cover" 
                            src={getProductImageUrl(item.product)} 
                            alt={item.product.name}
                        />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                            {item.product.name}
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'revenue',
            title: 'Receita',
            render: (_, item: any) => (
                <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(item.revenue)}
                </span>
            )
        }
    ];

    // Colunas para a tabela de pedidos recentes
    const recentOrdersColumns: ITableColumn<Order>[] = [
        {
            key: 'order',
            title: 'Pedido',
            render: (_, order) => (
                <div className="text-sm font-mono font-medium text-gray-900">
                    #{order._id.slice(-8)}
                </div>
            )
        },
        {
            key: 'customer',
            title: 'Cliente',
            render: (_, order) => (
                <div className="text-sm font-medium text-gray-900">
                    {getFirstAndLastName(order.customerName || '')}
                </div>
            )
        },
        {
            key: 'total',
            title: 'Total',
            render: (_, order) => (
                <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(order.totalAmount)}
                </span>
            )
        },
        {
            key: 'date',
            title: 'Data',
            render: (_, order) => (
                <div className="text-sm text-gray-900">
                    {formatDate(order.createdAt)}
                </div>
            )
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#03B04B]"></div>
                    <span className="text-gray-600">Carregando estatísticas...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center max-w-md">
                    <img 
                        src={erroIcon} 
                        alt="Erro" 
                        className="w-24 h-24 mx-auto mb-6 object-contain"
                    />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Erro ao carregar estatísticas
                    </h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        onClick={loadStats}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium shadow-sm"
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Nenhuma estatística disponível</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Métricas principais */}
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
                            <p className="text-sm md:text-lg font-medium text-gray-900 mb-1">Itens em Estoque</p>
                            <p className="text-xl md:text-2xl font-medium text-green-600">{stats.totalItemsInStock || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Produtos mais vendidos */}
            <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">Top 3 Produtos</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Mais vendidos por quantidade */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Mais Vendidos</h3>
                            <p className="text-sm text-gray-500">Por quantidade de unidades</p>
                        </div>
                        <Table
                            columns={topSoldProductsColumns}
                            data={[...stats.topProducts].sort((a, b) => b.totalSold - a.totalSold)}
                            emptyText="Nenhum produto vendido ainda"
                            responsive={true}
                            mobileView={(item, index) => (
                                <div className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img 
                                                className="h-10 w-10 rounded-lg object-cover" 
                                                src={getProductImageUrl(item.product)} 
                                                alt={item.product.name}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {item.product.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        #{index + 1}
                                                    </p>
                                                </div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {item.totalSold} un.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
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
                            data={[...stats.topProducts].sort((a, b) => b.revenue - a.revenue)}
                            emptyText="Nenhum produto vendido ainda"
                            responsive={true}
                            mobileView={(item, index) => (
                                <div className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img 
                                                className="h-10 w-10 rounded-lg object-cover" 
                                                src={getProductImageUrl(item.product)} 
                                                alt={item.product.name}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {item.product.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        #{index + 1}
                                                    </p>
                                                </div>
                                                <div className="text-sm font-medium text-green-600">
                                                    {formatCurrency(item.revenue)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* Pedidos recentes */}
            <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">Pedidos Recentes</h2>
                <Table<Order>
                    columns={recentOrdersColumns}
                    data={stats.recentOrders}
                    emptyText="Nenhum pedido recente"
                    responsive={true}
                    mobileView={(order) => (
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-mono text-gray-900">#{order._id.slice(-8)}</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {formatCurrency(order.totalAmount)}
                                </span>
                            </div>
                            <div className="text-sm text-gray-900 mb-1">
                                {getFirstAndLastName(order.customerName || '')}
                            </div>
                            <div className="text-xs text-gray-500">
                                {formatDate(order.createdAt)}
                            </div>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

export default StatsManagement;
