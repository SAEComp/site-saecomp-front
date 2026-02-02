import React, { useState } from 'react';
import { formatTimeLeft } from '../utils';

interface PixPaymentProps {
    qrCodeData: string | null;
    pixCopyPaste: string | null;
    orderId: string | null;
    totalAmount: number;
    timeLeft: number | null;
    loading: boolean;
    onCancelOrder: () => void;
}

const PixPayment: React.FC<PixPaymentProps> = ({
    qrCodeData,
    pixCopyPaste,
    orderId,
    totalAmount,
    timeLeft,
    loading,
    onCancelOrder
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopyPix = () => {
        if (pixCopyPaste) {
            navigator.clipboard.writeText(pixCopyPaste);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
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
            
            <div className="text-center mb-8">
                {qrCodeData ? (
                    <img 
                        src={`data:image/gif;base64,${qrCodeData}`} 
                        alt="QR Code PIX" 
                        className="w-64 h-64 mx-auto border border-gray-300 rounded-lg object-contain"
                    />
                ) : (
                    <div className="font-mono text-sm break-all bg-gray-100 p-6 rounded-lg border w-64 h-64 mx-auto flex items-center justify-center">
                        <span className="text-gray-600 text-center">
                            Gerando QR Code...
                        </span>
                    </div>
                )}
            </div>
            
            {pixCopyPaste && (
                <div className="mb-8 max-w-2xl mx-auto px-4 sm:px-8">
                    <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg overflow-hidden">
                        <input
                            type="text"
                            value={pixCopyPaste}
                            readOnly
                            className="flex-1 px-4 py-3 text-sm font-mono bg-gray-50 border-0 focus:outline-none text-center sm:text-left"
                            style={{ fontSize: '12px' }}
                        />
                        <button
                            onClick={handleCopyPix}
                            className={`px-6 py-3 font-medium transition-colors ${
                                copied 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                            }`}
                        >
                            {copied ? 'Copiado!' : 'Copiar'}
                        </button>
                    </div>
                </div>
            )}
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes do Pedido</h3>
                <div className="grid grid-cols-2 gap-4">
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
                    onClick={onCancelOrder}
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
                        "Cancelar Pedido"
                    )}
                </button>
            </div>
        </div>
    );
};

export default PixPayment;
