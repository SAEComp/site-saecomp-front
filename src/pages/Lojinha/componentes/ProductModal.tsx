import { useState, useEffect } from 'react';
import { productService } from '../services/api';
import { Product } from '../types';
import erroIcon from '../../../assets/lojinha-icons/perrys/ERRO.png';
import TextInput from '../../../components/Inputs/TextInput';
import NumberInput from '../../../components/Inputs/NumberInput';
import TextareaInput from '../../../components/Inputs/TextareaInput';
import DropDown, { IOption } from '../../../components/Inputs/DropDown';
import FileUploadInput from '../../../components/Inputs/FileUploadInput';

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

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setFormData(prev => ({ ...prev, imageUrl: '' }));
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome do Produto *
                                </label>
                                <TextInput
                                    label="Ex: Brigadeiro"
                                    value={formData.name}
                                    onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                                    className="border border-gray-300"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Categoria *
                                </label>
                                <DropDown
                                    placeholder="Selecione uma categoria"
                                    options={[
                                        { id: 'doces', label: 'Doces' },
                                        { id: 'salgados', label: 'Salgados' },
                                        { id: 'bebidas', label: 'Bebidas' }
                                    ]}
                                    value={formData.category ? { id: formData.category, label: formData.category === 'doces' ? 'Doces' : formData.category === 'salgados' ? 'Salgados' : 'Bebidas' } : null}
                                    onChange={(option) => setFormData(prev => ({ ...prev, category: (option?.id as 'doces' | 'salgados' | 'bebidas') || 'doces' }))}
                                    searchable={false}
                                    clearable={false}
                                    className="border border-gray-300"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Preço (R$) *
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">R$</span>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                        min="0"
                                        step="0.01"
                                        className="block w-full rounded-lg py-3 pl-10 pr-3 text-gray-900 font-inter placeholder-gray-400 placeholder-opacity-100 focus:placeholder-opacity-30 focus:outline-none focus:ring-2 focus:ring-[#03B04B] focus:border-transparent border border-gray-300"
                                        placeholder="0,00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Estoque
                                </label>
                                <NumberInput
                                    placeholder="Quantidade em estoque"
                                    min={0}
                                    max={999}
                                    defaultValue={formData.stock}
                                    onChange={(value) => setFormData(prev => ({ ...prev, stock: value || 0 }))}
                                    className="border border-gray-300"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descrição *
                            </label>
                            <TextareaInput
                                label="Descreva o produto..."
                                value={formData.description}
                                onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                                rows={3}
                                maxLength={500}
                                required
                                className="border border-gray-300"
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
                            
                            <FileUploadInput
                                label="Imagem do Produto"
                                accept="image/*"
                                maxSize={5}
                                onFileSelect={(files) => {
                                    if (files && files[0]) {
                                        const file = files[0];
                                        setImageFile(file);
                                        const reader = new FileReader();
                                        reader.onload = (e) => {
                                            setImagePreview(e.target?.result as string);
                                        };
                                        reader.readAsDataURL(file);
                                        setError(null);
                                    }
                                }}
                            />
                            
                            <p className="text-xs text-gray-500 mt-2">
                                Se nenhuma imagem for enviada, será usada a imagem padrão da categoria
                            </p>
                        </div>

                        <div>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
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
