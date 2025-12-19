import { useState, useEffect } from 'react';
import { pixService } from '../../services/api';
import { PixSettings } from '../../types';
import { PixModal } from '../../componentes';
import erroIcon from '../../../../assets/lojinha-icons/perrys/ERRO.png';
import ConfirmModal from '../../../../components/Inputs/ConfirmModal';

const PixManagement: React.FC = () => {
    const [pixSettings, setPixSettings] = useState<PixSettings[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPixSettings, setEditingPixSettings] = useState<PixSettings | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingPixId, setDeletingPixId] = useState<number | null>(null);

    useEffect(() => {
        loadPixSettings();
    }, []);

    const loadPixSettings = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await pixService.getAll();
            if (response.success && response.data) {
                setPixSettings(response.data);
            } else {
                // Não há chave PIX cadastrada, não é um erro
                setPixSettings([]);
            }
        } catch (err: any) {
            console.error('Erro ao carregar configurações PIX:', err);
            // Verificar se é erro 404 (endpoint não implementado) ou erro de endpoint não encontrado
            if (err.message && (err.message.includes('Cannot GET') || err.message.includes('404') || err.response?.status === 404)) {
                // Endpoint ainda não implementado no backend, não mostrar erro
                setPixSettings([]);
            } else if (err.message && !err.message.includes('não encontrado') && !err.message.includes('not found')) {
                setError(err.message || 'Erro ao carregar configurações PIX');
            } else {
                setPixSettings([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSavePixSettings = async () => {
        await loadPixSettings();
        setIsModalOpen(false);
        setEditingPixSettings(null);
    };

    const handleEditPixSettings = (pixSetting: PixSettings) => {
        setEditingPixSettings(pixSetting);
        setIsModalOpen(true);
    };

    const handleDeletePixSettings = (id: number) => {
        setDeletingPixId(id);
        setShowDeleteModal(true);
    };

    const confirmDeletePix = async () => {
        if (!deletingPixId) return;
        
        try {
            await pixService.delete(deletingPixId);
            await loadPixSettings();
            setShowDeleteModal(false);
            setDeletingPixId(null);
        } catch (err: any) {
            console.error('Erro ao deletar chave PIX:', err);
            setError(err.message || 'Erro ao deletar chave PIX');
            setShowDeleteModal(false);
            setDeletingPixId(null);
        }
    };

    const handleAddPixSettings = () => {
        setEditingPixSettings(null);
        setIsModalOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className="ml-2 text-gray-600">Carregando configurações PIX...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Gerenciar Chaves PIX</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {pixSettings.length} chave{pixSettings.length !== 1 ? 's' : ''} PIX configurada{pixSettings.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={handleAddPixSettings}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Adicionar Chave PIX</span>
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3">
                        <img 
                            src={erroIcon} 
                            alt="Erro" 
                            className="w-12 h-12 object-contain"
                        />
                        <div>
                            <h3 className="text-red-900 font-medium">Erro ao carregar configurações PIX</h3>
                            <p className="text-red-700 text-sm mt-1">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* PIX Settings List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Chaves PIX Cadastradas
                    </h3>
                    
                    {pixSettings.length > 0 ? (
                        <div className="space-y-4">
                            {pixSettings.map((pixSetting) => (
                                <div key={pixSetting.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
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
                                                onClick={() => handleEditPixSettings(pixSetting)}
                                                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Editar chave PIX"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => pixSetting.id && handleDeletePixSettings(pixSetting.id)}
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
                            ))}
                        </div>
                    ) : (
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
                                onClick={handleAddPixSettings}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Adicionar Chave PIX</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <PixModal
                pixSettings={editingPixSettings}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingPixSettings(null);
                }}
                onSave={handleSavePixSettings}
            />
            
            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                title="Remover Chave PIX"
                message="Tem certeza que deseja remover esta chave PIX? Esta ação não pode ser desfeita."
                confirmText="Remover"
                cancelText="Cancelar"
                type="danger"
                onConfirm={confirmDeletePix}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setDeletingPixId(null);
                }}
            />
        </div>
    );
};

export default PixManagement;