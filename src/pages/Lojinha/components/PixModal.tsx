import React, { useState, useEffect } from 'react';
import { pixService } from '../services/api';
import { PixSettings } from '../types';
import erroIcon from '../../../assets/lojinha-icons/perrys/ERRO.png';

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
        ownerName: '',
        city: '',
        isActive: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (pixSettings) {
            setFormData({
                pixKey: pixSettings.pixKey,
                ownerName: pixSettings.ownerName,
                city: pixSettings.city,
                isActive: pixSettings.isActive
            });
        } else {
            setFormData({
                pixKey: '',
                ownerName: '',
                city: '',
                isActive: true
            });
        }
        setError(null);
    }, [pixSettings, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.pixKey.trim() || !formData.ownerName.trim() || !formData.city.trim()) {
            setError('Todos os campos são obrigatórios');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (pixSettings?._id) {
                // Atualizar configuração existente
                await pixService.updatePixSettings(pixSettings._id, formData);
            } else {
                // Criar nova configuração
                await pixService.createPixSettings(formData);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
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
                        <label htmlFor="pixKey" className="block text-sm font-medium text-gray-700 mb-1">
                            Chave PIX *
                        </label>
                        <input
                            type="text"
                            id="pixKey"
                            name="pixKey"
                            value={formData.pixKey}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Ex: contato@saecomp.com.br ou (11) 99999-9999"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">
                            Nome Completo *
                        </label>
                        <input
                            type="text"
                            id="ownerName"
                            name="ownerName"
                            value={formData.ownerName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Ex: SAEComp - Empresa Júnior"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            Cidade *
                        </label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Ex: São Paulo"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            disabled={loading}
                        />
                        <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                            Chave PIX ativa
                        </label>
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