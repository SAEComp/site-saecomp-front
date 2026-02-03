import React from 'react';
import { AdminOrder } from '../../../types';

interface OrderDetailsModalProps {
    order: AdminOrder | null;
    onClose: () => void;
    formatCurrency: (value: number) => string;
    formatDate: (dateString: string) => string;
    getFirstAndLastName: (fullName: string) => string;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
    order,
    onClose,
    formatCurrency,
    formatDate,
    getFirstAndLastName
}) => {
    if (!order) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Detalhes do Pedido #{order._id?.slice(-8) || order.id}
                        </h2>
                        <button
                            onClick={onClose}
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
                                        <p className="text-sm text-gray-900">{getFirstAndLastName(order.customerName || '')}</p>
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
                                        {(order.items ?? []).map((item, index) => (
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
                                            <td className="px-4 py-3 text-sm font-bold text-green-600">{formatCurrency(order.totalAmount ?? 0)}</td>
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
                                    order.status === 'finishedPayment' 
                                        ? 'bg-green-100 text-green-800'
                                        : order.status === 'canceled'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {order.status === 'finishedPayment' ? 'Concluído' : 
                                     order.status === 'canceled' ? 'Cancelado' : 'Pendente'}
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
                                        <p className="text-sm text-gray-900">{formatDate(order.createdAt?.toString() ?? new Date().toISOString())}</p>
                                    </div>
                                    {order.confirmedAt && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Data de Confirmação</p>
                                            <p className="text-sm text-gray-900">{formatDate(typeof order.confirmedAt === 'string' ? order.confirmedAt : order.confirmedAt.toISOString())}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
