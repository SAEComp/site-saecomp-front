import { useState } from 'react';
import { Link } from 'react-router';
import { useCart } from '../hooks/useCart';
import carrinhoIcon from '../../../assets/lojinha-icons/perrys/carrinho.png';
import ConfirmModal from '../../../components/Inputs/ConfirmModal';

const CartPage = () => {
    const { state, removeItem, clearCart, getTotalPrice, getTotalItems } = useCart();
    const [showClearModal, setShowClearModal] = useState(false);

    const handleRemoveItem = async (itemId: number) => {
        try {
            await removeItem(itemId);
        } catch (error) {
            console.error('Erro ao remover item:', error);
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
                        className="hidden md:block bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition duration-200"
                    >
                        Limpar Carrinho
                    </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {state.items.map(item => (
                            <div key={item.id} className="bg-white rounded-lg shadow-sm p-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-800">{item.productName}</h3>
                                        <p className="text-[#03B04B] font-bold">R$ {item.value.toFixed(2)}</p>
                                        {item.productStock < 5 && (
                                            <p className="text-xs text-orange-600">
                                                Restam apenas {item.productStock} unidades
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-800">
                                            R$ {(item.value * item.quantity).toFixed(2)}
                                        </p>
                                        <button 
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="text-red-500 hover:text-red-700 text-sm transition duration-200"
                                            title="Remover item"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        <button 
                            onClick={handleClearCart} 
                            className="md:hidden w-full bg-red-100 hover:bg-red-200 text-red-700 py-3 rounded-lg transition duration-200"
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