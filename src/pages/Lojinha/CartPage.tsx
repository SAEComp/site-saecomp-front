import { Link } from 'react-router';
import { useCart } from './hooks/useCart';
import { getProductImageUrl } from './utils/imageUtils';
import carrinhoIcon from '../../assets/lojinha-icons/perrys/carrinho.png';

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
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Meu Carrinho</h1>
                    <button 
                        onClick={handleClearCart} 
                        className="text-red-600 hover:text-red-800 font-medium"
                    >
                        Limpar Carrinho
                    </button>
                </div>
                
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Items do carrinho */}
                    <div className="lg:col-span-2 space-y-4">
                        {state.items.map(item => (
                            <div key={item._id} className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center p-1">
                                    <img 
                                        src={getProductImageUrl(item)} 
                                        alt={item.name} 
                                        className="max-w-full max-h-full object-contain rounded"
                                        onError={(e) => {
                                            e.currentTarget.src = '/placeholder-product.svg';
                                        }}
                                    />
                                </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                        <p className="text-gray-600 text-sm">{item.description}</p>
                                        <p className="text-lg font-bold text-[#03B04B]">R$ {item.price.toFixed(2)}</p>
                                        {item.stock < 5 && (
                                            <p className="text-xs text-orange-600">
                                                Restam apenas {item.stock} unidades
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button 
                                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                        <button 
                                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                                            disabled={item.quantity >= item.stock}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg">
                                            R$ {(item.price * item.quantity).toFixed(2)}
                                        </p>
                                        <button 
                                            onClick={() => removeItem(item._id)}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                            title="Remover item"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
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
