import { useState, useEffect } from 'react';
import { orderService, productService } from '../../services/api';
import { Product } from '../../types';
import erroIcon from '../../../../assets/lojinha-icons/perrys/ERRO.png';
// import ConfirmModal from '../../../../components/Inputs/ConfirmModal'; // Removido - não utilizado
import { Table, ITableColumn } from '../../../../components/Inputs';
import { EmptyDatabaseMessage } from '../../componentes/EmptyDatabaseMessage';
import { useProductsCheck } from '../../hooks/useProductsCheck';

// Tipo específico para pedidos do admin (vem do backend)
interface AdminOrder {
    _id?: string;
    id: number;
    customerName?: string;
    items?: Array<{
        name?: string;
        productName?: string;
        quantity?: number;
        value?: number;
        price?: number;
        subtotal?: number;
    }>;
    totalAmount?: number;
    status: 'cart' | 'pendingPayment' | 'canceled' | 'finishedPayment';
    paymentStatus?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    confirmedAt?: string | Date;
}

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

const OrdersManagement: React.FC = () => {
    const { hasProducts, isChecking } = useProductsCheck();
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ORDERS_PER_PAGE = 40;
    // const [showStatusConfirmModal, setShowStatusConfirmModal] = useState(false); // Removido - não utilizado
    // const [pendingStatusChange, setPendingStatusChange] = useState<{orderId: string, newStatus: string, message: string} | null>(null); // Removido
    
    // Estados para produtos e clientes
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [allCustomers, setAllCustomers] = useState<string[]>([]);
    
    // Estados para o modal de filtros
    const [showFilterModal, setShowFilterModal] = useState(false);
    // const [showChangeStatusModal, setShowChangeStatusModal] = useState(false); // Removido - não utilizado
    // const [pendingStatusChange, setPendingStatusChange] = useState<{orderId: string; newStatus: string} | null>(null); // Removido
    const [filters, setFilters] = useState({
        customerName: '',
        items: [] as string[],
        minTotal: '',
        maxTotal: '',
        startDate: '',
        endDate: '',
        status: 'all'
    });
    const [appliedFilters, setAppliedFilters] = useState({
        customerName: '',
        items: [] as string[],
        minTotal: '',
        maxTotal: '',
        startDate: '',
        endDate: '',
        status: 'all'
    });

    useEffect(() => {
        if (hasProducts) {
            loadOrders();
            loadProducts();
        } else if (hasProducts === false) {
            setLoading(false);
        }
    }, [hasProducts]);

    useEffect(() => {
        // Extrair clientes únicos dos pedidos
        const uniqueCustomers = Array.from(new Set(orders.map(order => order.customerName || 'Cliente Anônimo')));
        setAllCustomers(uniqueCustomers);
    }, [orders]);

    const loadProducts = async () => {
        try {
            const response = await productService.getAll({ limit: 100, includeInactive: true });
            if (response.success && response.data) {
                setAllProducts(response.data);
            }
        } catch (err) {
            console.error('Error loading products:', err);
        }
    };

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await orderService.getAll({ limit: 100 });
            
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

    // Função não utilizada - atualização de status não está implementada no backend
    /*
    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            const order = orders.find(o => o._id === orderId);
            if (!order) return;
            
            // Backend não possui endpoint de updateStatus
            // await orderService.updateStatus(orderId, newStatus);
            await loadOrders();
        } catch (err: any) {
            console.error('Error updating order status:', err);
            alert('Erro ao atualizar status: ' + (err.message || 'Erro desconhecido'));
        }
    };
    */

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

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'finishedPayment':
                return 'bg-green-100 text-green-800';
            case 'canceled':
                return 'bg-red-100 text-red-800';
            case 'pendingPayment':
                return 'bg-yellow-100 text-yellow-800';
            case 'cart':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const columns: ITableColumn<AdminOrder>[] = [
        {
            key: 'order',
            title: 'Pedido',
            render: (_, order) => (
                <div className="text-sm font-mono font-medium text-gray-900">
                    #{(order._id || order.id || '').toString().slice(-8)}
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
            key: 'items',
            title: 'Itens',
            render: (_, order) => (
                <div>
                    <div className="text-sm text-gray-900">
                        {order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? 's' : ''}
                    </div>
                    <div className="text-xs text-gray-500 max-w-xs">
                        {(order.items ?? []).map(item => `${item.quantity ?? 0}x ${item.name ?? ''}`).join(', ')}
                    </div>
                </div>
            ),
            className: 'px-6 py-4'
        },
        {
            key: 'total',
            title: 'Total',
            render: (_, order) => (
                <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(order.totalAmount ?? 0)}
                </span>
            )
        },
        {
            key: 'status',
            title: 'Status',
            render: (_, order) => (
                <span className={`text-xs font-medium rounded-full px-3 py-1 ${getStatusClass(order.status)}`}>
                    {order.status === 'pendingPayment' ? 'Pendente' : 
                     order.status === 'finishedPayment' ? 'Concluído' : 
                     order.status === 'canceled' ? 'Cancelado' : 
                     order.status}
                </span>
            )
        },
        {
            key: 'date',
            title: 'Data',
            render: (_, order) => (
                <div className="text-sm text-gray-900">
                    {formatDate(order.createdAt?.toString() ?? new Date().toISOString())}
                </div>
            )
        },
        {
            key: 'actions',
            title: 'Ações',
            align: 'right',
            render: (_, order) => (
                <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-[#03B04B] hover:text-green-700 text-sm font-medium"
                >
                    Ver detalhes
                </button>
            )
        }
    ];

    const mobileView = (order: AdminOrder) => (
        <div className="p-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-mono text-gray-900">#{order._id?.slice(-8) || order.id}</span>
                <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(order.totalAmount ?? 0)}
                </span>
            </div>
            <div className="text-sm text-gray-900 font-medium mb-1">
                {getFirstAndLastName(order.customerName || '')}
            </div>
            <div className="text-xs text-gray-500 mb-2">
                {order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? 's' : ''} • {formatDate(order.createdAt?.toString() ?? new Date().toISOString())}
            </div>
            <div className="flex items-center justify-between">
                <span className={`text-xs font-medium rounded-full px-3 py-1 ${getStatusClass(order.status)}`}>
                    {order.status === 'pendingPayment' ? 'Pendente' : 
                     order.status === 'finishedPayment' ? 'Concluído' : 
                     order.status === 'canceled' ? 'Cancelado' : 
                     order.status}
                </span>
                <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-[#03B04B] hover:text-green-600 transition-colors text-sm"
                >
                    Ver Detalhes
                </button>
            </div>
        </div>
    );

    // Aplicar filtros aos pedidos (usando appliedFilters, não filters)
    const filteredOrders = orders.filter(order => {
        // Filtro por cliente
        if (appliedFilters.customerName && appliedFilters.customerName.trim() !== '') {
            if (!order.customerName?.toLowerCase().includes(appliedFilters.customerName.toLowerCase())) {
                return false;
            }
        }

        // Filtro por status
        if (appliedFilters.status && appliedFilters.status !== 'all') {
            if (order.status !== appliedFilters.status) {
                return false;
            }
        }

        // Filtro por produtos
        if (appliedFilters.items && appliedFilters.items.length > 0) {
            const orderItemNames = (order.items ?? []).map(item => (item.name ?? item.productName ?? '').toLowerCase());
            const hasAllProducts = appliedFilters.items.every(filterItem => 
                orderItemNames.some(orderItem => orderItem.includes(filterItem.toLowerCase()))
            );
            if (!hasAllProducts) {
                return false;
            }
        }

        // Filtro por valor mínimo
        if (appliedFilters.minTotal && appliedFilters.minTotal.trim() !== '') {
            const minValue = parseFloat(appliedFilters.minTotal.replace(/[^\d,]/g, '').replace(',', '.'));
            if (!isNaN(minValue) && (order.totalAmount ?? 0) < minValue) {
                return false;
            }
        }

        // Filtro por valor máximo
        if (appliedFilters.maxTotal && appliedFilters.maxTotal.trim() !== '') {
            const maxValue = parseFloat(appliedFilters.maxTotal.replace(/[^\d,]/g, '').replace(',', '.'));
            if (!isNaN(maxValue) && (order.totalAmount ?? 0) > maxValue) {
                return false;
            }
        }

        // Filtro por data inicial
        if (appliedFilters.startDate && appliedFilters.startDate.trim() !== '') {
            const startDate = new Date(appliedFilters.startDate);
            const orderDate = new Date(order.createdAt?.toString() ?? new Date());
            if (orderDate < startDate) {
                return false;
            }
        }

        // Filtro por data final
        if (appliedFilters.endDate && appliedFilters.endDate.trim() !== '') {
            const endDate = new Date(appliedFilters.endDate);
            endDate.setHours(23, 59, 59, 999);
            const orderDate = new Date(order.createdAt?.toString() ?? new Date());
            if (orderDate > endDate) {
                return false;
            }
        }

        return true;
    });

    // Lógica de paginação
    const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
    const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
    const endIndex = startIndex + ORDERS_PER_PAGE;
    const currentOrders = filteredOrders.slice(startIndex, endIndex);

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
        console.log('Aplicando filtros:', filters);
        setAppliedFilters({ ...filters });
        setCurrentPage(1);
        setShowFilterModal(false);
        console.log('Filtros aplicados');
    };

    const clearFilters = () => {
        const emptyFilters = {
            customerName: '',
            items: [],
            minTotal: '',
            maxTotal: '',
            startDate: '',
            endDate: '',
            status: 'all'
        };
        setFilters(emptyFilters);
        setAppliedFilters(emptyFilters);
        setCurrentPage(1);
        setShowFilterModal(false);
    };

    if (isChecking || loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#03B04B]"></div>
                    <span className="text-gray-600">Carregando pedidos...</span>
                </div>
            </div>
        );
    }

    if (hasProducts === false) {
        return <EmptyDatabaseMessage featureName="Pedidos" />;
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
                        Erro ao carregar pedidos
                    </h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        onClick={loadOrders}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium shadow-sm"
                    >
                        Tentar Novamente
                    </button>
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
                        {filteredOrders.length} pedido{filteredOrders.length !== 1 ? 's' : ''} encontrado{filteredOrders.length !== 1 ? 's' : ''} 
                        {filteredOrders.length !== orders.length && ` (de ${orders.length} total)`}
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
            <Table<AdminOrder>
                columns={columns}
                data={currentOrders}
                loading={loading}
                emptyText="Nenhum pedido encontrado"
                responsive={true}
                mobileView={mobileView}
            />

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
                                    <select
                                        value={filters.customerName}
                                        onChange={(e) => setFilters(prev => ({ ...prev, customerName: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03B04B] focus:border-[#03B04B] bg-white"
                                    >
                                        <option value="">Todos os clientes</option>
                                        {allCustomers.map(customer => (
                                            <option key={customer} value={customer}>{customer}</option>
                                        ))}
                                    </select>
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
                                        <option value="pendingPayment">Pendente</option>
                                        <option value="finishedPayment">Concluído</option>
                                        <option value="canceled">Cancelado</option>
                                    </select>
                                </div>

                                {/* Produtos */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Produtos no Pedido {filters.items.length > 0 && (
                                            <span className="text-xs text-gray-500 font-normal">
                                                ({filters.items.length} selecionado{filters.items.length !== 1 ? 's' : ''})
                                            </span>
                                        )}
                                    </label>
                                    <div className="border border-gray-300 rounded-lg max-h-[200px] overflow-y-auto bg-white">
                                        {allProducts.length === 0 ? (
                                            <div className="p-4 text-center text-sm text-gray-500">
                                                Nenhum produto disponível
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-gray-200">
                                                {allProducts.map(product => (
                                                    <label 
                                                        key={product.id}
                                                        className="flex items-center px-3 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={filters.items.includes(product.name)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setFilters(prev => ({ 
                                                                        ...prev, 
                                                                        items: [...prev.items, product.name] 
                                                                    }));
                                                                } else {
                                                                    setFilters(prev => ({ 
                                                                        ...prev, 
                                                                        items: prev.items.filter(item => item !== product.name) 
                                                                    }));
                                                                }
                                                            }}
                                                            className="h-4 w-4 text-[#03B04B] border-gray-300 rounded focus:ring-[#03B04B] focus:ring-2"
                                                        />
                                                        <span className="ml-3 flex-1 text-sm text-gray-900">
                                                            {product.name}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            R$ {product.value.toFixed(2)}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
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
                                    Detalhes do Pedido #{selectedOrder._id?.slice(-8) || selectedOrder.id}
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
                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Cliente</p>
                                                <p className="text-sm text-gray-900">{getFirstAndLastName(selectedOrder.customerName || '')}</p>
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
                                                {(selectedOrder.items ?? []).map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="px-4 py-3 text-sm text-gray-900">{item.name ?? item.productName}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">{item.quantity ?? 0}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.price ?? item.value ?? 0)}</td>
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(item.subtotal ?? ((item.price ?? item.value ?? 0) * (item.quantity ?? 0)))}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="bg-gray-50">
                                                <tr>
                                                    <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">Total:</td>
                                                    <td className="px-4 py-3 text-sm font-bold text-green-600">{formatCurrency(selectedOrder.totalAmount ?? 0)}</td>
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
                                            selectedOrder.status === 'finishedPayment' 
                                                ? 'bg-green-100 text-green-800'
                                                : selectedOrder.status === 'canceled'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {selectedOrder.status === 'finishedPayment' ? 'Concluído' : 
                                             selectedOrder.status === 'canceled' ? 'Cancelado' : 'Pendente'}
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
                                                <p className="text-sm text-gray-900">{formatDate(selectedOrder.createdAt?.toString() ?? new Date().toISOString())}</p>
                                            </div>
                                            {selectedOrder.confirmedAt && (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Data de Confirmação</p>
                                                    <p className="text-sm text-gray-900">{formatDate(typeof selectedOrder.confirmedAt === 'string' ? selectedOrder.confirmedAt : selectedOrder.confirmedAt.toISOString())}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
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
