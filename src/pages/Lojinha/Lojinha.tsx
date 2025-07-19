import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../auth/AuthContext';
import ProductCard from './components/ProductCard';
import CategoryTabs from './components/CategoryTabs';
import { getProducts } from './services/api';
import { Product, ProductFilters } from './types';
import inicio1 from "../../assets/lojinha-icons/perrys/inicio1.png";
import inicio2 from "../../assets/lojinha-icons/perrys/inicio2.png";
import erroIcon from "../../assets/lojinha-icons/perrys/ERRO.png";

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
                <div className="text-center mb-4 relative">
                    {/* Botão de Gerenciamento - Desktop: canto superior direito */}
                    {user?.permissions?.includes('users:edit') && (
                        <div className="absolute top-0 right-0 hidden md:block">
                            <Link 
                                to="/lojinha/admin"
                                className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition duration-200 flex items-center gap-2 text-base"
                            >
                                <span>Gerenciar</span>
                            </Link>
                        </div>
                    )}
                    
                    <div className="flex flex-col items-center justify-center mb-4">
                        <div className="flex items-center justify-center space-x-4 md:space-x-8 mb-4">
                                                        <img 
                                src={inicio1} 
                                alt="Perry da Lojinha 1" 
                                className="w-20 h-20 md:w-32 md:h-32 object-contain drop-shadow-lg"
                            />
                            <div className="text-center">
                                <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">Lojinha SAEComp</h1>
                                <p className="text-lg md:text-xl text-gray-600 hidden sm:block">
                                    Deliciosos doces, salgados e bebidas
                                </p>
                            </div>
                                                                                    <img 
                                src={inicio2} 
                                alt="Perry da Lojinha 2" 
                                className="w-20 h-20 md:w-32 md:h-32 object-contain drop-shadow-lg"
                            />
                        </div>
                        
                        {/* Botão de Gerenciamento - Mobile: abaixo dos Perry, centralizado */}
                        {user?.permissions?.includes('users:edit') && (
                            <div className="block md:hidden">
                                <Link 
                                    to="/lojinha/admin"
                                    className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg font-medium transition duration-200 flex items-center gap-1 text-sm"
                                >
                                    <span>Gerenciar</span>
                                </Link>
                            </div>
                        )}
                    </div>
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
                        <div className="rounded-lg p-6 max-w-md mx-auto">
                            <img 
                                src={erroIcon} 
                                alt="Erro" 
                                className="w-24 h-24 md:w-28 md:h-28 mx-auto mb-4 object-contain drop-shadow-lg"
                            />
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
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
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

export default Lojinha;
