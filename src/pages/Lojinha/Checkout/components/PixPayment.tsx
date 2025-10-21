import React from 'react';
import { Link } from 'react-router';
import concluirIcon from '../../../../assets/lojinha-icons/perrys/concluir.png';
import timeoutIcon from '../../../../assets/lojinha-icons/perrys/timeout.png';

// Componente de pagamento PIX
interface PixPaymentProps {
    qrCodeData: string;
    pixCopyPaste: string;
    timeLeft: number | null;
    isExpired: boolean;
    copied: boolean;
    onCopyPix: () => void;
    onCancelOrder: () => void;
    formatTimeLeft: (seconds: number) => string;
}

export const PixPayment: React.FC<PixPaymentProps> = ({ 
    qrCodeData, 
    pixCopyPaste, 
    timeLeft, 
    isExpired, 
    copied, 
    onCopyPix, 
    onCancelOrder,
    formatTimeLeft 
}) => {
    if (isExpired) {
        return (
            <div className="text-center py-12">
                <img 
                    src={timeoutIcon} 
                    alt="Tempo esgotado" 
                    className="w-24 h-24 mx-auto mb-4 object-contain"
                />
                <h2 className="text-xl font-bold text-red-600 mb-2">Tempo Esgotado</h2>
                <p className="text-gray-600 mb-6">O tempo para pagamento expirou. Tente novamente.</p>
                <div className="space-y-3">
                    <button
                        onClick={onCancelOrder}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition"
                    >
                        Tentar Novamente
                    </button>
                    <Link
                        to="/lojinha"
                        className="block text-gray-600 hover:text-gray-800"
                    >
                        Voltar à Lojinha
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
                <img 
                    src={concluirIcon}
                    alt="PIX" 
                    className="w-16 h-16 mx-auto mb-4 object-contain"
                />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Pague com PIX</h2>
                <p className="text-gray-600 mb-4">Escaneie o QR Code ou copie o código PIX</p>
                
                {timeLeft !== null && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 font-medium">
                            Tempo restante: {formatTimeLeft(timeLeft)}
                        </p>
                    </div>
                )}
                
                {/* QR Code Display */}
                <div className="mb-6 flex justify-center">
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                        <div 
                            className="w-48 h-48 bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-gray-500 text-sm"
                            style={{
                                backgroundImage: qrCodeData ? `url(data:image/png;base64,${qrCodeData})` : 'none',
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center'
                            }}
                        >
                            {!qrCodeData && 'QR Code será exibido aqui'}
                        </div>
                    </div>
                </div>
                
                {/* Copy PIX Code */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código PIX (Copiar e Colar)
                    </label>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={pixCopyPaste}
                            readOnly
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                        />
                        <button
                            onClick={onCopyPix}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                copied 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                            }`}
                        >
                            {copied ? 'Copiado!' : 'Copiar'}
                        </button>
                    </div>
                </div>
                
                <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                        Após o pagamento, você será redirecionado automaticamente
                    </p>
                    <button
                        onClick={onCancelOrder}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                        Cancelar Pedido
                    </button>
                </div>
            </div>
        </div>
    );
};