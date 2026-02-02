import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { PixSettings } from '../../../types';

interface PixSettingsCardProps {
    pixSetting: PixSettings;
    onEdit: (pixSetting: PixSettings) => void;
    onDelete: (id: number) => void;
}

const PixSettingsCard: React.FC<PixSettingsCardProps> = ({
    pixSetting,
    onEdit,
    onDelete
}) => {
    return (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-start justify-between">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Chave PIX
                        </label>
                        <div className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 font-mono">
                            {pixSetting.pixKey}
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome Completo
                        </label>
                        <div className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900">
                            {pixSetting.nameAccount}
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cidade
                        </label>
                        <div className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900">
                            {pixSetting.cityAccount}
                        </div>
                    </div>
                </div>
                
                <div className="ml-4 flex items-center space-x-2">
                    <button
                        onClick={() => onEdit(pixSetting)}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                        title="Editar chave PIX"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => pixSetting.id && onDelete(pixSetting.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remover chave PIX"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PixSettingsCard;
