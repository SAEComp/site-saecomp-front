import React from 'react';
import timeoutIcon from '../../../../assets/lojinha-icons/perrys/timeout.png';

interface PaymentExpiredProps {
    onContinueShopping: () => void;
}

const PaymentExpired: React.FC<PaymentExpiredProps> = ({ onContinueShopping }) => {
    return (
        <div className="text-center py-12">
            <img 
                src={timeoutIcon} 
                alt="Tempo esgotado" 
                className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-4 object-contain"
            />
            <h2 className="text-xl font-bold text-red-600 mb-2">Tempo Esgotado</h2>
            <p className="text-gray-600 mb-6">O tempo para pagamento expirou. Tente novamente.</p>
            <button
                onClick={onContinueShopping}
                className="border-2 border-gray-400 text-gray-700 hover:border-gray-600 hover:text-gray-900 px-6 py-3 rounded-lg font-medium transition-colors"
            >
                Continuar Comprando
            </button>
        </div>
    );
};

export default PaymentExpired;
