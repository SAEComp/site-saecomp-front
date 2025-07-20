import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import ProductsManagement from './components/ProductsManagement';
import OrdersManagement from './components/OrdersManagement';
import StatsManagement from './components/StatsManagement';
import perryGerente from '../../assets/lojinha-icons/perrys/gerente.png';

type TabType = 'stats' | 'products' | 'orders';

const LojinhaGerenciamento: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('stats');
    const navigate = useNavigate();

    const renderTabContent = () => {
        switch (activeTab) {
            case 'stats':
                return <StatsManagement />;
            case 'products':
                return <ProductsManagement />;
            case 'orders':
                return <OrdersManagement />;
            default:
                return <StatsManagement />;
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
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('stats')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'stats'
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Estatísticas
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'products'
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Produtos
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'orders'
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Pedidos
                        </button>
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
