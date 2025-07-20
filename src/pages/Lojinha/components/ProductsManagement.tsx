import React, { useState, useEffect } from 'react';
import { productService } from '../services/api';
import { Product } from '../types';
import ProductModal from './ProductModal';
import { getProductImageUrl } from '../utils/imageUtils';
import erroIcon from '../../../assets/lojinha-icons/perrys/ERRO.png';

const ProductsManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [filter, setFilter] = useState<'all' | 'doces' | 'salgados' | 'bebidas'>('all');

    useEffect(() => {
        loadProducts();
    }, [filter]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await productService.getAll({ 
                category: filter === 'all' ? undefined : filter,
                limit: 100 
            });
            
            if (response.success && response.data) {
                setProducts(response.data);
            } else {
                throw new Error(response.message || 'Erro ao carregar produtos');
            }
        } catch (err: any) {
            console.error('Error loading products:', err);
            setError(err.message || 'Erro ao carregar produtos');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProduct = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteProduct = async (product: Product) => {
        if (!confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
            return;
        }

        try {
            await productService.delete(product._id);
            await loadProducts(); // Recarregar lista
        } catch (err: any) {
            console.error('Error deleting product:', err);
            alert('Erro ao excluir produto: ' + (err.message || 'Erro desconhecido'));
        }
    };

    const handleProductSaved = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        loadProducts(); // Recarregar lista
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const getCategoryLabel = (category: string) => {
        const labels = {
            'doces': 'Doces',
            'salgados': 'Salgados',
            'bebidas': 'Bebidas'
        };
        return labels[category as keyof typeof labels] || category;
    };

    const getCategoryColor = (category: string) => {
        const colors = {
            'doces': 'bg-pink-100 text-pink-800',
            'salgados': 'bg-orange-100 text-orange-800',
            'bebidas': 'bg-green-100 text-green-800'
        };
        return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando produtos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center py-12">
                <img 
                    src={erroIcon} 
                    alt="Erro" 
                    className="w-20 h-20 mb-4 opacity-60"
                />
                <p className="text-red-600 text-center mb-4">{error}</p>
                <button 
                    onClick={loadProducts}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200"
                >
                    Tentar Novamente
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header e filtros */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Gerenciar Produtos</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {products.length} produto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03B04B] focus:border-[#03B04B]"
                    >
                        <option value="all">Todas as categorias</option>
                        <option value="doces">Doces</option>
                        <option value="salgados">Salgados</option>
                        <option value="bebidas">Bebidas</option>
                    </select>
                    
                    <button
                        onClick={handleCreateProduct}
                        className="px-4 py-2 bg-[#03B04B] text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                    >
                        <span>+</span>
                        <span>Novo Produto</span>
                    </button>
                </div>
            </div>

            {/* Lista de produtos */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {products.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Produto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Categoria
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Preço
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estoque
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12">
                                                    <img 
                                                        className="h-12 w-12 rounded-lg object-cover" 
                                                        src={getProductImageUrl(product)} 
                                                        alt={product.name}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {product.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 max-w-xs truncate">
                                                        {product.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(product.category)}`}>
                                                {getCategoryLabel(product.category)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {formatCurrency(product.price)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                product.stock > 10 
                                                    ? 'bg-green-100 text-green-800'
                                                    : product.stock > 0
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {product.stock} unidades
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                product.isActive 
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {product.isActive ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => handleEditProduct(product)}
                                                className="text-[#03B04B] hover:text-green-600 transition-colors"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product)}
                                                className="text-red-600 hover:text-red-700 transition-colors ml-3"
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-6 text-center">
                        <p className="text-gray-500 mb-4">Nenhum produto encontrado</p>
                        <button
                            onClick={handleCreateProduct}
                            className="px-4 py-2 bg-[#03B04B] text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                            Criar primeiro produto
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <ProductModal
                    product={editingProduct}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleProductSaved}
                />
            )}
        </div>
    );
};

export default ProductsManagement;
