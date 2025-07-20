import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { Product, Order } from '../types';
import { getProductImageUrl } from '../utils/imageUtils';
import erroIcon from '../../../assets/lojinha-icons/perrys/ERRO.png';

interface StatsData {
    totalOrders: number;
    totalRevenue: number;
    completedOrders: number;
    pendingOrders: number;
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
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <img 
                            src={erroIcon} 
                            alt="Erro" 
                            className="w-8 h-8 object-contain"
                        />
                        <div>
                            <h3 className="text-red-900 font-medium">Erro ao carregar estatísticas</h3>
                            <p className="text-red-700 text-sm mt-1">{error}</p>
                            <div className="flex items-center space-x-4 mt-3">
                                <button
                                    onClick={loadStats}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                >
                                    Tentar novamente
                                </button>
                                <img 
                                    src={erroIcon} 
                                    alt="Perry Erro" 
                                    className="w-16 h-16 object-contain"
                                />
                            </div>
                        </div>
                    </div>
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
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Visão Geral</h2>
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
                            <p className="text-sm md:text-lg font-medium text-gray-900 mb-1">Pedidos Pendentes</p>
                            <p className="text-xl md:text-2xl font-medium text-yellow-600">{stats.pendingOrders}</p>
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
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Top 3 Produtos</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Mais vendidos por quantidade */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Mais Vendidos</h3>
                            <p className="text-sm text-gray-500">Por quantidade de unidades</p>
                        </div>
                        {stats.topProducts.length > 0 ? (
                            <>
                                {/* Versão desktop */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Produto
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Vendidos
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {[...stats.topProducts].sort((a, b) => b.totalSold - a.totalSold).map((item, index) => (
                                                <tr key={`sold-${item.product._id}`}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-12 w-12">
                                                                <img 
                                                                    className="h-12 w-12 rounded-lg object-cover" 
                                                                    src={getProductImageUrl(item.product)} 
                                                                    alt={item.product.name}
                                                                />
                                                            </div>
                                                            <div className="ml-6">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {item.product.name}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    #{index + 1}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        <span className="font-semibold">{item.totalSold}</span> unidades
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Versão mobile */}
                                <div className="md:hidden">
                                    {[...stats.topProducts].sort((a, b) => b.totalSold - a.totalSold).map((item, index) => (
                                        <div key={`sold-mobile-${item.product._id}`} className="p-4 border-b border-gray-200 last:border-b-0">
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
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            {item.totalSold} un.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="p-6 text-center">
                                <p className="text-gray-500">Nenhum produto vendido ainda</p>
                            </div>
                        )}
                    </div>

                    {/* Maiores receitas */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Maiores Receitas</h3>
                            <p className="text-sm text-gray-500">Por valor arrecadado</p>
                        </div>
                        {stats.topProducts.length > 0 ? (
                            <>
                                {/* Versão desktop */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Produto
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Receita
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {[...stats.topProducts].sort((a, b) => b.revenue - a.revenue).map((item, index) => (
                                                <tr key={`revenue-${item.product._id}`}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-12 w-12">
                                                                <img 
                                                                    className="h-12 w-12 rounded-lg object-cover" 
                                                                    src={getProductImageUrl(item.product)} 
                                                                    alt={item.product.name}
                                                                />
                                                            </div>
                                                            <div className="ml-6">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {item.product.name}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    #{index + 1}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                                        {formatCurrency(item.revenue)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Versão mobile */}
                                <div className="md:hidden">
                                    {[...stats.topProducts].sort((a, b) => b.revenue - a.revenue).map((item, index) => (
                                        <div key={`revenue-mobile-${item.product._id}`} className="p-4 border-b border-gray-200 last:border-b-0">
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
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="p-6 text-center">
                                <p className="text-gray-500">Nenhum produto vendido ainda</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Pedidos recentes */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Pedidos Recentes</h2>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {stats.recentOrders.length > 0 ? (
                        <>
                            {/* Versão desktop */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Pedido
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Cliente
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Data
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {stats.recentOrders.map((order) => (
                                            <tr key={order._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                                    #{order._id.slice(-8)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {order.customerName || 'Cliente Anônimo'}
                                                    {order.customerCourse && (
                                                        <div className="text-xs text-gray-500">{order.customerCourse}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {formatCurrency(order.totalAmount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        order.status === 'delivered'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {order.status === 'delivered' ? 'Concluído' : 'Pendente'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(order.createdAt)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Versão mobile */}
                            <div className="md:hidden">
                                {stats.recentOrders.map((order) => (
                                    <div key={order._id} className="p-4 border-b border-gray-200 last:border-b-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-mono text-gray-900">#{order._id.slice(-8)}</span>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    order.status === 'delivered'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {order.status === 'delivered' ? 'Concluído' : 'Pendente'}
                                                </span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">
                                                {formatCurrency(order.totalAmount)}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-900 mb-1">
                                            {order.customerName || 'Cliente Anônimo'}
                                            {order.customerCourse && (
                                                <span className="text-xs text-gray-500 ml-2">• {order.customerCourse}</span>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {formatDate(order.createdAt)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="p-6 text-center">
                            <p className="text-gray-500">Nenhum pedido encontrado</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatsManagement;
