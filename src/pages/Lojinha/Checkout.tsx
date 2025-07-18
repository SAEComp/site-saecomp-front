import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from './hooks/useCart';
import { PaymentMethod } from './types';
import { orderService, paymentService } from './services/api';
import { getProductImageUrl } from './utils/imageUtils';

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const { state, clearCart, getTotalPrice } = useCart();
    const cartItems = state.items;
    const totalAmount = getTotalPrice();
    
    // Form states
    const [customerData, setCustomerData] = useState({
        name: '',
        course: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [qrCodeData, setQrCodeData] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);

    // Redirect if cart is empty
    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/lojinha');
        }
    }, [cartItems, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCustomerData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = (): boolean => {
        // No validation needed since all fields are optional
        return true;
    };

    const handleSubmitOrder = async () => {
        setError(null);
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Create order
            const orderData = {
                customerName: customerData.name.trim() || undefined,
                customerCourse: customerData.course.trim() || undefined,
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
                customerName: customerData.name.trim() || undefined
            });
            if (pixResponse.data?.qrCode) {
                setQrCodeData(pixResponse.data.qrCode);
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
        clearCart();
        navigate(`/lojinha/sucesso/${orderId}`, { state: { orderId } });
    };

    if (cartItems.length === 0) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>
                
                {/* Order Summary */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo do Pedido</h2>
                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div key={item._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                                <img 
                                    src={getProductImageUrl(item)} 
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                />
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
                    /* Customer Form */
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Dados do Cliente</h2>
                        
                        <form onSubmit={(e) => { e.preventDefault(); handleSubmitOrder(); }} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={customerData.name}
                                    onChange={handleInputChange}
                                    placeholder="Digite seu nome"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                                    Curso que faz
                                </label>
                                <select
                                    id="course"
                                    name="course"
                                    value={customerData.course}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Selecione seu curso</option>
                                    <option value="Engenharia de Computação">Engenharia de Computação</option>
                                    <option value="Engenharia Ambiental">Engenharia Ambiental</option>
                                    <option value="Engenharia Aeronáutica">Engenharia Aeronáutica</option>
                                    <option value="Engenharia de Materiais">Engenharia de Materiais</option>
                                    <option value="Professores/Funcionários">Professores/Funcionários</option>
                                    <option value="Outros">Outros</option>
                                </select>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                    <p className="font-medium text-blue-900">Pagamento via PIX</p>
                                </div>
                                <p className="text-sm text-blue-700 mt-1">
                                    Após confirmar o pedido, você receberá um QR Code para pagamento via PIX.
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm font-medium text-red-900">{error}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-4 space-y-4 space-y-reverse sm:space-y-0">
                                <button
                                    type="button"
                                    onClick={() => navigate('/lojinha')}
                                    className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Voltar à Loja
                                </button>
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                        </form>
                    </div>
                ) : (
                    /* PIX Payment */
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Pagamento PIX</h2>
                        <p className="text-gray-600 mb-6">Escaneie o QR Code abaixo para realizar o pagamento:</p>
                        
                        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
                            <div className="bg-white rounded-lg p-4 inline-block">
                                <p className="font-mono text-sm break-all">{qrCodeData}</p>
                                <small className="text-gray-500 block mt-2">QR Code gerado para pagamento PIX</small>
                            </div>
                        </div>
                        
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
                                onClick={() => setQrCodeData(null)}
                                className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Voltar
                            </button>
                            <button
                                onClick={handlePaymentComplete}
                                className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
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
