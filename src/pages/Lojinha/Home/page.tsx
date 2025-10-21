import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../auth/AuthContext';
import { CategoryTabs, LoadingState, ErrorState, EmptyState } from '../componentes';
import { HomeHeader, ProductGrid } from './components';
import { getProducts } from '../services/api';
import { Product, ProductFilters } from '../types';

const Lojinha = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'doces' | 'salgados' | 'bebidas'>('all');

    const loadProducts = useCallback(async (category: 'all' | 'doces' | 'salgados' | 'bebidas') => {
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
    }, [selectedCategory, loadProducts]);

    const handleCategoryChange = useCallback((category: 'all' | 'doces' | 'salgados' | 'bebidas') => {
        if (category !== selectedCategory) {
            setSelectedCategory(category);
        }
    }, [selectedCategory]);

    return (
        <div className="min-h-screen bg-gray-50">
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
                                icon="🍽️"
                                message="Nenhum produto encontrado nesta categoria."
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
