import { useState, useEffect } from 'react';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { pixService } from '../services/api';
import { PixSettings } from '../types';
import erroIcon from '../../../assets/lojinha-icons/perrys/ERRO.png';
import TextInput from '../../../components/Inputs/TextInput';

interface PixModalProps {
    pixSettings?: PixSettings | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

const PixModal: React.FC<PixModalProps> = ({
    pixSettings,
    isOpen,
    onClose,
    onSave
}) => {
    const [formData, setFormData] = useState({
        pixKey: '',
        nameAccount: '',
        cityAccount: '',
        tokenAccount: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (pixSettings) {
            setFormData({
                pixKey: pixSettings.pixKey,
                nameAccount: pixSettings.nameAccount,
                cityAccount: pixSettings.cityAccount,
                tokenAccount: pixSettings.tokenAccount || ''
            });
        } else {
            setFormData({
                pixKey: '',
                nameAccount: '',
                cityAccount: '',
                tokenAccount: ''
            });
        }
        setError(null);
    }, [pixSettings, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.pixKey.trim() || !formData.nameAccount.trim() || !formData.cityAccount.trim() || !formData.tokenAccount.trim()) {
            setError('Todos os campos são obrigatórios');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (pixSettings?._id) {
                // Atualizar configuração existente
                await pixService.create(formData); // Backend não tem rota PUT, usa POST
            } else {
                // Criar nova configuração
                await pixService.create(formData);
            }
            onSave();
        } catch (err: any) {
            console.error('Erro ao salvar configurações PIX:', err);
            // Verificar se é erro de endpoint não implementado
            if (err.message && (err.message.includes('Cannot GET') || err.message.includes('Cannot POST') || err.message.includes('Cannot PUT') || err.message.includes('404') || err.response?.status === 404)) {
                setError('Funcionalidade em desenvolvimento. O backend para gerenciar chaves PIX ainda não foi implementado.');
            } else {
                setError(err.message || 'Erro ao salvar configurações PIX');
            }
        } finally {
            setLoading(false);
        }
    };



    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {pixSettings ? 'Editar Chave PIX' : 'Adicionar Chave PIX'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={loading}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center space-x-3">
                                <img 
                                    src={erroIcon} 
                                    alt="Erro" 
                                    className="w-6 h-6 object-contain"
                                />
                                <div>
                                    <p className="text-red-700 text-sm">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Chave PIX *
                        </label>
                        <TextInput
                            label="Ex: contato@saecomp.com.br ou (11) 99999-9999"
                            value={formData.pixKey}
                            onChange={(value) => setFormData(prev => ({ ...prev, pixKey: value }))}
                            className="border border-gray-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome Completo *
                        </label>
                        <TextInput
                            label="Ex: SAEComp - Empresa Júnior"
                            value={formData.nameAccount}
                            onChange={(value) => setFormData(prev => ({ ...prev, nameAccount: value }))}
                            className="border border-gray-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cidade *
                        </label>
                        <TextInput
                            label="Ex: São Paulo"
                            value={formData.cityAccount}
                            onChange={(value) => setFormData(prev => ({ ...prev, cityAccount: value }))}
                            className="border border-gray-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Token Mercado Pago *
                        </label>
                        <TextInput
                            label="Ex: APP_USR-1234567890..."
                            value={formData.tokenAccount}
                            onChange={(value) => setFormData(prev => ({ ...prev, tokenAccount: value }))}
                            className="border border-gray-300"
                        />
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300 px-4 py-2 rounded-lg font-medium transition-colors"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Salvando...</span>
                                </>
                            ) : (
                                <span>Salvar</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PixModal;