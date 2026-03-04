import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../auth/AuthContext';
import StatsManagement from './StatsManagement';
import ProductsManagement from './ProductsManagement';
import OrdersManagement from './OrdersManagement';
import HistoryManagement from './HistoryManagement';
import PixManagement from './PixManagement';
import perryGerente from '../../../assets/lojinha-icons/perrys/gerente.png';

type TabType = 'stats' | 'products' | 'orders' | 'pix' | 'history';

const LojinhaGerenciamento: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType | null>(null);
    const navigate = useNavigate();

    // Verifica permissões
    const hasStatsPermission = user?.permissions?.includes('lojinha:stats') || false;
    const hasProductsPermission = user?.permissions?.includes('lojinha:product-management') || false;
    const hasOrdersPermission = user?.permissions?.includes('lojinha:orders-log') || false;
    const hasPixPermission = user?.permissions?.includes('lojinha:pix-key-management') || false;
    const hasHistoryPermission = user?.permissions?.includes('lojinha:entries-log') || false;

    // Define a aba inicial com base nas permissões
    useEffect(() => {
        if (!activeTab) {
            if (hasStatsPermission) setActiveTab('stats');
            else if (hasProductsPermission) setActiveTab('products');
            else if (hasOrdersPermission) setActiveTab('orders');
            else if (hasPixPermission) setActiveTab('pix');
            else if (hasHistoryPermission) setActiveTab('history');
        }
    }, [activeTab, hasStatsPermission, hasProductsPermission, hasOrdersPermission, hasPixPermission, hasHistoryPermission]);

    console.log('LojinhaGerenciamento renderizado, activeTab:', activeTab);

    const renderTabContent = () => {
        try {
            switch (activeTab) {
                case 'stats':
                    return <StatsManagement onGoToProducts={hasProductsPermission ? () => setActiveTab('products') : undefined} />;
                case 'products':
                    return <ProductsManagement />;
                case 'orders':
                    return <OrdersManagement onGoToProducts={hasProductsPermission ? () => setActiveTab('products') : undefined} />;
                case 'pix':
                    return <PixManagement />;
                case 'history':
                    return <HistoryManagement onGoToProducts={hasProductsPermission ? () => setActiveTab('products') : undefined} />;
                default:
                    return <StatsManagement />;
            }
        } catch (error) {
            console.error('Erro ao renderizar aba:', error);
            return (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="text-red-900 font-medium">Erro ao carregar conteúdo</div>
                    <p className="text-red-700 text-sm mt-1">{error instanceof Error ? error.message : 'Erro desconhecido'}</p>
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center py-6 space-y-4 lg:space-y-0">
                        <div className="flex items-center space-x-3">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Gerenciamento da Lojinha
                            </h1>
                            <img 
                                src={perryGerente} 
                                alt="Perry Gerente" 
                                className="w-16 h-16 object-contain drop-shadow-lg"
                            />
                        </div>
                        <button
                            onClick={() => navigate('/lojinha')}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm w-fit"
                        >
                            <svg 
                                className="w-4 h-4" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                                />
                            </svg>
                            <span>Voltar para Lojinha</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {hasStatsPermission && (
                            <button
                                onClick={() => setActiveTab('stats')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                    activeTab === 'stats'
                                        ? 'border-green-500 text-green-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Estatísticas
                            </button>
                        )}
                        {hasProductsPermission && (
                            <button
                                onClick={() => setActiveTab('products')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                    activeTab === 'products'
                                        ? 'border-green-500 text-green-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Produtos
                            </button>
                        )}
                        {hasOrdersPermission && (
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                    activeTab === 'orders'
                                        ? 'border-green-500 text-green-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Pedidos
                            </button>
                        )}
                        {hasPixPermission && (
                            <button
                                onClick={() => setActiveTab('pix')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                    activeTab === 'pix'
                                        ? 'border-green-500 text-green-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                PIX
                            </button>
                        )}
                        {hasHistoryPermission && (
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                    activeTab === 'history'
                                        ? 'border-green-500 text-green-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Histórico
                            </button>
                        )}
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default LojinhaGerenciamento;
