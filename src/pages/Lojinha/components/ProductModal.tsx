import React, { useState, useEffect } from 'react';
import { productService } from '../services/api';
import { Product } from '../types';
import erroIcon from '../../../assets/lojinha-icons/perrys/ERRO.png';

interface ProductModalProps {
    product?: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
    product,
    isOpen,
    onClose,
    onSave
}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        category: 'doces' as 'doces' | 'salgados' | 'bebidas',
        stock: 0,
        isActive: true
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                imageUrl: product.imageUrl,
                category: product.category,
                stock: product.stock,
                isActive: product.isActive
            });
        } else {
            setFormData({
                name: '',
                description: '',
                price: 0,
                imageUrl: '',
                category: 'doces',
                stock: 0,
                isActive: true
            });
        }
        setImageFile(null);
        setImagePreview(null);
        setError(null);
    }, [product, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' 
                ? parseFloat(value) || 0
                : type === 'checkbox'
                ? (e.target as HTMLInputElement).checked
                : value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validar tipo de arquivo
            if (!file.type.startsWith('image/')) {
                setError('Por favor, selecione apenas arquivos de imagem');
                return;
            }
            
            // Validar tamanho (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('A imagem deve ter no máximo 5MB');
                return;
            }
            
            setImageFile(file);
            
            // Criar preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            
            setError(null);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setFormData(prev => ({ ...prev, imageUrl: '' }));
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files && files[0]) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                if (file.size <= 5 * 1024 * 1024) {
                    setImageFile(file);
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setImagePreview(e.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                    setError(null);
                } else {
                    setError('A imagem deve ter no máximo 5MB');
                }
            } else {
                setError('Por favor, selecione apenas arquivos de imagem');
            }
        }
    };

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Validações básicas
            if (!formData.name.trim()) {
                throw new Error('Nome do produto é obrigatório');
            }
            if (!formData.description.trim()) {
                throw new Error('Descrição do produto é obrigatória');
            }
            if (formData.price <= 0) {
                throw new Error('Preço deve ser maior que zero');
            }
            if (formData.stock < 0) {
                throw new Error('Estoque não pode ser negativo');
            }

            // Preparar dados para envio
            let dataToSend = { ...formData };

            // Se há uma nova imagem para upload
            if (imageFile) {
                try {
                    const base64Image = await convertFileToBase64(imageFile);
                    dataToSend.imageUrl = base64Image;
                } catch (err) {
                    throw new Error('Erro ao processar a imagem');
                }
            }

            if (product) {
                // Editando produto existente
                await productService.update(product._id, dataToSend);
            } else {
                // Criando novo produto
                await productService.create(dataToSend);
            }

            onSave();
        } catch (err: any) {
            console.error('Error saving product:', err);
            setError(err.message || 'Erro ao salvar produto');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {product ? 'Editar Produto' : 'Novo Produto'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <span className="text-2xl">×</span>
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center space-x-3">
                                <img 
                                    src={erroIcon} 
                                    alt="Erro" 
                                    className="w-6 h-6 object-contain"
                                />
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome do Produto *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03B04B] focus:border-[#03B04B]"
                                    placeholder="Ex: Brigadeiro"
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                    Categoria *
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03B04B] focus:border-[#03B04B]"
                                >
                                    <option value="doces">Doces</option>
                                    <option value="salgados">Salgados</option>
                                    <option value="bebidas">Bebidas</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                    Preço (R$) *
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03B04B] focus:border-[#03B04B]"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                                    Estoque
                                </label>
                                <input
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03B04B] focus:border-[#03B04B]"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Descrição *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03B04B] focus:border-[#03B04B]"
                                placeholder="Descreva o produto..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Imagem do Produto
                            </label>
                            
                            {/* Preview da imagem */}
                            {(imagePreview || formData.imageUrl) && (
                                <div className="mb-4">
                                    <div className="relative inline-block">
                                        <img 
                                            src={imagePreview || formData.imageUrl} 
                                            alt="Preview" 
                                            className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {/* Upload de arquivo */}
                            <div 
                                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                    imageFile || imagePreview ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                                }`}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    id="imageFile"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <label htmlFor="imageFile" className="cursor-pointer">
                                    <div className="text-gray-400 mb-2">
                                        <svg className="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {imageFile ? (
                                            <span className="text-green-600 font-medium">
                                                ✓ Imagem selecionada: {imageFile.name}
                                            </span>
                                        ) : (
                                            <>
                                                <span className="font-medium text-[#03B04B] hover:text-green-600">
                                                    Clique para fazer upload
                                                </span>
                                                {' '}ou arraste uma imagem aqui
                                            </>
                                        )}
                                    </div>
                                    {!imageFile && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            PNG, JPG, JPEG até 5MB
                                        </p>
                                    )}
                                </label>
                            </div>
                            
                            <p className="text-xs text-gray-500 mt-2">
                                Se nenhuma imagem for enviada, será usada a imagem padrão da categoria
                            </p>
                        </div>

                        <div>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-300 text-[#03B04B] focus:ring-[#03B04B]"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Produto ativo (visível na loja)
                                </span>
                            </label>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto px-4 py-2 bg-[#03B04B] text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Salvando...
                                    </>
                                ) : (
                                    product ? 'Atualizar Produto' : 'Criar Produto'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
