import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../auth/AuthContext';
import { CategoryTabs, LoadingState, ErrorState, EmptyState } from '../componentes';
import { HomeHeader, ProductGrid } from './components';
import { getProducts, punctuationService } from '../services/api';
import { Product, ProductFilters } from '../types';
import emptyImage from '../../../assets/lojinha-icons/perrys/pngwing.com.png';

const Lojinha = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'sweet' | 'salty' | 'drink'>('all');

    const loadProducts = useCallback(async (category: 'all' | 'sweet' | 'salty' | 'drink') => {
        try {
            setLoading(true);
            setError(null);
            
            const filters: ProductFilters | undefined = category !== 'all' 
                ? { category }
                : undefined;
            
            const response = await getProducts(filters);
            
            if (response.data) {
                setProducts(response.data);
            } else {
                setProducts([]);
            }
        } catch (err) {
            console.error('Error loading products:', err);
            setError('Erro ao carregar produtos. Tente novamente.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts(selectedCategory);
        loadUserPoints();
    }, [selectedCategory, loadProducts]);

    const loadUserPoints = async () => {
        try {
            const response = await punctuationService.getUserPoints();
            
            if (response.success && response.data) {
                // setUserPoints(response.data.userPunctuation || 0); // TODO: Usar quando implementar display de pontos
                console.log('Pontos do usuário:', response.data.userPunctuation);
            }
        } catch (err: any) {
            console.error('Erro ao carregar pontuação do usuário:', err);
            // setUserPoints(0);
        }
    };

    const handleCategoryChange = useCallback((category: 'all' | 'sweet' | 'salty' | 'drink') => {
        if (category !== selectedCategory) {
            setSelectedCategory(category);
        }
    }, [selectedCategory]);

    return (
        <div className="min-h-screen bg-gray-50 relative">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <HomeHeader hasAdminPermission={user?.permissions?.includes('users:edit') || false} />
                
                <CategoryTabs 
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                />
                
                {loading && <LoadingState message="Carregando produtos..." />}
                
                {error && (
                    <ErrorState 
                        error={error} 
                        onRetry={() => loadProducts(selectedCategory)} 
                    />
                )}
                
                {!loading && !error && (
                    <div className="mb-8">
                        {products.length === 0 ? (
                            <EmptyState 
                                image={emptyImage}
                                message={selectedCategory === 'all' 
                                    ? "Nenhum produto disponível no momento. A lojinha está vazia!"
                                    : "Nenhum produto encontrado nesta categoria."}
                            />
                        ) : (
                            <ProductGrid products={products} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Lojinha;
