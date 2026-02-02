import React from 'react';
import profileIcon from '../../../../assets/lojinha-icons/perrys/profile.png';
import erroIcon from '../../../../assets/lojinha-icons/perrys/ERRO.png';

interface OrderInformationProps {
    customerName: string;
    error: string | null;
    loading: boolean;
    onSubmitOrder: () => void;
    onGoBack: () => void;
}

const OrderInformation: React.FC<OrderInformationProps> = ({
    customerName,
    error,
    loading,
    onSubmitOrder,
    onGoBack
}) => {
    return (
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
                        Após confirmar o pedido, você receberá um QR Code para pagamento via PIX com validade de 30 minutos.
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
                    onClick={onGoBack}
                    className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                    Voltar à Loja
                </button>
                <button
                    onClick={onSubmitOrder}
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
    );
};

export default OrderInformation;
