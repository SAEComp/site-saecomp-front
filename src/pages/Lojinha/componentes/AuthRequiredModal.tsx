import React from 'react';
import profileIcon from '../../../assets/lojinha-icons/perrys/profile.png';

interface AuthRequiredModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
    isOpen,
    onConfirm,
    onCancel
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                    <div className="text-center mb-6">
                        <img 
                            src={profileIcon} 
                            alt="Perry de Login" 
                            className="w-32 h-32 mx-auto mb-4 object-contain"
                        />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Login Necessário
                        </h3>
                        <p className="text-gray-600">
                            Você precisa estar logado para acessar a lojinha e fazer pedidos!
                        </p>
                    </div>
                    
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="w-full sm:w-auto px-6 py-3 bg-[#03B04B] text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                        >
                            Fazer Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
