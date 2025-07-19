import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Product } from './types';
import { useCart } from './hooks/useCart';
import { productService } from './services/api';
import StockIndicator from './components/StockIndicator';
import { getProductImageUrl } from './utils/imageUtils';
import erroIcon from '../../assets/lojinha-icons/perrys/ERRO.png';

const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addItem } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) {
                setError('Product ID not found');
                setLoading(false);
                return;
            }

            try {
                const response = await productService.getById(id);
                if (response.data) {
                    setProduct(response.data);
                } else {
                    setError('Produto não encontrado');
                }
            } catch (err: any) {
                setError(err.message || 'Failed to fetch product details');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            // Add product to cart multiple times based on quantity
            for (let i = 0; i < quantity; i++) {
                addItem(product);
            }
            // Redirect back to main lojinha menu
            navigate('/lojinha');
        }
    };

    const handleBackToStore = () => {
        navigate('/lojinha');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#03B04B] mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando produto...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto p-6">
                    <img 
                        src={erroIcon} 
                        alt="Erro" 
                        className="w-28 h-28 md:w-32 md:h-32 mx-auto mb-4 object-contain drop-shadow-lg"
                    />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {error ? 'Erro' : 'Produto não encontrado'}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {error || 'O produto que você está procurando não existe.'}
                    </p>
                    <button 
                        onClick={handleBackToStore}
                        className="bg-[#03B04B] text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Voltar à loja
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-2 md:py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <button 
                    onClick={handleBackToStore}
                    className="mb-3 md:mb-6 flex items-center text-[#03B04B] hover:text-green-600 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Voltar
                </button>
                
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        {/* Product Image */}
                        <div className="w-full lg:w-1/2">
                            <div className="aspect-[5/3] md:aspect-square bg-gray-50 p-1 md:p-8 flex items-center justify-center">
                                <img 
                                    src={getProductImageUrl(product)} 
                                    alt={product.name}
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                                />
                            </div>
                        </div>
                        
                        {/* Product Info */}
                        <div className="w-full lg:w-1/2 p-3 md:p-8">
                            <div className="mb-2 md:mb-4">
                                <h1 className="text-lg md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">{product.name}</h1>
                                <p className="text-xs md:text-sm text-[#03B04B] font-medium uppercase tracking-wider">
                                    {product.category}
                                </p>
                            </div>
                            
                            <p className="text-sm md:text-base text-gray-700 mb-3 md:mb-6 leading-relaxed">
                                {product.description}
                            </p>
                            
                            <div className="text-xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-6">
                                R$ {product.price.toFixed(2)}
                            </div>
                            
                            <div className="mb-3 md:mb-8">
                                <StockIndicator stock={product.stock} showWarning={true} />
                            </div>
                            
                            {product.stock > 0 && (
                                <div className="space-y-3 md:space-y-6">
                                    {/* Quantity Selector */}
                                    <div>
                                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                                            Quantidade:
                                        </label>
                                        <div className="flex items-center space-x-3 justify-center md:justify-start">
                                            <button 
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                disabled={quantity <= 1}
                                                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <input
                                                id="quantity"
                                                type="number"
                                                min="1"
                                                max={product.stock}
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                                                className="w-20 h-10 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03B04B] focus:border-[#03B04B]"
                                            />
                                            <button 
                                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                                disabled={quantity >= product.stock}
                                                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Add to Cart Button */}
                                    <button 
                                        className="w-full bg-[#03B04B] text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 sticky bottom-4 md:static"
                                        onClick={handleAddToCart}
                                    >
                                        <span>Adicionar ao Carrinho</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
