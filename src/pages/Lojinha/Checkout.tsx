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
import timeoutIcon from '../../assets/lojinha-icons/perrys/timeout.png';

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

    // Function to get first and last name from full name
    const getFirstAndLastName = (fullName: string): string => {
        if (!fullName || fullName.trim() === '') {
            return 'Cliente Anônimo';
        }
        
        const nameParts = fullName.trim().split(' ').filter(part => part.length > 0);
        
        if (nameParts.length === 0) {
            return 'Cliente Anônimo';
        } else if (nameParts.length === 1) {
            return nameParts[0];
        } else {
            return `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;
        }
    };

    // Get customer name from authenticated user or set as anonymous
    const customerName = user?.name ? getFirstAndLastName(user.name) : 'Cliente Anônimo';

    // Timer effect for 30 seconds
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev === null || prev <= 1) {
                    setIsExpired(true);
                    // Cancel order when timer expires
                    if (orderId) {
                        handleOrderTimeout(orderId);
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, orderId]);

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

    // Handle order timeout by canceling it and restoring stock
    const handleOrderTimeout = async (orderIdToCancel: string) => {
        try {
            await orderService.cancelByTimeout(orderIdToCancel);
            console.log('Order cancelled due to timeout:', orderIdToCancel);
        } catch (err) {
            console.error('Failed to cancel order by timeout:', err);
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
                totalAmount,
                customerName: customerName
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
                // Start 30-second timer
                setTimeLeft(30);
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

    // Handle order cancellation
    const handleCancelOrder = async () => {
        if (!orderId) return;
        
        const confirmCancel = window.confirm(
            'Tem certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita.'
        );
        
        if (!confirmCancel) return;
        
        try {
            setLoading(true);
            await orderService.cancel(orderId);
            clearCart();
            navigate('/lojinha', { 
                state: { message: 'Pedido cancelado com sucesso' },
                replace: true 
            });
        } catch (err: any) {
            console.error('Error cancelling order:', err);
            setError(err.message || 'Erro ao cancelar pedido');
        } finally {
            setLoading(false);
        }
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
                                    Após confirmar o pedido, você receberá um QR Code para pagamento via PIX com validade de 30 segundos.
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
                                src={timeoutIcon} 
                                alt="Perry Timeout" 
                                className="w-28 h-28 md:w-32 md:h-32 mx-auto mb-4 object-contain drop-shadow-lg"
                            />
                            <h2 className="text-2xl font-bold text-black mb-2">Tempo Expirado</h2>
                            <p className="text-gray-600 mb-6">
                                O pedido será cancelado automaticamente
                            </p>
                            <div className="flex justify-center">
                                <button
                                    onClick={() => navigate('/lojinha')}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Voltar
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* PIX Payment */
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Pagamento PIX</h2>
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
                        <div className="text-center mb-8">
                            <div className="font-mono text-sm break-all bg-gray-100 p-6 rounded-lg border w-64 h-64 mx-auto flex items-center justify-center">
                                <span className="text-gray-600 text-center">
                                    QR Code PIX
                                    <br />
                                    <small className="text-xs">{qrCodeData?.substring(0, 30)}...</small>
                                </span>
                            </div>
                        </div>
                        
                        {/* PIX Copy-Paste */}
                        {pixCopyPaste && (
                            <div className="mb-8 max-w-2xl mx-auto px-4 sm:px-8">
                                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                                    <input
                                        type="text"
                                        value={pixCopyPaste}
                                        readOnly
                                        className="flex-1 min-w-0 px-3 sm:px-4 py-2 bg-gray-50 text-xs sm:text-sm font-mono text-left border-0 focus:outline-none text-gray-400 opacity-80"
                                    />
                                    <button
                                        onClick={handleCopyPix}
                                        className={`flex-shrink-0 px-2 sm:px-4 py-2 border-l border-gray-300 transition-colors text-xs sm:text-sm font-medium flex items-center gap-1 ${
                                            copied 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                        }`}
                                    >
                                        {copied ? (
                                            <>
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <span className="hidden sm:inline">Copiado!</span>
                                            </>
                                        ) : (
                                            'Copiar'
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    Cole este código no seu aplicativo do banco
                                </p>
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
                        
                        <div className="flex justify-center">
                            <button
                                onClick={handleCancelOrder}
                                disabled={loading}
                                className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Cancelando...
                                    </>
                                ) : (
                                    <>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        Cancelar Pedido
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
