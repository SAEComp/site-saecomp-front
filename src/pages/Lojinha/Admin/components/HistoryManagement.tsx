import { useState, useEffect } from 'react';
import { historyService, productService } from '../../services/api';
import { HistoryEntry, Product } from '../../types';
import { getProductImageUrl } from '../../utils/imageUtils';
import erroIcon from '../../../../assets/lojinha-icons/perrys/ERRO.png';
import { Table, ITableColumn } from '../../../../components/Inputs';

const HistoryManagement: React.FC = () => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 20;
    
    // Estados para filtros
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filters, setFilters] = useState({
        productName: '',
        minPrice: '',
        maxPrice: '',
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        loadHistory();
        setCurrentPage(1); // Reset para primeira página quando filtros mudam
    }, [filters]);

    const loadHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Load both history and products in parallel
            const [historyResponse, productsResponse] = await Promise.all([
                historyService.getHistory({
                    page: 1,
                    limit: 1000, // Get all entries
                    action: undefined // Don't filter on server
                }),
                productService.getAll({ limit: 100 })
            ]);
            
            if (historyResponse.success && historyResponse.data) {
                let filteredHistory = historyResponse.data;
                
                // Filter only UPDATE actions with price changes
                filteredHistory = filteredHistory.filter(entry => {
                    if (entry.action !== 'UPDATE') return false;
                    return entry.changes.some(change => change.field === 'price');
                });
                
                // Apply filters
                if (filters.productName) {
                    filteredHistory = filteredHistory.filter(entry => 
                        entry.entityName.toLowerCase().includes(filters.productName.toLowerCase())
                    );
                }
                
                if (filters.startDate) {
                    const startDate = new Date(filters.startDate);
                    filteredHistory = filteredHistory.filter(entry => 
                        new Date(entry.timestamp) >= startDate
                    );
                }
                
                if (filters.endDate) {
                    const endDate = new Date(filters.endDate);
                    endDate.setHours(23, 59, 59, 999); // Incluir todo o dia final
                    filteredHistory = filteredHistory.filter(entry => 
                        new Date(entry.timestamp) <= endDate
                    );
                }
                
                if (filters.minPrice || filters.maxPrice) {
                    filteredHistory = filteredHistory.filter(entry => {
                        const priceChange = entry.changes.find(change => change.field === 'price');
                        if (!priceChange || priceChange.newValue === null || priceChange.newValue === undefined) return false;
                        
                        const newPrice = priceChange.newValue;
                        
                        if (filters.minPrice) {
                            const minPriceValue = parseFloat(filters.minPrice.replace(/[^\d,]/g, '').replace(',', '.'));
                            if (newPrice < minPriceValue) return false;
                        }
                        
                        if (filters.maxPrice) {
                            const maxPriceValue = parseFloat(filters.maxPrice.replace(/[^\d,]/g, '').replace(',', '.'));
                            if (newPrice > maxPriceValue) return false;
                        }
                        
                        return true;
                    });
                }
                
                setHistory(filteredHistory);
            } else {
                throw new Error(historyResponse.message || 'Erro ao carregar histórico');
            }
            
            if (productsResponse.success && productsResponse.data) {
                setProducts(productsResponse.data);
            }
        } catch (err: any) {
            console.error('Error loading history:', err);
            setError(err.message || 'Erro ao carregar histórico');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('pt-BR');
    };

    const getProductById = (id: string): Product | undefined => {
        return products.find(product => product.id.toString() === id);
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

    const handleMinPriceChange = (value: string) => {
        const formatted = formatCurrencyInput(value);
        setFilters(prev => ({ ...prev, minPrice: formatted }));
    };

    const handleMaxPriceChange = (value: string) => {
        const formatted = formatCurrencyInput(value);
        setFilters(prev => ({ ...prev, maxPrice: formatted }));
    };

    // Aplicar paginação aos dados filtrados
    const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedHistory = history.slice(startIndex, endIndex);

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

    const clearAllFilters = () => {
        setFilters({
            productName: '',
            minPrice: '',
            maxPrice: '',
            startDate: '',
            endDate: ''
        });
        setCurrentPage(1);
    };

    const columns: ITableColumn<HistoryEntry>[] = [
        {
            key: 'product',
            title: 'Produto',
            render: (_, entry) => {
                const product = getProductById(entry.entityId);
                
                return (
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                            {product ? (
                                <img 
                                    className="h-12 w-12 rounded-lg object-cover" 
                                    src={getProductImageUrl(product)} 
                                    alt={entry.entityName}
                                />
                            ) : (
                                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-2 border-blue-300">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                                {entry.entityName}
                            </div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                                {product?.description || 'Produto não encontrado'}
                            </div>
                        </div>
                    </div>
                );
            }
        },
        {
            key: 'stock',
            title: 'Estoque',
            render: (_, entry) => {
                const stockChange = entry.changes.find(change => change.field === 'stock');
                
                if (stockChange) {
                    const oldStock = stockChange.oldValue ?? 0;
                    const newStock = stockChange.newValue ?? 0;
                    const diff = newStock - oldStock;
                    const isIncrease = diff > 0;
                    
                    return (
                        <div className="text-sm">
                            <div className="flex items-center space-x-2 mb-1">
                                <span className="text-gray-500">{oldStock}</span>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                                <span className={`font-medium ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                                    {newStock}
                                </span>
                            </div>
                            <div className={`text-xs ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                                {isIncrease ? '+' : ''}{diff} unidades
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <span className="text-xs text-gray-400">
                            Sem alteração
                        </span>
                    );
                }
            }
        },
        {
            key: 'oldPrice',
            title: 'Preço Anterior',
            render: (_, entry) => {
                const priceChange = entry.changes.find(change => change.field === 'price');
                const oldPrice = priceChange?.oldValue !== null && priceChange?.oldValue !== undefined 
                    ? priceChange.oldValue.toFixed(2) 
                    : '0.00';
                const newPrice = priceChange?.newValue !== null && priceChange?.newValue !== undefined 
                    ? priceChange.newValue 
                    : 0;
                
                // Se não houve alteração de preço, mostrar em preto sem risco
                const hasChanged = oldPrice !== newPrice.toFixed(2);
                
                return (
                    <span className={`text-sm font-medium ${hasChanged ? 'text-red-600 line-through' : 'text-gray-900'}`}>
                        R$ {oldPrice}
                    </span>
                );
            }
        },
        {
            key: 'newPrice',
            title: 'Novo Preço',
            render: (_, entry) => {
                const priceChange = entry.changes.find(change => change.field === 'price');
                const oldPrice = priceChange?.oldValue !== null && priceChange?.oldValue !== undefined 
                    ? priceChange.oldValue 
                    : 0;
                const newPrice = priceChange?.newValue !== null && priceChange?.newValue !== undefined 
                    ? priceChange.newValue.toFixed(2) 
                    : '0.00';
                
                // Se não houve alteração de preço, mostrar em preto normal
                const hasChanged = oldPrice.toFixed(2) !== newPrice;
                
                return (
                    <span className={`text-sm font-semibold ${hasChanged ? 'text-green-600' : 'text-gray-900'}`}>
                        R$ {newPrice}
                    </span>
                );
            }
        },
        {
            key: 'difference',
            title: 'Diferença',
            render: (_, entry) => {
                const priceChange = entry.changes.find(change => change.field === 'price');
                const oldPrice = priceChange?.oldValue ?? 0;
                const newPrice = priceChange?.newValue ?? 0;
                const diff = newPrice - oldPrice;
                const isIncrease = diff > 0;
                const isDecrease = diff < 0;
                
                // Se não há diferença (diff === 0), mostrar apenas o valor sem seta
                if (diff === 0) {
                    return (
                        <span className="text-sm font-medium text-gray-900">
                            R$ 0,00
                        </span>
                    );
                }
                
                return (
                    <div className="flex items-center space-x-1">
                        {isIncrease ? (
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                        ) : isDecrease ? (
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        ) : null}
                        <span className={`text-sm font-medium ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                            R$ {Math.abs(diff).toFixed(2)}
                        </span>
                    </div>
                );
            }
        },
        {
            key: 'date',
            title: 'Data da Alteração',
            render: (_, entry) => (
                <span className="text-sm text-gray-900">
                    {formatDate(entry.timestamp)}
                </span>
            )
        }
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando histórico...</p>
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
                        Erro ao carregar histórico
                    </h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        onClick={loadHistory}
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
                    <h2 className="text-xl font-semibold text-gray-900">Histórico de Alterações</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {history.length} alteraç{history.length !== 1 ? 'ões' : 'ão'} de preço encontrada{history.length !== 1 ? 's' : ''}
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

            {/* Tabela */}
            <Table
                columns={columns}
                data={paginatedHistory}
                loading={loading}
                emptyText="Nenhuma alteração de preço encontrada"
                emptyIcon={erroIcon}
            />

            {/* Paginação inferior */}
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
                                    onClick={() => setCurrentPage(page)}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                        page === currentPage
                                            ? 'bg-[#03B04B] text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600'
                                            : 'text-gray-900 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                    } ring-1 ring-inset ring-gray-300`}
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
                                {/* Nome do Produto */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome do Produto
                                    </label>
                                    <input
                                        type="text"
                                        value={filters.productName}
                                        onChange={(e) => setFilters(prev => ({ ...prev, productName: e.target.value }))}
                                        placeholder="Digite o nome do produto"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03B04B] focus:border-[#03B04B]"
                                    />
                                </div>

                                {/* Valor do Preço */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Valor do Preço
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={filters.minPrice}
                                            onChange={(e) => handleMinPriceChange(e.target.value)}
                                            placeholder="Mínimo"
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03B04B] focus:border-[#03B04B]"
                                        />
                                        <input
                                            type="text"
                                            value={filters.maxPrice}
                                            onChange={(e) => handleMaxPriceChange(e.target.value)}
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
                                    onClick={clearAllFilters}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Limpar Filtros
                                </button>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setShowFilterModal(false)}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => setShowFilterModal(false)}
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
        </div>
    );
};

export default HistoryManagement;