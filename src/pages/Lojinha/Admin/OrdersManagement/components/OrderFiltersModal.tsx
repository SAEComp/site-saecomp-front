import React from 'react';
import { Product } from '../../../types';

interface OrderFiltersModalProps {
    isOpen: boolean;
    filters: {
        customerName: string;
        items: string[];
        minTotal: string;
        maxTotal: string;
        startDate: string;
        endDate: string;
        status: string;
    };
    allCustomers: string[];
    allProducts: Product[];
    onClose: () => void;
    onApply: () => void;
    onClear: () => void;
    onFilterChange: (filters: any) => void;
    onMinTotalChange: (value: string) => void;
    onMaxTotalChange: (value: string) => void;
}

export const OrderFiltersModal: React.FC<OrderFiltersModalProps> = ({
    isOpen,
    filters,
    allCustomers,
    allProducts,
    onClose,
    onApply,
    onClear,
    onFilterChange,
    onMinTotalChange,
    onMaxTotalChange
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Filtros Avançados</h2>
                        <button
                            onClick={onClose}
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
                                onChange={(e) => onFilterChange({ ...filters, customerName: e.target.value })}
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
                                onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
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
                                                        const newItems = e.target.checked
                                                            ? [...filters.items, product.name]
                                                            : filters.items.filter(item => item !== product.name);
                                                        onFilterChange({ ...filters, items: newItems });
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
                                    onChange={(e) => onMinTotalChange(e.target.value)}
                                    placeholder="Mínimo"
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03B04B] focus:border-[#03B04B]"
                                />
                                <input
                                    type="text"
                                    value={filters.maxTotal}
                                    onChange={(e) => onMaxTotalChange(e.target.value)}
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
                                        onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03B04B] focus:border-[#03B04B]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Até</label>
                                    <input
                                        type="date"
                                        value={filters.endDate}
                                        onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03B04B] focus:border-[#03B04B]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between pt-6 border-t border-gray-200 mt-6">
                        <button
                            onClick={onClear}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Limpar Filtros
                        </button>
                        <div className="flex space-x-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={onApply}
                                className="px-4 py-2 bg-[#03B04B] text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Aplicar Filtros
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
