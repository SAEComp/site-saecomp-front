import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { Link } from 'react-router';

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    available: boolean;
    description: string;
}

interface Order {
    id: number;
    customerName: string;
    items: string[];
    total: number;
    status: 'pending' | 'preparing' | 'ready' | 'completed';
    createdAt: string;
}

const LojinhaGerenciamento = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'stats'>('products');
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);

    // Mock data para demonstração
    useEffect(() => {
        // Simular dados de produtos
        setProducts([
            { id: 1, name: 'Brigadeiro', price: 2.50, category: 'Doces', available: true, description: 'Brigadeiro tradicional' },
            { id: 2, name: 'Coxinha', price: 4.00, category: 'Salgados', available: true, description: 'Coxinha de frango' },
            { id: 3, name: 'Refrigerante', price: 3.50, category: 'Bebidas', available: false, description: 'Coca-Cola 350ml' },
        ]);

        // Simular dados de pedidos
        setOrders([
            { id: 1, customerName: 'João Silva', items: ['2x Brigadeiro', '1x Coxinha'], total: 9.00, status: 'pending', createdAt: '2025-07-17T10:30:00' },
            { id: 2, customerName: 'Maria Santos', items: ['1x Refrigerante', '3x Brigadeiro'], total: 11.00, status: 'ready', createdAt: '2025-07-17T11:15:00' },
        ]);
    }, []);

    const toggleProductAvailability = (productId: number) => {
        setProducts(products.map(product => 
            product.id === productId 
                ? { ...product, available: !product.available }
                : product
        ));
    };

    const updateOrderStatus = (orderId: number, newStatus: Order['status']) => {
        setOrders(orders.map(order => 
            order.id === orderId 
                ? { ...order, status: newStatus }
                : order
        ));
    };

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'preparing': return 'bg-green-100 text-green-800';
            case 'ready': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: Order['status']) => {
        switch (status) {
            case 'pending': return 'Pendente';
            case 'preparing': return 'Preparando';
            case 'ready': return 'Pronto';
            case 'completed': return 'Entregue';
            default: return 'Desconhecido';
        }
    };

    // Estatísticas mockadas
    const stats = {
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        readyOrders: orders.filter(o => o.status === 'ready').length,
        totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
        availableProducts: products.filter(p => p.available).length,
        totalProducts: products.length,
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                Gerenciamento da Lojinha
                            </h1>
                            <p className="text-gray-600">
                                Bem-vindo, {user?.name}! Gerencie produtos, pedidos e visualize estatísticas.
                            </p>
                        </div>
                        <Link 
                            to="/lojinha"
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition duration-200 flex items-center gap-2"
                        >
                            ← Voltar para Lojinha
                        </Link>
                    </div>
                </div>

                {/* Navegação por abas */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('products')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'products'
                                        ? 'border-[#03B04B] text-[#03B04B]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Produtos
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'orders'
                                        ? 'border-[#03B04B] text-[#03B04B]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Pedidos
                            </button>
                            <button
                                onClick={() => setActiveTab('stats')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'stats'
                                        ? 'border-[#03B04B] text-[#03B04B]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Estatísticas
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Conteúdo das abas */}
                {activeTab === 'products' && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Gerenciar Produtos</h2>
                            <button className="bg-[#03B04B] hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition">
                                + Adicionar Produto
                            </button>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                    <div className="text-sm text-gray-500">{product.description}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ {product.price.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    product.available 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {product.available ? 'Disponível' : 'Indisponível'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => toggleProductAvailability(product.id)}
                                                    className={`mr-2 px-3 py-1 rounded text-xs font-medium ${
                                                        product.available
                                                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    }`}
                                                >
                                                    {product.available ? 'Desativar' : 'Ativar'}
                                                </button>
                                                <button className="text-[#03B04B] hover:text-green-600">Editar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Gerenciar Pedidos</h2>
                        
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-lg font-medium text-gray-900">Pedido #{order.id}</h3>
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                    {getStatusText(order.status)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-1">Cliente: {order.customerName}</p>
                                            <p className="text-sm text-gray-600 mb-1">Itens: {order.items.join(', ')}</p>
                                            <p className="text-sm text-gray-600 mb-1">Total: R$ {order.total.toFixed(2)}</p>
                                            <p className="text-sm text-gray-500">
                                                Pedido em: {new Date(order.createdAt).toLocaleString('pt-BR')}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 flex space-x-2">
                                        {order.status === 'pending' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'preparing')}
                                                className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-medium hover:bg-green-200"
                                            >
                                                Iniciar Preparo
                                            </button>
                                        )}
                                        {order.status === 'preparing' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'ready')}
                                                className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-medium hover:bg-green-200"
                                            >
                                                Marcar como Pronto
                                            </button>
                                        )}
                                        {order.status === 'ready' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'completed')}
                                                className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm font-medium hover:bg-gray-200"
                                            >
                                                Marcar como Entregue
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'stats' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Pedidos Totais</h3>
                                <p className="text-3xl font-bold text-[#03B04B]">{stats.totalOrders}</p>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Pedidos Pendentes</h3>
                                <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Pedidos Prontos</h3>
                                <p className="text-3xl font-bold text-green-600">{stats.readyOrders}</p>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Receita Total</h3>
                                <p className="text-3xl font-bold text-[#03B04B]">R$ {stats.totalRevenue.toFixed(2)}</p>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Produtos Disponíveis</h3>
                                <p className="text-3xl font-bold text-[#03B04B]">{stats.availableProducts}/{stats.totalProducts}</p>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Resumo do Dia</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Status dos Pedidos</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Pendentes</span>
                                            <span className="text-sm font-medium">{stats.pendingOrders}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Em preparo</span>
                                            <span className="text-sm font-medium">{orders.filter(o => o.status === 'preparing').length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Prontos</span>
                                            <span className="text-sm font-medium">{stats.readyOrders}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Entregues</span>
                                            <span className="text-sm font-medium">{orders.filter(o => o.status === 'completed').length}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Produtos por Categoria</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Doces</span>
                                            <span className="text-sm font-medium">{products.filter(p => p.category === 'Doces').length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Salgados</span>
                                            <span className="text-sm font-medium">{products.filter(p => p.category === 'Salgados').length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Bebidas</span>
                                            <span className="text-sm font-medium">{products.filter(p => p.category === 'Bebidas').length}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LojinhaGerenciamento;
