import React, { useState, useEffect } from 'react';
import { historyService, productService } from '../services/api';
import { HistoryEntry, HistoryStats, Product } from '../types';
import { getProductImageUrl } from '../utils/imageUtils';
import erroIcon from '../../../assets/lojinha-icons/perrys/ERRO.png';

const HistoryManagement: React.FC = () => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [stats, setStats] = useState<HistoryStats | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'CREATE' | 'UPDATE' | 'DELETE'>('all');
    const [dateFilter, setDateFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const ITEMS_PER_PAGE = 20;

    useEffect(() => {
        loadHistory();
        loadStats();
        loadProducts();
    }, [filter, dateFilter, currentPage]);

    const loadHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            // Load all history entries for client-side filtering
            const response = await historyService.getHistory({
                page: 1,
                limit: 1000, // Get all entries
                action: undefined // Don't filter on server
            });
            
            if (response.success && response.data) {
                let filteredHistory = response.data;
                
                // Apply action filter
                if (filter !== 'all') {
                    filteredHistory = filteredHistory.filter(entry => entry.action === filter);
                }
                
                // Apply date filter
                if (dateFilter) {
                    const filterDate = new Date(dateFilter);
                    filteredHistory = filteredHistory.filter(entry => {
                        const entryDate = new Date(entry.timestamp);
                        return entryDate.toDateString() === filterDate.toDateString();
                    });
                }
                
                // Calculate pagination
                const totalFiltered = filteredHistory.length;
                const totalPagesCalculated = Math.ceil(totalFiltered / ITEMS_PER_PAGE);
                setTotalPages(totalPagesCalculated);
                
                // Apply pagination
                const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                const endIndex = startIndex + ITEMS_PER_PAGE;
                const paginatedHistory = filteredHistory.slice(startIndex, endIndex);
                
                setHistory(paginatedHistory);
            } else {
                throw new Error(response.message || 'Erro ao carregar histórico');
            }
        } catch (err: any) {
            console.error('Error loading history:', err);
            setError(err.message || 'Erro ao carregar histórico');
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const response = await historyService.getHistoryStats();
            if (response.success && response.data) {
                setStats(response.data);
            }
        } catch (err: any) {
            console.error('Error loading stats:', err);
        }
    };

    const loadProducts = async () => {
        try {
            const response = await productService.getAll({ limit: 100 });
            if (response.success && response.data) {
                setProducts(response.data);
            }
        } catch (err: any) {
            console.error('Error loading products:', err);
        }
    };

    const getProductById = (id: string): Product | undefined => {
        return products.find(product => product._id === id);
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('pt-BR');
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'CREATE': return 'text-green-600 bg-green-50 px-2 py-1 rounded-full';
            case 'UPDATE': return 'text-orange-600 bg-orange-50 px-2 py-1 rounded-full';
            case 'DELETE': return 'text-red-600 bg-red-50 px-2 py-1 rounded-full';
            default: return 'text-gray-600 bg-gray-50 px-2 py-1 rounded-full';
        }
    };

    const getActionLabel = (action: string) => {
        switch (action) {
            case 'CREATE': return 'Criado';
            case 'UPDATE': return 'Atualizado';
            case 'DELETE': return 'Removido';
            default: return action;
        }
    };

    const hasRealChange = (change: { field: string; oldValue?: any; newValue?: any }) => {
        if (change.field === 'price') {
            const oldPrice = change.oldValue !== null && change.oldValue !== undefined ? change.oldValue.toFixed(2) : '0.00';
            const newPrice = change.newValue !== null && change.newValue !== undefined ? change.newValue.toFixed(2) : '0.00';
            return oldPrice !== newPrice;
        }
        
        if (change.field === 'stock') {
            const oldStock = change.oldValue || 0;
            const newStock = change.newValue || 0;
            return oldStock !== newStock;
        }
        
        return change.oldValue !== change.newValue;
    };

    const formatChange = (change: { field: string; oldValue?: any; newValue?: any }) => {
        const fieldLabels: { [key: string]: string } = {
            name: 'Nome',
            stock: 'Estoque',
            price: 'Preço',
            category: 'Categoria',
            isActive: 'Status',
            description: 'Descrição'
        };

        const fieldName = fieldLabels[change.field] || change.field;
        
        if (change.field === 'price') {
            const oldPrice = change.oldValue !== null && change.oldValue !== undefined ? change.oldValue.toFixed(2) : '0.00';
            const newPrice = change.newValue !== null && change.newValue !== undefined ? change.newValue.toFixed(2) : '0.00';
            return `${fieldName}: R$ ${oldPrice} → R$ ${newPrice}`;
        }
        
        if (change.field === 'isActive') {
            const oldStatus = change.oldValue ? 'Ativo' : 'Inativo';
            const newStatus = change.newValue ? 'Ativo' : 'Inativo';
            return `${fieldName}: ${oldStatus} → ${newStatus}`;
        }
        
        if (change.field === 'stock') {
            const oldStock = change.oldValue || 0;
            const newStock = change.newValue || 0;
            return `${fieldName}: ${oldStock} → ${newStock}`;
        }
        
        return `${fieldName}: ${change.oldValue || 'N/A'} → ${change.newValue || 'N/A'}`;
    };

    const getChangesWithDifferences = (changes: Array<{ field: string; oldValue?: any; newValue?: any }>) => {
        return changes.filter(change => hasRealChange(change));
    };

    if (loading && history.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className="ml-2 text-gray-600">Carregando histórico...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Title and Filters */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Histórico de Alterações</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Registro de todas as alterações nos produtos da lojinha
                    </p>
                </div>
                
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => {
                                setDateFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Filtrar por data"
                        />
                        {dateFilter && (
                            <button
                                onClick={() => {
                                    setDateFilter('');
                                    setCurrentPage(1);
                                }}
                                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Limpar
                            </button>
                        )}
                        <select
                            value={filter}
                            onChange={(e) => {
                                setFilter(e.target.value as any);
                                setCurrentPage(1);
                            }}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="all">Todas as ações</option>
                            <option value="CREATE">Produtos criados</option>
                            <option value="UPDATE">Produtos atualizados</option>
                            <option value="DELETE">Produtos removidos</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3">
                        <img 
                            src={erroIcon} 
                            alt="Erro" 
                            className="w-12 h-12 object-contain"
                        />
                        <div>
                            <h3 className="text-red-900 font-medium">Erro ao carregar histórico</h3>
                            <p className="text-red-700 text-sm mt-1">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="text-2xl font-bold text-gray-900">{stats.totalEntries}</div>
                        <div className="text-sm text-gray-600">Total de movimentações</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="text-2xl font-bold text-green-600">{stats.actionCounts.CREATE}</div>
                        <div className="text-sm text-gray-600">Produtos criados</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="text-2xl font-bold text-orange-600">{stats.actionCounts.UPDATE}</div>
                        <div className="text-sm text-gray-600">Produtos atualizados</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="text-2xl font-bold text-red-600">{stats.actionCounts.DELETE}</div>
                        <div className="text-sm text-gray-600">Produtos removidos</div>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-4 mb-6">
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
                </div>
            )}

            {/* History List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Movimentações Recentes
                    </h3>
                    
                    {history.length > 0 ? (
                        <div className="space-y-4">
                            {history.map((entry) => {
                                const product = getProductById(entry.entityId);
                                return (
                                    <div key={entry._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-4 flex-1">
                                                {/* Product Image */}
                                                <div className="flex-shrink-0">
                                                    {product ? (
                                                        <img 
                                                            className="h-12 w-12 rounded-lg object-cover" 
                                                            src={getProductImageUrl(product)} 
                                                            alt={entry.entityName}
                                                        />
                                                    ) : (
                                                        <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                                            <span className="text-gray-400 text-xs">N/A</span>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Product Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <h4 className="font-medium text-gray-900 truncate">
                                                            {entry.entityName}
                                                        </h4>
                                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getActionColor(entry.action)}`}>
                                                            {getActionLabel(entry.action)}
                                                        </span>
                                                    </div>
                                                    
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        {typeof entry.details === 'string' ? entry.details : 'Movimentação registrada'}
                                                    </p>
                                                    
                                                    {/* Changes */}
                                                    <div className="text-sm text-gray-800">
                                                        {(() => {
                                                            const realChanges = getChangesWithDifferences(entry.changes);
                                                            if (realChanges.length === 0) {
                                                                return (
                                                                    <span className="text-gray-500 italic">
                                                                        Nenhum campo foi alterado nesta operação
                                                                    </span>
                                                                );
                                                            }
                                                            return realChanges.map((change, index) => (
                                                                <div key={index} className="text-gray-600">
                                                                    • {formatChange(change)}
                                                                </div>
                                                            ));
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Timestamp */}
                                            <div className="text-xs text-gray-500 ml-4 flex-shrink-0">
                                                {formatDate(entry.timestamp)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-3">
                                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Nenhuma movimentação encontrada
                            </h3>
                            <p className="text-gray-500">
                                Quando produtos forem criados, editados ou removidos, aparecerão aqui.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryManagement;