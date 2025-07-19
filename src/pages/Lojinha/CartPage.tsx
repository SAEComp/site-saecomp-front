import { Link } from 'react-router';
import { useCart } from './hooks/useCart';
import { getProductImageUrl } from './utils/imageUtils';
import carrinhoIcon from '../../assets/lojinha-icons/perrys/carrinho.png';
import pedidosIcon from '../../assets/lojinha-icons/perrys/pedidos.png';

const CartPage = () => {
    const { state, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();

    const handleQuantityChange = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(productId);
        } else {
            updateQuantity(productId, quantity);
        }
    };

    const handleClearCart = () => {
        if (window.confirm('Tem certeza que deseja limpar todo o carrinho?')) {
            clearCart();
        }
    };

    if (state.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center py-16">
                        <img 
                            src={carrinhoIcon} 
                            alt="Carrinho vazio" 
                            className="w-28 h-28 md:w-32 md:h-32 mx-auto mb-4 object-contain drop-shadow-lg"
                        />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Seu carrinho está vazio</h2>
                        <p className="text-gray-600 mb-6">Adicione alguns produtos deliciosos ao seu carrinho!</p>
                        <Link 
                            to="/lojinha"
                            className="bg-[#03B04B] hover:bg-green-600 opacity-90 text-white px-6 py-3 rounded-lg font-medium transition"
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                        <img 
                            src={pedidosIcon} 
                            alt="Perry dos Pedidos" 
                            className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-lg"
                        />
                        <h1 className="text-3xl font-bold text-gray-800">Meu Carrinho</h1>
                    </div>
                    <button 
                        onClick={handleClearCart} 
                        className="hidden sm:block bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors text-base"
                    >
                        Limpar Carrinho
                    </button>
                </div>
                
                {/* Linha divisória */}
                <div className="border-t border-gray-300 mb-8"></div>
                
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Items do carrinho */}
                    <div className="lg:col-span-2 space-y-4">
                        {state.items.map(item => (
                            <div key={item._id} className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
                                    {/* Imagem e informações básicas */}
                                    <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-lg flex items-center justify-center p-1 flex-shrink-0">
                                            <img 
                                                src={getProductImageUrl(item)} 
                                                alt={item.name}
                                                className="max-w-full max-h-full object-contain rounded"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/placeholder-product.svg';
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-800 text-sm sm:text-lg mb-1">{item.name}</h3>
                                            <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 hidden sm:block mb-1">{item.description}</p>
                                            <p className="hidden sm:block text-lg font-bold text-[#03B04B] mb-1">R$ {item.price.toFixed(2)}</p>
                                            {item.stock < 5 && (
                                                <p className="text-xs sm:text-sm text-orange-600 mt-1">
                                                    Restam apenas {item.stock} unidades
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Controles de quantidade - Desktop */}
                                    <div className="hidden sm:flex flex-col items-center space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <button 
                                                onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-lg font-bold transition-colors"
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="w-10 text-center font-medium text-lg">{item.quantity}</span>
                                            <button 
                                                onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-lg font-bold transition-colors"
                                                disabled={item.quantity >= item.stock}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Total e remover - Desktop */}
                                    <div className="hidden sm:flex flex-col items-center space-y-2">
                                        <p className="font-bold text-xl text-gray-900 mb-2">
                                            R$ {(item.price * item.quantity).toFixed(2)}
                                        </p>
                                        <button 
                                            onClick={() => removeItem(item._id)}
                                            className="text-red-600 hover:text-red-800 p-2 transition-colors rounded-lg hover:bg-red-50"
                                            title="Remover item"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                    
                                    {/* Layout Mobile - Mantém o layout original */}
                                    <div className="flex sm:hidden justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-600">Preço unitário:</p>
                                            <p className="text-base font-bold text-[#03B04B]">R$ {item.price.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Total:</p>
                                            <p className="font-bold text-lg">
                                                R$ {(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Controles Mobile */}
                                    <div className="flex sm:hidden items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <button 
                                                onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-lg font-bold"
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                                            <button 
                                                onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-lg font-bold"
                                                disabled={item.quantity >= item.stock}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button 
                                            onClick={() => removeItem(item._id)}
                                            className="text-red-600 hover:text-red-800 p-1 transition-colors"
                                            title="Remover item"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {/* Botão Limpar Carrinho - Mobile (abaixo dos produtos) */}
                        <div className="sm:hidden text-center mt-6">
                            <button 
                                onClick={handleClearCart} 
                                className="bg-red-600 hover:bg-red-500 text-white px-12 py-2 rounded-lg font-medium transition-colors text-base w-full max-w-sm"
                            >
                                Limpar Carrinho
                            </button>
                        </div>
                    </div>
                    
                    {/* Resumo do pedido */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Resumo do Pedido</h3>
                            
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Subtotal ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'})
                                    </span>
                                    <span className="font-medium">R$ {getTotalPrice().toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between">
                                    <span className="font-semibold text-lg">Total</span>
                                    <span className="font-bold text-lg text-[#03B04B]">
                                        R$ {getTotalPrice().toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            
                            <Link 
                                to="/lojinha/checkout"
                                className="block w-full bg-[#03B04B] hover:bg-green-600 text-white text-center py-3 rounded-lg font-medium transition mb-3"
                            >
                                Finalizar Compra
                            </Link>
                            
                            <Link 
                                to="/lojinha"
                                className="block w-full text-center text-[#03B04B] hover:text-green-600 font-medium"
                            >
                                Continuar Comprando
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
