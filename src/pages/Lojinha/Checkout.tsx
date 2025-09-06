import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from './hooks/useCart';
import { PaymentMethod } from './types';
import { orderService, paymentService } from './services/api';
import { getProductImageUrl } from './utils/imageUtils';
import { useAuth } from '../../auth/AuthContext';
import erroIcon from '../../assets/lojinha-icons/perrys/ERRO.png';
import concluirIcon from '../../assets/lojinha-icons/perrys/concluir.png';
import profileIcon from '../../assets/lojinha-icons/perrys/profile.png';

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const { state, clearCart, getTotalPrice } = useCart();
    const { user } = useAuth();
    const cartItems = state.items;
    const totalAmount = getTotalPrice();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [qrCodeData, setQrCodeData] = useState<string | null>(null);
    const [pixCopyPaste, setPixCopyPaste] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [isExpired, setIsExpired] = useState(false);
    const [copied, setCopied] = useState(false);

    // Get customer name from authenticated user or set as anonymous
    const customerName = user?.name || 'Cliente Anônimo';

    // Timer effect for 20 minutes (1200 seconds)
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev === null || prev <= 1) {
                    setIsExpired(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Format time left as MM:SS
    const formatTimeLeft = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Copy PIX code to clipboard
    const handleCopyPix = async () => {
        if (pixCopyPaste) {
            try {
                await navigator.clipboard.writeText(pixCopyPaste);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    // Redirect if cart is empty
    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/lojinha');
        }
    }, [cartItems, navigate]);

    const handleSubmitOrder = async () => {
        setError(null);
        setLoading(true);
        setIsExpired(false);

        try {
            // Create order
            const orderData = {
                items: cartItems.map(item => ({
                    productId: item._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                paymentMethod: 'pix' as PaymentMethod,
                totalAmount
            };

            const orderResponse = await orderService.create(orderData);
            
            const newOrderId = orderResponse.data?._id;
            if (!newOrderId) {
                throw new Error('Falha ao criar pedido');
            }
            setOrderId(newOrderId);

            // Generate PIX payment QR code
            const pixResponse = await paymentService.generatePix({
                orderId: newOrderId,
                amount: totalAmount,
                customerName: customerName
            });
            if (pixResponse.data?.qrCode) {
                setQrCodeData(pixResponse.data.qrCode);
                // Simulate PIX copy-paste code (in real implementation, this would come from the payment service)
                setPixCopyPaste(pixResponse.data.qrCode);
                // Start 20-minute timer (1200 seconds)
                setTimeLeft(1200);
            } else {
                throw new Error('Falha ao gerar código PIX');
            }
        } catch (err: any) {
            console.error('Checkout error:', err);
            let errorMessage = 'Erro ao processar pedido';
            
            if (err.message) {
                errorMessage = err.message;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.code === 'ECONNABORTED') {
                errorMessage = 'Timeout: Verifique sua conexão e tente novamente';
            } else if (err.code === 'NETWORK_ERROR') {
                errorMessage = 'Erro de rede: Verifique sua conexão';
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentComplete = () => {
        navigate(`/lojinha/sucesso/${orderId}`, { 
            state: { orderId },
            replace: true 
        });
        // Limpar carrinho após um pequeno delay para evitar conflito
        setTimeout(() => {
            clearCart();
        }, 100);
    };

    if (cartItems.length === 0) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Finalizar Compra</h1>
                    <img 
                        src={concluirIcon} 
                        alt="Perry Concluir" 
                        className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-lg"
                    />
                </div>
                
                {/* Linha divisória */}
                <div className="border-t border-gray-300 mb-8"></div>
                
                {/* Order Summary */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo do Pedido</h2>
                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div key={item._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                                <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center p-1">
                                    <img 
                                        src={getProductImageUrl(item)} 
                                        alt={item.name}
                                        className="max-w-full max-h-full object-contain rounded"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                                    <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                                    <p className="text-sm text-gray-600">Preço unitário: R$ {item.price.toFixed(2)}</p>
                                    <p className="font-medium text-gray-900">
                                        Subtotal: R$ {(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-gray-900">Total:</span>
                            <span className="text-xl font-bold text-green-600">R$ {totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {!qrCodeData ? (
                    /* Order Information */
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações do Pedido</h2>
                        
                        <div className="space-y-4 mb-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0">
                                        <img 
                                            src={profileIcon} 
                                            alt="Perfil do cliente" 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Cliente</p>
                                        <p className="text-gray-900">{customerName}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <p className="font-medium text-gray-900">💳 Pagamento via PIX</p>
                                </div>
                                <p className="text-sm text-gray-700 mt-1">
                                    Após confirmar o pedido, você receberá um QR Code para pagamento via PIX com validade de 20 minutos.
                                </p>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <div className="flex items-center">
                                    <img 
                                        src={erroIcon} 
                                        alt="Erro" 
                                        className="w-8 h-8 mr-3 object-contain"
                                    />
                                    <p className="text-sm font-medium text-red-900">{error}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-4 space-y-4 space-y-reverse sm:space-y-0">
                            <button
                                type="button"
                                onClick={() => navigate('/lojinha')}
                                className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Voltar à Loja
                            </button>
                            <button
                                onClick={handleSubmitOrder}
                                className="w-full sm:w-auto px-6 py-3 bg-[#03B04B] text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processando...
                                    </>
                                ) : (
                                    'Finalizar Pedido'
                                )}
                            </button>
                        </div>
                    </div>
                ) : isExpired ? (
                    /* Payment Expired */
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="text-center">
                            <img 
                                src={erroIcon} 
                                alt="Perry Erro" 
                                className="w-16 h-16 mx-auto mb-4"
                            />
                            <h2 className="text-2xl font-bold text-red-600 mb-4">Tempo Expirado!</h2>
                            <p className="text-gray-600 mb-6">
                                O tempo para pagamento do PIX expirou (20 minutos). 
                                Você precisará gerar um novo código para finalizar seu pedido.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => {
                                        setQrCodeData(null);
                                        setPixCopyPaste(null);
                                        setIsExpired(false);
                                        setTimeLeft(null);
                                    }}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Gerar Novo PIX
                                </button>
                                <button
                                    onClick={() => navigate('/lojinha')}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Voltar à Lojinha
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* PIX Payment */
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Pagamento PIX</h2>
                            {timeLeft !== null && timeLeft > 0 && (
                                <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                                    ⏰ {formatTimeLeft(timeLeft)}
                                </div>
                            )}
                        </div>
                        
                        <p className="text-gray-600 mb-4">
                            Escaneie o QR Code ou copie o código PIX abaixo para realizar o pagamento:
                        </p>
                        
                        {timeLeft !== null && timeLeft > 0 && (
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                                <div className="flex items-center">
                                    <div className="text-yellow-800 text-sm">
                                        <strong>Atenção:</strong> Você tem <strong>{formatTimeLeft(timeLeft)}</strong> para completar o pagamento.
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* QR Code */}
                        <div className="text-center mb-6">
                            <div className="bg-white rounded-lg border-2 border-gray-200 p-4 inline-block shadow-sm">
                                <div className="font-mono text-xs break-all bg-gray-50 p-2 rounded border w-48 h-48 flex items-center justify-center">
                                    <span className="text-gray-600 text-center">
                                        QR Code PIX
                                        <br />
                                        <small>{qrCodeData?.substring(0, 20)}...</small>
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-2 font-medium">Escaneie com seu celular</p>
                            </div>
                        </div>
                        
                        {/* PIX Copy-Paste */}
                        {pixCopyPaste && (
                            <div className="mb-6 max-w-2xl mx-auto px-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                                    ou copie o código PIX:
                                </label>
                                <div className="bg-gray-50 rounded-lg p-3 border">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            value={pixCopyPaste}
                                            readOnly
                                            className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono text-center"
                                        />
                                        <button
                                            onClick={handleCopyPix}
                                            className={`px-4 py-2 rounded-lg font-medium transition-colors min-w-[80px] ${
                                                copied 
                                                    ? 'bg-green-600 text-white' 
                                                    : 'bg-[#03B04B] hover:bg-green-600 text-white'
                                            }`}
                                        >
                                            {copied ? '✓' : 'Copiar'}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 text-center">
                                        Cole no seu app do banco para pagar
                                    </p>
                                </div>
                            </div>
                        )}
                        
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Valor:</span>
                                    <p className="text-lg font-bold text-green-600">R$ {totalAmount.toFixed(2)}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Pedido:</span>
                                    <p className="text-lg font-bold text-gray-900">#{orderId}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-4 space-y-4 space-y-reverse sm:space-y-0">
                            <button
                                onClick={() => {
                                    setQrCodeData(null);
                                    setPixCopyPaste(null);
                                    setTimeLeft(null);
                                    setIsExpired(false);
                                }}
                                className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Voltar
                            </button>
                            <button
                                onClick={handlePaymentComplete}
                                className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <img src={concluirIcon} alt="Concluir" className="w-5 h-5" />
                                Confirmar Pagamento
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
