import React, { useState, useEffect } from 'react';
import { orderService } from '../services/api';
import { Order } from '../types';
import erroIcon from '../../../assets/lojinha-icons/perrys/ERRO.png';

const OrdersManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        loadOrders();
    }, [statusFilter]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            
            let response;
            if (statusFilter === 'all') {
                response = await orderService.getAll({ limit: 100 });
            } else {
                response = await orderService.getByStatus(statusFilter);
            }
            
            if (response.success && response.data) {
                setOrders(Array.isArray(response.data) ? response.data : [response.data]);
            } else {
                throw new Error(response.message || 'Erro ao carregar pedidos');
            }
        } catch (err: any) {
            console.error('Error loading orders:', err);
            setError(err.message || 'Erro ao carregar pedidos');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await orderService.updateStatus(orderId, newStatus);
            await loadOrders(); // Recarregar lista
        } catch (err: any) {
            console.error('Error updating order status:', err);
            alert('Erro ao atualizar status: ' + (err.message || 'Erro desconhecido'));
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
                    <span className="text-gray-600">Carregando pedidos...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center space-x-3">
                    <img 
                        src={erroIcon} 
                        alt="Erro" 
                        className="w-8 h-8 object-contain"
                    />
                    <div>
                        <h3 className="text-red-900 font-medium">Erro ao carregar pedidos</h3>
                        <p className="text-red-700 text-sm mt-1">{error}</p>
                        <button
                            onClick={loadOrders}
                            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                            Tentar novamente
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header e filtros */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Gerenciar Pedidos</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {orders.length} pedido{orders.length !== 1 ? 's' : ''} encontrado{orders.length !== 1 ? 's' : ''}
                    </p>
                </div>
                
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03B04B] focus:border-[#03B04B]"
                >
                    <option value="all">Todos os status</option>
                    <option value="pending">Pendente</option>
                    <option value="delivered">Concluído</option>
                </select>
            </div>

            {/* Lista de pedidos */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {orders.length > 0 ? (
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
                                            Itens
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
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <tr key={order._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-mono font-medium text-gray-900">
                                                    #{order._id.slice(-8)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {order.customerName || 'Cliente Anônimo'}
                                                </div>
                                                {order.customerCourse && (
                                                    <div className="text-sm text-gray-500">{order.customerCourse}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                                </div>
                                                <div className="text-xs text-gray-500 max-w-xs">
                                                    {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatCurrency(order.totalAmount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={order.status === 'delivered' ? 'delivered' : 'pending'}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    className={`text-xs font-semibold rounded-full px-2 py-1 border-0 focus:ring-1 focus:ring-[#03B04B] ${
                                                        order.status === 'delivered' 
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                                >
                                                    <option value="pending">Pendente</option>
                                                    <option value="delivered">Concluído</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(order.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="text-[#03B04B] hover:text-green-600 transition-colors"
                                                >
                                                    Ver Detalhes
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Versão mobile */}
                        <div className="md:hidden">
                            {orders.map((order) => (
                                <div key={order._id} className="p-4 border-b border-gray-200 last:border-b-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-mono text-gray-900">#{order._id.slice(-8)}</span>
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
                                    <div className="text-xs text-gray-500 mb-2">
                                        {order.items.length} item{order.items.length !== 1 ? 's' : ''} • {formatDate(order.createdAt)}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <select
                                            value={order.status === 'delivered' ? 'delivered' : 'pending'}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className={`text-xs font-semibold rounded-full px-2 py-1 border-0 focus:ring-1 focus:ring-[#03B04B] ${
                                                order.status === 'delivered' 
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                        >
                                            <option value="pending">Pendente</option>
                                            <option value="delivered">Concluído</option>
                                        </select>
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="text-[#03B04B] hover:text-green-600 transition-colors text-sm"
                                        >
                                            Ver Detalhes
                                        </button>
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

            {/* Modal de detalhes */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Detalhes do Pedido #{selectedOrder._id.slice(-8)}
                                </h2>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <span className="text-2xl">×</span>
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Informações do cliente */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">Informações do Cliente</h3>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Nome</p>
                                                <p className="text-sm text-gray-900">{selectedOrder.customerName || 'Não informado'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Curso</p>
                                                <p className="text-sm text-gray-900">{selectedOrder.customerCourse || 'Não informado'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Itens do pedido */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">Itens do Pedido</h3>
                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qtd</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço Unit.</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {selectedOrder.items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.price)}</td>
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(item.subtotal)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="bg-gray-50">
                                                <tr>
                                                    <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">Total:</td>
                                                    <td className="px-4 py-3 text-sm font-bold text-green-600">{formatCurrency(selectedOrder.totalAmount)}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">Status do Pedido</h3>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                                            selectedOrder.status === 'delivered' 
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {selectedOrder.status === 'delivered' ? 'Concluído' : 'Pendente'}
                                        </span>
                                    </div>
                                </div>

                                {/* Datas */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">Informações Temporais</h3>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Data de Criação</p>
                                                <p className="text-sm text-gray-900">{formatDate(selectedOrder.createdAt)}</p>
                                            </div>
                                            {selectedOrder.confirmedAt && (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Data de Confirmação</p>
                                                    <p className="text-sm text-gray-900">{formatDate(selectedOrder.confirmedAt)}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {selectedOrder.notes && (
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Observações</h3>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-900">{selectedOrder.notes}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersManagement;
