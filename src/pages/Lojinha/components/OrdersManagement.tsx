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
    const [currentPage, setCurrentPage] = useState(1);
    const ORDERS_PER_PAGE = 40;
    
    // Estados para o modal de filtros
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filters, setFilters] = useState({
        customerName: '',
        items: [] as string[],
        minTotal: '',
        maxTotal: '',
        startDate: '',
        endDate: '',
        status: 'all'
    });
    const [itemInputs, setItemInputs] = useState(['']); // Array de inputs para itens

    useEffect(() => {
        loadOrders();
        setCurrentPage(1); // Reset para primeira página quando filtro muda
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

    // Lógica de paginação
    const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
    const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
    const endIndex = startIndex + ORDERS_PER_PAGE;
    const currentOrders = orders.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Funções para gerenciar filtros
    const addNewItemInput = () => {
        setItemInputs(prev => [...prev, '']);
    };

    const updateItemInput = (index: number, value: string) => {
        const newInputs = [...itemInputs];
        newInputs[index] = value;
        setItemInputs(newInputs);
        
        // Atualizar a lista de itens removendo vazios
        const validItems = newInputs.filter(item => item.trim() !== '');
        setFilters(prev => ({ ...prev, items: validItems }));
    };

    const removeItemInput = (index: number) => {
        if (itemInputs.length > 1) {
            const newInputs = itemInputs.filter((_, i) => i !== index);
            setItemInputs(newInputs);
            
            // Atualizar a lista de itens
            const validItems = newInputs.filter(item => item.trim() !== '');
            setFilters(prev => ({ ...prev, items: validItems }));
        }
    };

    // Função para formatar valores monetários
    const formatCurrencyInput = (value: string) => {
        // Remove tudo que não é número
        const numbers = value.replace(/\D/g, '');
        
        // Se vazio, retorna vazio
        if (!numbers) return '';
        
        // Converte para número e divide por 100 para ter centavos
        const amount = parseFloat(numbers) / 100;
        
        // Formata como moeda brasileira
        return amount.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const handleMinTotalChange = (value: string) => {
        const formatted = formatCurrencyInput(value);
        setFilters(prev => ({ ...prev, minTotal: formatted }));
    };

    const handleMaxTotalChange = (value: string) => {
        const formatted = formatCurrencyInput(value);
        setFilters(prev => ({ ...prev, maxTotal: formatted }));
    };

    const applyFilters = () => {
        setStatusFilter(filters.status);
        setCurrentPage(1);
        setShowFilterModal(false);
        // Aqui você pode implementar a lógica de filtro personalizada
        // Por enquanto, vamos manter a funcionalidade básica de status
    };

    const clearFilters = () => {
        setFilters({
            customerName: '',
            items: [],
            minTotal: '',
            maxTotal: '',
            startDate: '',
            endDate: '',
            status: 'all'
        });
        setItemInputs(['']); // Reset para uma caixa vazia
        setStatusFilter('all');
        setCurrentPage(1);
        setShowFilterModal(false);
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
                
                <div className="flex items-center space-x-4">
                    {/* Paginação no topo */}
                    {totalPages > 1 && (
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-md ${
                                    currentPage === 1
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                </svg>
                            </button>
                            
                            <span className="text-sm text-gray-600">
                                {currentPage} / {totalPages}
                            </span>
                            
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-md ${
                                    currentPage === totalPages
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    )}
                    
                    <button
                        onClick={() => setShowFilterModal(true)}
                        className="bg-[#03B04B] hover:bg-green-600 text-white border border-green-500 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm"
                    >
                        <span>Adicionar filtros</span>
                    </button>
                </div>
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
                                    {currentOrders.map((order) => (
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
                                                    value={order.status === 'concluído' ? 'concluído' : 'pendente'}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    className={`text-xs font-semibold rounded-full px-2 py-1 border-0 focus:ring-1 focus:ring-[#03B04B] ${
                                                        order.status === 'concluído' 
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                                >
                                                    <option value="pendente">Pendente</option>
                                                    <option value="concluído">Concluído</option>
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
                            {currentOrders.map((order) => (
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
                                                order.status === 'concluído' 
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                        >
                                            <option value="pendente">Pendente</option>
                                            <option value="concluído">Concluído</option>
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

            {/* Componente de Paginação */}
            {totalPages > 1 && (
                <div className="flex justify-center">
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                                currentPage === 1
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-400 hover:bg-gray-50'
                            } ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0`}
                        >
                            <span className="sr-only">Anterior</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {/* Números das páginas */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            // Mostrar no máximo 7 páginas: primeira, última, atual e algumas ao redor
                            const showPage = page === 1 || page === totalPages || 
                                           (page >= currentPage - 2 && page <= currentPage + 2);
                            
                            if (!showPage) {
                                // Mostrar "..." apenas uma vez entre grupos
                                if (page === currentPage - 3 || page === currentPage + 3) {
                                    return (
                                        <span key={page} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                                            ...
                                        </span>
                                    );
                                }
                                return null;
                            }

                            return (
                                <button
                                    key={page}
                                    onClick={() => goToPage(page)}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                        page === currentPage
                                            ? 'z-10 bg-[#03B04B] text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#03B04B]'
                                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        })}

                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                                currentPage === totalPages
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-400 hover:bg-gray-50'
                            } ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0`}
                        >
                            <span className="sr-only">Próxima</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </nav>
                </div>
            )}

            {/* Modal de Filtros */}
            {showFilterModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Filtros Avançados</h2>
                                <button
                                    onClick={() => setShowFilterModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <span className="text-2xl">×</span>
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Nome do Cliente */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome do Cliente
                                    </label>
                                    <input
                                        type="text"
                                        value={filters.customerName}
                                        onChange={(e) => setFilters(prev => ({ ...prev, customerName: e.target.value }))}
                                        placeholder="Digite o nome do cliente"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03B04B] focus:border-[#03B04B]"
                                    />
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status do Pedido
                                    </label>
                                    <select
                                        value={filters.status}
                                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03B04B] focus:border-[#03B04B] bg-white"
                                    >
                                        <option value="all">Todos os status</option>
                                        <option value="pendente">Pendente</option>
                                        <option value="concluído">Concluído</option>
                                    </select>
                                </div>

                                {/* Itens */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Produtos no Pedido
                                    </label>
                                    <div className="space-y-3">
                                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                            {itemInputs.map((item, index) => (
                                                <div key={index} className="flex items-center space-x-3">
                                                    <div className="flex-1">
                                                        <input
                                                            type="text"
                                                            value={item}
                                                            onChange={(e) => updateItemInput(index, e.target.value)}
                                                            placeholder={`Produto ${index + 1}`}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#03B04B] focus:border-[#03B04B] bg-white text-sm"
                                                        />
                                                    </div>
                                                    {itemInputs.length > 1 && (
                                                        <button
                                                            onClick={() => removeItemInput(index)}
                                                            className="w-8 h-8 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors flex items-center justify-center text-sm font-medium"
                                                            title="Remover produto"
                                                        >
                                                            ×
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="flex justify-start">
                                            <button
                                                onClick={addNewItemInput}
                                                className="inline-flex items-center px-4 py-2 bg-gray-200 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                                            >
                                                Adicionar Produto 
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Valor Total */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Valor Total
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={filters.minTotal}
                                            onChange={(e) => handleMinTotalChange(e.target.value)}
                                            placeholder="Mínimo"
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03B04B] focus:border-[#03B04B]"
                                        />
                                        <input
                                            type="text"
                                            value={filters.maxTotal}
                                            onChange={(e) => handleMaxTotalChange(e.target.value)}
                                            placeholder="Máximo"
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03B04B] focus:border-[#03B04B]"
                                        />
                                    </div>
                                </div>

                                {/* Data */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Período
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">De</label>
                                            <input
                                                type="date"
                                                value={filters.startDate}
                                                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03B04B] focus:border-[#03B04B]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Até</label>
                                            <input
                                                type="date"
                                                value={filters.endDate}
                                                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03B04B] focus:border-[#03B04B]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between pt-6 border-t border-gray-200 mt-6">
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Limpar Filtros
                                </button>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setShowFilterModal(false)}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={applyFilters}
                                        className="px-4 py-2 bg-[#03B04B] text-white rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        Aplicar Filtros
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
