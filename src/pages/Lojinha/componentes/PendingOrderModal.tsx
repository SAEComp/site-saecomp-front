import React from 'react';
import { useNavigate } from 'react-router';
import erroIcon from '../../../assets/lojinha-icons/perrys/pedidos.png';

interface PendingOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PendingOrderModal: React.FC<PendingOrderModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleGoToCheckout = () => {
        onClose();
        navigate('/lojinha/checkout');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                    <div className="text-center mb-6">
                        <img
                            src={erroIcon}
                            alt="Perry com pedido pendente"
                            className="w-32 h-32 mx-auto mb-4 object-contain drop-shadow-lg"
                        />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Pedido Pendente
                        </h3>
                        <p className="text-gray-600">
                            Você já possui um pedido aguardando pagamento. Finalize ou cancele o pedido atual antes de adicionar novos itens ao carrinho.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            type="button"
                            onClick={handleGoToCheckout}
                            className="w-full px-6 py-3 bg-[#03B04B] text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                        >
                            Ver Pedido Pendente
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
