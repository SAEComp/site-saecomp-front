import React from 'react';

// Formulário de pagamento
interface PaymentFormProps {
    onSubmit: () => void;
    loading: boolean;
    totalAmount: number;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit, loading, totalAmount }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pagamento</h2>
        
        <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <div>
                        <h3 className="font-medium text-gray-900">PIX</h3>
                        <p className="text-sm text-gray-600">Pagamento instantâneo</p>
                    </div>
                </div>
            </div>
            
            <button
                onClick={onSubmit}
                disabled={loading}
                className="w-full bg-[#03B04B] hover:bg-green-600 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition flex items-center justify-center"
            >
                {loading ? (
                    <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processando...</span>
                    </div>
                ) : (
                    `Gerar PIX - R$ ${totalAmount.toFixed(2)}`
                )}
            </button>
        </div>
    </div>
);