import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useCart } from '../hooks/useCart';
import { productService } from '../services/api';
import { Product } from '../types';
import { getProductImageUrl } from '../utils/imageUtils';
import carrinhoIcon from '../../../assets/lojinha-icons/perrys/carrinho.png';
import ConfirmModal from '../../../components/Inputs/ConfirmModal';

const CartPage = () => {
    const { state, incrementItem, decrementItem, removeItem, clearCart, getTotalPrice, getTotalItems } = useCart();
    const [showClearModal, setShowClearModal] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await productService.getAll({ limit: 100, includeInactive: true });
                if (response.success && response.data) {
                    setProducts(response.data);
                }
            } catch (error) {
                console.error('Erro ao carregar produtos:', error);
            }
        };
        loadProducts();
    }, []);

    const handleRemoveItem = async (itemId: number) => {
        try {
            await removeItem(itemId);
        } catch (error) {
            console.error('Erro ao remover item:', error);
        }
    };

    const handleIncrementItem = async (productId: number) => {
        try {
            await incrementItem(productId);
        } catch (error) {
            console.error('Erro ao incrementar item:', error);
        }
    };

    const handleDecrementItem = async (productId: number) => {
        try {
            await decrementItem(productId);
        } catch (error) {
            console.error('Erro ao decrementar item:', error);
        }
    };

    const handleClearCart = () => {
        setShowClearModal(true);
    };

    const confirmClearCart = async () => {
        setShowClearModal(false);
        try {
            await clearCart();
        } catch (error) {
            console.error('Erro ao limpar carrinho:', error);
        }
    };

    if (state.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <img 
                            src={carrinhoIcon} 
                            alt="Carrinho vazio" 
                            className="w-28 h-28 md:w-32 md:h-32 mx-auto mb-4 object-contain drop-shadow-lg"
                        />
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Seu carrinho está vazio</h2>
                        <p className="text-gray-600 mb-6">Adicione alguns produtos deliciosos ao seu carrinho!</p>
                        <Link 
                            to="/lojinha" 
                            className="bg-[#03B04B] hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                        >
                            Continuar Comprando
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Meu Carrinho</h1>
                    <button 
                        onClick={handleClearCart} 
                        className="hidden md:block bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition duration-200"
                    >
                        Limpar Carrinho
                    </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {state.items.map(item => {
                            const product = products.find(p => p.id === item.productId);
                            return (
                                <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                                    {/* Layout Mobile - Vertical */}
                                    <div className="flex flex-col sm:hidden gap-4">
                                        <div className="flex items-start gap-3">
                                            <img 
                                                src={product ? getProductImageUrl(product) : `https://via.placeholder.com/80x80/e0e0e0/666666?text=${encodeURIComponent(item.productName)}`}
                                                alt={item.productName}
                                                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base font-semibold text-gray-800">{item.productName}</h3>
                                                <p className="text-[#03B04B] font-bold mt-1">R$ {item.value.toFixed(2)}</p>
                                                {item.productStock < 5 && (
                                                    <p className="text-xs text-orange-600 mt-1">
                                                        Restam apenas {item.productStock} unidades
                                                    </p>
                                                )}
                                            </div>
                                            <button 
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="p-2 text-red-600 hover:text-red-800 rounded-lg transition-colors"
                                                title="Remover item"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleDecrementItem(item.productId)}
                                                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                                >
                                                    <span className="text-gray-700 font-medium">−</span>
                                                </button>
                                                <span className="w-10 text-center font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleIncrementItem(item.productId)}
                                                    disabled={item.quantity >= item.productStock}
                                                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <span className="text-gray-700 font-medium">+</span>
                                                </button>
                                            </div>
                                            <p className="text-lg font-bold text-gray-800">
                                                R$ {(item.value * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Layout Desktop - Horizontal */}
                                    <div className="hidden sm:flex items-center gap-4">
                                        <img 
                                            src={product ? getProductImageUrl(product) : `https://via.placeholder.com/80x80/e0e0e0/666666?text=${encodeURIComponent(item.productName)}`}
                                            alt={item.productName}
                                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-gray-800">{item.productName}</h3>
                                            <p className="text-[#03B04B] font-bold mt-1">R$ {item.value.toFixed(2)}</p>
                                            {item.productStock < 5 && (
                                                <p className="text-xs text-orange-600 mt-1">
                                                    Restam apenas {item.productStock} unidades
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleDecrementItem(item.productId)}
                                                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                            >
                                                <span className="text-gray-700 font-medium text-lg">−</span>
                                            </button>
                                            <span className="w-12 text-center font-medium text-lg">{item.quantity}</span>
                                            <button
                                                onClick={() => handleIncrementItem(item.productId)}
                                                disabled={item.quantity >= item.productStock}
                                                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <span className="text-gray-700 font-medium text-lg">+</span>
                                            </button>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-2">
                                            <p className="text-lg font-bold text-gray-800">
                                                R$ {(item.value * item.quantity).toFixed(2)}
                                            </p>
                                            <button 
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="p-2 text-red-600 hover:text-red-800 rounded-lg transition-colors"
                                                title="Remover item"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        
                        <button 
                            onClick={handleClearCart} 
                            className="md:hidden w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition duration-200"
                        >
                            Limpar Carrinho
                        </button>
                    </div>
                    
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumo do Pedido</h3>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Subtotal ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'})
                                    </span>
                                    <span className="font-medium">R$ {getTotalPrice().toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="border-t pt-4 mb-6">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-[#03B04B]">R$ {getTotalPrice().toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Link 
                                    to="/lojinha/checkout" 
                                    className="block w-full bg-[#03B04B] hover:bg-green-600 text-white text-center font-bold py-3 rounded-lg transition duration-300"
                                >
                                    Finalizar Compra
                                </Link>
                                <Link 
                                    to="/lojinha" 
                                    className="block w-full text-center text-gray-600 hover:text-gray-800 transition duration-200"
                                >
                                    Continuar Comprando
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Modal de confirmação para limpar carrinho */}
            <ConfirmModal
                isOpen={showClearModal}
                title="Limpar Carrinho"
                message="Tem certeza que deseja remover todos os itens do carrinho? Esta ação não pode ser desfeita."
                confirmText="Sim, Limpar Carrinho"
                cancelText="Cancelar"
                onConfirm={confirmClearCart}
                onCancel={() => setShowClearModal(false)}
                type="warning"
            />
        </div>
    );
};

export default CartPage;