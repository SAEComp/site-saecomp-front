import { useState, useEffect } from 'react';
import { useAuth } from '../../../../auth/AuthContext';
import { adminService } from '../../services/api';
import { Product } from '../../types';
import erroIcon from '../../../../assets/lojinha-icons/perrys/ERRO.png';
import { EmptyDatabaseMessage } from '../../componentes/EmptyDatabaseMessage';
import { useProductsCheck } from '../../hooks/useProductsCheck';
import { 
    StatsCards, 
    TopProductsTables, 
    RecentOrdersTable, 
    getFirstAndLastName, 
    formatCurrency, 
    formatDate 
} from './components';

interface StatsData {
    totalOrders: number;
    totalRevenue: number;
    completedOrders: number;
    totalItemsSold: number;
    totalProductsInStock: number;
    maxPotentialRevenue?: number;
    productsWithMoreSoldQuantity?: any[];
    productsWithMoreRevenueValue?: any[];
    topProducts: Array<{
        product: Product;
        totalSold: number;
        revenue: number;
    }>;
    recentOrders: any[];
}

const StatsManagement: React.FC = () => {
    const { user } = useAuth();
    const { hasProducts, isChecking } = useProductsCheck();
    const [stats, setStats] = useState<StatsData | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Verifica se o usuário tem permissão para ver pedidos
    const hasOrdersPermission = user?.permissions?.includes('lojinha:orders-log') || false;

    useEffect(() => {
        if (hasProducts) {
            loadStats();
        } else if (hasProducts === false) {
            setLoading(false);
        }
    }, [hasProducts]);

    const loadStats = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fazer chamadas condicionais baseadas nas permissões
            const promises: [
                Promise<any>,
                Promise<any>,
                Promise<any> | null
            ] = [
                adminService.getStats(),
                (await import('../../services/api')).productService.getAll({ pageSize: 100, includeInactive: true }),
                hasOrdersPermission ? (await import('../../services/api')).orderService.getAll({ limit: 5, status: undefined }) : null
            ];
            
            const [statsResponse, productsResponse, ordersResponse] = await Promise.all(promises.filter(p => p !== null));
            
            const response = statsResponse;
            console.log('Stats response:', response);
            if (response.success && response.data) {
                // Mapear os campos do backend para o formato esperado pelo frontend
                const statsData = {
                    totalOrders: response.data.totalOrders || 0,
                    totalRevenue: response.data.totalRevenueValue || 0,
                    completedOrders: response.data.finishedOrders || 0,
                    canceledOrders: response.data.canceledOrders || 0,
                    totalItemsSold: response.data.soldItems || 0,
                    totalProductsInStock: response.data.stockProducts || 0,
                    maxPotentialRevenue: response.data.maxPotentialRevenue || 0,
                    productsWithMoreSoldQuantity: response.data.productsWithMoreSoldQuantity || [],
                    productsWithMoreRevenueValue: response.data.productsWithMoreRevenueValue || [],
                    topProducts: [], // Legacy field
                    recentOrders: hasOrdersPermission && ordersResponse?.success && ordersResponse?.data ? ordersResponse.data.slice(0, 5) : []
                };
                console.log('Stats data processed:', statsData);
                setStats(statsData);
                
                if (productsResponse.success && productsResponse.data) {
                    setProducts(productsResponse.data);
                }
            } else {
                throw new Error(response.message || 'Erro ao carregar estatísticas');
            }
        } catch (err: any) {
            console.error('Error loading stats:', err);
            setError(err.message || 'Erro ao carregar estatísticas');
        } finally {
            setLoading(false);
        }
    };

    const getProductById = (id: number): Product | undefined => {
        return products.find(p => p.id === id);
    };

    if (isChecking || loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#03B04B]"></div>
                    <span className="text-gray-600">Carregando estatísticas...</span>
                </div>
            </div>
        );
    }

    if (hasProducts === false) {
        return <EmptyDatabaseMessage featureName="Estatísticas" />;
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
                        Erro ao carregar estatísticas
                    </h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        onClick={loadStats}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium shadow-sm"
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Nenhuma estatística disponível</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <StatsCards stats={stats} formatCurrency={formatCurrency} />

            <TopProductsTables
                productsWithMoreSoldQuantity={stats.productsWithMoreSoldQuantity || []}
                productsWithMoreRevenueValue={stats.productsWithMoreRevenueValue || []}
                getProductById={getProductById}
                formatCurrency={formatCurrency}
            />

            <RecentOrdersTable
                recentOrders={stats.recentOrders}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                getFirstAndLastName={getFirstAndLastName}
            />
        </div>
    );
};

export default StatsManagement;
