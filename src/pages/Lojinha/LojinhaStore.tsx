import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../auth/AuthContext';
import ProductCard from './components/ProductCard';
import CategoryTabs from './components/CategoryTabs';
import { getProducts } from './services/api';
import { Product, ProductFilters } from './types';

const LojinhaStore = () => {
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
                <div className="text-center mb-8">
                    <div className="flex flex-col items-center justify-center mb-4">
                        <div className="flex items-center justify-center space-x-4 mb-2">
                            <h1 className="text-4xl font-bold text-gray-800">Lojinha SAEComp</h1>
                        </div>
                        {user?.permissions?.includes('users:edit') && (
                            <Link 
                                to="/lojinha/admin"
                                className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition duration-200 flex items-center gap-2"
                            >
                                Gerenciar Lojinha
                            </Link>
                        )}
                    </div>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Deliciosos doces, salgados e bebidas
                    </p>
                </div>
                
                <CategoryTabs 
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                />
                
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#03B04B] mb-4"></div>
                        <p className="text-gray-600">Carregando produtos...</p>
                    </div>
                )}
                
                {error && (
                    <div className="text-center py-12">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                            <p className="text-red-700 mb-4">{error}</p>
                            <button 
                                onClick={() => loadProducts(selectedCategory)} 
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    </div>
                )}
                
                {!loading && !error && (
                    <div className="mb-8">
                        {products.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="bg-gray-100 rounded-lg p-8 max-w-md mx-auto">
                                    <span className="text-4xl mb-4 block"></span>
                                    <p className="text-gray-600 text-lg">
                                        Nenhum produto encontrado nesta categoria.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LojinhaStore;
