import React from 'react';
import { Order } from '../../../types';
import { Table, ITableColumn } from '../../../../../components/Inputs';

interface RecentOrdersTableProps {
    recentOrders: Order[];
    formatCurrency: (value: number) => string;
    formatDate: (dateString: string) => string;
    getFirstAndLastName: (fullName: string) => string;
}

const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({
    recentOrders,
    formatCurrency,
    formatDate,
    getFirstAndLastName
}) => {
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

    const recentOrdersColumns: ITableColumn<Order>[] = [
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
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </div>
                    <div className="text-xs text-gray-500 max-w-xs truncate">
                        {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                    </div>
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
                    {formatDate(order.createdAt)}
                </div>
            )
        }
    ];

    return (
        <div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">Pedidos Recentes</h2>
            <Table<Order>
                columns={recentOrdersColumns}
                data={recentOrders}
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
    );
};

export default RecentOrdersTable;
