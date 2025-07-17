import { Link } from 'react-router';
import { useCart } from '../hooks/useCart';

const Cart = () => {
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
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <div className="text-6xl mb-4">🛒</div>
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
                            <div key={item._id} className="bg-white rounded-lg shadow-sm p-4">
                                <div className="flex items-center space-x-4">
                                    <img 
                                        src={item.imageUrl} 
                                        alt={item.name} 
                                        className="w-20 h-20 object-cover rounded-lg"
                                        onError={(e) => {
                                            e.currentTarget.src = '/placeholder-product.svg';
                                        }}
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                        <p className="text-gray-600 text-sm">{item.description}</p>
                                        <p className="text-[#03B04B] font-bold">R$ {item.price.toFixed(2)}</p>
                                        {item.stock < 5 && (
                                            <p className="text-xs text-orange-600">
                                                Restam apenas {item.stock} unidades
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button 
                                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition duration-200"
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                                        <button 
                                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition duration-200"
                                            disabled={item.quantity >= item.stock}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-800">
                                            R$ {(item.price * item.quantity).toFixed(2)}
                                        </p>
                                        <button 
                                            onClick={() => removeItem(item._id)}
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
        </div>
    );
};

export default Cart;
