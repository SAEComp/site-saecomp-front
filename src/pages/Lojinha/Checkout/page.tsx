import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '../hooks/useCart';
import { orderService, paymentService, productService, getPendingPayments } from '../services/api';
import { useAuth } from '../../../auth/AuthContext';
import { Product } from '../types';
import concluirIcon from '../../../assets/lojinha-icons/perrys/concluir.png';
import ConfirmModal from '../../../components/Inputs/ConfirmModal';
import { OrderSummary, OrderInformation, PaymentExpired, PixPayment } from './components';
import { usePaymentListener, usePaymentTimer } from './hooks';
import { getFirstAndLastName, calculateTimeLeft } from './utils';

const PAYMENT_TIMEOUT = 30 * 60; // 30 minutos em segundos

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const { state, clearCart, getTotalPrice } = useCart();
    const { user } = useAuth();
    
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [checkingPending, setCheckingPending] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [qrCodeData, setQrCodeData] = useState<string | null>(null);
    const [pixCopyPaste, setPixCopyPaste] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [paymentId, setPaymentId] = useState<number | null>(null);
    const [buyOrderId, setBuyOrderId] = useState<number | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [orderCreatedAt, setOrderCreatedAt] = useState<Date | null>(null);
    const [pendingOrderTotal, setPendingOrderTotal] = useState<number | null>(null);
    const [pendingOrderItems, setPendingOrderItems] = useState<any[]>([]);
    
    const cartItems = pendingOrderItems.length > 0 ? pendingOrderItems : state.items;
    const totalAmount = pendingOrderTotal !== null ? pendingOrderTotal : getTotalPrice();
    const customerName = user?.name ? getFirstAndLastName(user.name) : 'Cliente Anônimo';

    // Payment timer hook
    const { timeLeft, isExpired, setTimeLeft, setIsExpired, setInitialTime } = usePaymentTimer({
        timeout: PAYMENT_TIMEOUT,
        orderCreatedAt,
        onTimeout: handleOrderTimeout
    });

    // Payment listener hook
    const { startListener, closeListener } = usePaymentListener({
        paymentId,
        totalAmount,
        onApproved: async (orderIdForNav, earnedPoints) => {
            await clearCart();
            navigate(`/lojinha/sucesso/${orderIdForNav}`, { 
                replace: true,
                state: { earnedPoints }
            });
        },
        onCancelled: () => setIsExpired(true),
        onExpired: () => setIsExpired(true)
    });

    // Handle order timeout
    function handleOrderTimeout() {
        if (!buyOrderId) return;
        
        paymentService.cancel(buyOrderId)
            .then(() => console.log('Order automatically cancelled due to timeout'))
            .catch(err => console.error('Error cancelling order on timeout:', err));
        
        closeListener();
    }

    // Load products for images
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await productService.getAll({ pageSize: 100, includeInactive: true });
                if (response.success && response.data) {
                    setProducts(response.data);
                }
            } catch (error) {
                console.error('Erro ao carregar produtos:', error);
            }
        };
        loadProducts();
    }, []);

    // Check for pending payments on mount
    useEffect(() => {
        const checkPendingPayments = async () => {
            try {
                const response = await getPendingPayments();
                if (response.success && response.data && response.data.length > 0) {
                    const pendingOrder = response.data[0];
                    
                    setPaymentId(pendingOrder.paymentId);
                    setBuyOrderId(pendingOrder.id);
                    setOrderId(String(pendingOrder.id));
                    setQrCodeData(pendingOrder.qrCodeBase64);
                    setPixCopyPaste(pendingOrder.pixCopiaECola);
                    setPendingOrderTotal(pendingOrder.totalValue);
                    setPendingOrderItems(pendingOrder.item || []);
                    
                    const createdAt = new Date(pendingOrder.date);
                    setOrderCreatedAt(createdAt);
                    
                    setInitialTime(createdAt);
                    const remaining = calculateTimeLeft(createdAt, PAYMENT_TIMEOUT);
                    
                    if (remaining <= 0) {
                        setIsExpired(true);
                    } else {
                        startListener(pendingOrder.paymentId, pendingOrder.id);
                    }
                }
            } catch (error) {
                console.error('Erro ao verificar pagamentos pendentes:', error);
            } finally {
                setCheckingPending(false);
            }
        };

        checkPendingPayments();

        return () => closeListener();
    }, []);

    // Redirect if cart is empty (but not if order exists - payment or expired screen)
    useEffect(() => {
        if (!checkingPending && cartItems.length === 0 && !orderId) {
            navigate('/lojinha');
        }
    }, [checkingPending, cartItems, navigate, orderId]);

    const handleSubmitOrder = async () => {
        setError(null);
        setLoading(true);
        setIsExpired(false);

        try {
            // No novo backend, finish-order cria o pedido E gera o PIX automaticamente
            // usando o carrinho atual do usuário
            const pixResponse = await orderService.finish();

            if (pixResponse.success && pixResponse.data) {
                const newPaymentId = pixResponse.data.paymentData.paymentId;
                const newBuyOrderId = pixResponse.data.buyOrderId;
                const createdAt = new Date();
                
                setPaymentId(newPaymentId);
                setBuyOrderId(newBuyOrderId);
                setOrderId(String(newBuyOrderId));
                setQrCodeData(pixResponse.data.paymentData.qrCodeBase64);
                setPixCopyPaste(pixResponse.data.paymentData.pixCopiaECola);
                setOrderCreatedAt(createdAt);
                setTimeLeft(PAYMENT_TIMEOUT);
                
                startListener(newPaymentId, newBuyOrderId);
            } else {
                throw new Error(pixResponse.message || 'Falha ao gerar PIX');
            }
        } catch (err: any) {
            console.error('Error submitting order:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Erro ao processar pedido. Tente novamente.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Handle order cancellation
    const handleCancelOrder = () => {
        if (!orderId) return;
        setShowCancelModal(true);
    };

    const confirmCancelOrder = async () => {
        setShowCancelModal(false);
        
        if (!buyOrderId) {
            setError('ID do pedido não encontrado');
            return;
        }
        
        closeListener();
        
        try {
            setLoading(true);
            
            let cancelMessage = 'Pedido cancelado com sucesso';
            
            // Tentar cancelar o pagamento
            try {
                await paymentService.cancel(buyOrderId);
            } catch (cancelErr: any) {
                // Se o pedido não foi encontrado (404), pode ser que já foi processado/cancelado
                if (cancelErr?.response?.status === 404) {
                    console.log('Pedido já foi processado ou cancelado');
                    cancelMessage = 'Retornando à loja';
                } else {
                    throw cancelErr; // Re-lançar se for outro tipo de erro
                }
            }
            
            // Limpar carrinho (não falha se já foi limpo)
            await clearCart();
            
            navigate('/lojinha', { 
                state: { message: cancelMessage },
                replace: true 
            });
        } catch (err: any) {
            console.error('Error cancelling order:', err);
            setError(err.message || 'Erro ao cancelar pedido');
        } finally {
            setLoading(false);
        }
    };

    // Show loading while checking pending payments
    if (checkingPending) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Verificando pagamentos pendentes...</p>
                </div>
            </div>
        );
    }

    // Don't render if cart is empty and no order in progress
    if (cartItems.length === 0 && !orderId) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {!isExpired && (
                    <>
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
                    </>
                )}
                
                {/* Order Summary - Hidden when expired */}
                {!isExpired && (
                    <OrderSummary 
                        cartItems={cartItems}
                        products={products}
                        totalAmount={totalAmount}
                    />
                )}

                {!qrCodeData ? (
                    <OrderInformation
                        customerName={customerName}
                        error={error}
                        loading={loading}
                        onSubmitOrder={handleSubmitOrder}
                        onGoBack={() => navigate('/lojinha')}
                    />
                ) : isExpired ? (
                    <PaymentExpired onContinueShopping={() => navigate('/lojinha')} />
                ) : (
                    <PixPayment
                        qrCodeData={qrCodeData}
                        pixCopyPaste={pixCopyPaste}
                        orderId={orderId}
                        totalAmount={totalAmount}
                        timeLeft={timeLeft}
                        loading={loading}
                        onCancelOrder={handleCancelOrder}
                    />
                )}
            </div>
            
            {/* Modal de confirmação de cancelamento */}
            <ConfirmModal
                isOpen={showCancelModal}
                title="Cancelar Pedido"
                message="Tem certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita."
                confirmText="Sim, Cancelar"
                cancelText="Não, Manter Pedido"
                onConfirm={confirmCancelOrder}
                onCancel={() => setShowCancelModal(false)}
                type="danger"
            />
        </div>
    );
};

export default Checkout;