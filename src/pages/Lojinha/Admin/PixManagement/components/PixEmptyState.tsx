import React from 'react';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddIcon from '@mui/icons-material/Add';

interface PixEmptyStateProps {
    onAddPix: () => void;
}

const PixEmptyState: React.FC<PixEmptyStateProps> = ({ onAddPix }) => {
    return (
        <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma chave PIX configurada
            </h3>
            <p className="text-gray-500 mb-6">
                Adicione chaves PIX para receber pagamentos na lojinha.
            </p>
            <button
                onClick={onAddPix}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Adicionar Chave PIX</span>
            </button>
        </div>
    );
};

export default PixEmptyState;
