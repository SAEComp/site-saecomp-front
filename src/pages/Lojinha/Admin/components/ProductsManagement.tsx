import React, { useState, useEffect } from 'react';
import { productService } from '../../services/api';
import { Product } from '../../types';
import { ProductModal } from '../../componentes';
import { getProductImageUrl } from '../../utils/imageUtils';
import erroIcon from '../../../../assets/lojinha-icons/perrys/ERRO.png';
import ConfirmModal from '../../../../components/Inputs/ConfirmModal';
import { Table, ITableColumn } from '../../../../components/Inputs';

const ProductsManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [filter, setFilter] = useState<'all' | 'doces' | 'salgados' | 'bebidas'>('all');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    useEffect(() => {
        loadProducts();
    }, [filter]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Mapear categorias do frontend para backend
            const categoryMap: Record<string, 'sweet' | 'salty' | 'drink' | undefined> = {
                'all': undefined,
                'doces': 'sweet',
                'salgados': 'salty',
                'bebidas': 'drink'
            };
            
            const response = await productService.getAll({ 
                category: categoryMap[filter],
                limit: 100,
                includeInactive: true // Admin vê todos os produtos (ativos e inativos)
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

    const handleDeleteProduct = (product: Product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const confirmDeleteProduct = async () => {
        if (!productToDelete) return;

        try {
            await productService.delete(productToDelete.id);
            await loadProducts(); // Recarregar lista
            setShowDeleteModal(false);
            setProductToDelete(null);
        } catch (err: any) {
            console.error('Error deleting product:', err);
            alert('Erro ao excluir produto: ' + (err.message || 'Erro desconhecido'));
            setShowDeleteModal(false);
            setProductToDelete(null);
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
            'sweet': 'Doces',
            'salty': 'Salgados',
            'drink': 'Bebidas',
            // Mantém compatibilidade com nomes antigos
            'doces': 'Doces',
            'salgados': 'Salgados',
            'bebidas': 'Bebidas'
        };
        return labels[category as keyof typeof labels] || category;
    };

    const getCategoryColor = (category: string) => {
        const colors = {
            'sweet': 'text-pink-600',
            'salty': 'text-orange-600', 
            'drink': 'text-[#03B04B]',
            // Mantém compatibilidade com nomes antigos
            'doces': 'text-pink-600',
            'salgados': 'text-orange-600', 
            'bebidas': 'text-[#03B04B]'
        };
        return colors[category as keyof typeof colors] || 'text-gray-600';
    };

    const mobileView = (product: Product) => (
        <div className="p-4">
            <div className="flex items-start gap-3 mb-3">
                <img 
                    className="h-16 w-16 rounded-lg object-cover flex-shrink-0" 
                    src={getProductImageUrl(product)} 
                    alt={product.name}
                />
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                        {product.description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-medium ${getCategoryColor(product.category)}`}>
                            {getCategoryLabel(product.category)}
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                            product.isActive 
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                        }`}>
                            {product.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                    <span className="text-gray-500 text-xs">Preço:</span>
                    <div className="font-medium text-gray-900">
                        {formatCurrency(product.value)}
                    </div>
                </div>
                <div>
                    <span className="text-gray-500 text-xs">Estoque:</span>
                    <div className={`font-medium ${
                        product.quantity > 10 
                            ? 'text-[#03B04B]'
                            : product.quantity > 0
                            ? 'text-orange-600'
                            : 'text-red-600'
                    }`}>
                        {product.quantity} un.
                    </div>
                </div>
            </div>
            <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 px-3 py-2 rounded-lg transition-colors"
                    title="Editar produto"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                </button>
                <button
                    onClick={() => handleDeleteProduct(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                    title="Excluir produto"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Excluir
                </button>
            </div>
        </div>
    );

    const columns: ITableColumn<Product>[] = [
        {
            key: 'product',
            title: 'Produto',
            render: (_, product) => (
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
            )
        },
        {
            key: 'category',
            title: 'Categoria',
            render: (_, product) => (
                <span className={`text-sm font-medium ${getCategoryColor(product.category)}`}>
                    {getCategoryLabel(product.category)}
                </span>
            )
        },
        {
            key: 'price',
            title: 'Preço',
            render: (_, product) => (
                <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(product.value)}
                </span>
            )
        },
        {
            key: 'stock',
            title: 'Estoque',
            render: (_, product) => (
                <span className={`text-sm font-medium ${
                    product.quantity > 10 
                        ? 'text-[#03B04B]'
                        : product.quantity > 0
                        ? 'text-orange-600'
                        : 'text-red-600'
                }`}>
                    {product.quantity} unidades
                </span>
            )
        },
        {
            key: 'status',
            title: 'Status',
            render: (_, product) => (
                <span className={`text-sm font-medium ${
                    product.isActive 
                        ? 'text-[#03B04B]'
                        : 'text-red-600'
                }`}>
                    {product.isActive ? 'Ativo' : 'Inativo'}
                </span>
            )
        },
        {
            key: 'actions',
            title: 'Ações',
            align: 'right',
            render: (_, product) => (
                <div className="flex items-center justify-end space-x-2">
                    <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                        title="Editar produto"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => handleDeleteProduct(product)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir produto"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            )
        }
    ];

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
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center max-w-md">
                    <img 
                        src={erroIcon} 
                        alt="Erro" 
                        className="w-24 h-24 mx-auto mb-6 object-contain"
                    />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Erro ao carregar produtos
                    </h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        onClick={loadProducts}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium shadow-sm"
                    >
                        Tentar Novamente
                    </button>
                </div>
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
            <Table<Product>
                columns={columns}
                data={products}
                loading={loading}
                emptyText="Nenhum produto encontrado"
                emptyIcon={erroIcon}
                emptyAction={{
                    text: "Criar primeiro produto",
                    onClick: handleCreateProduct
                }}
                mobileView={mobileView}
            />

            {/* Modal */}
            {isModalOpen && (
                <ProductModal
                    product={editingProduct}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleProductSaved}
                />
            )}

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                title="Excluir Produto"
                message={`Tem certeza que deseja excluir o produto "${productToDelete?.name}"? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                cancelText="Cancelar"
                type="danger"
                onConfirm={confirmDeleteProduct}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setProductToDelete(null);
                }}
            />
        </div>
    );
};

export default ProductsManagement;
