import React, { useState, useEffect } from 'react';
import { productService } from '../../services/api';
import { Product } from '../../types';
import { ProductModal } from '../../componentes';
import erroIcon from '../../../../assets/lojinha-icons/perrys/ERRO.png';
import tristeIcon from '../../../../assets/lojinha-icons/perrys/triste.png';
import ConfirmModal from '../../../../components/Inputs/ConfirmModal';
import { Table } from '../../../../components/Inputs';
import { ProductFilters, ProductMobileCard, useProductTableColumns } from './components';

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
                pageSize: 100,
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

    const columns = useProductTableColumns({
        onEditProduct: handleEditProduct,
        onDeleteProduct: handleDeleteProduct,
        formatCurrency,
        getCategoryLabel,
        getCategoryColor
    });

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
            <ProductFilters
                filter={filter}
                onFilterChange={setFilter}
                onCreateProduct={handleCreateProduct}
                totalProducts={products.length}
            />

            {/* Lista de produtos */}
            <Table<Product>
                columns={columns}
                data={products}
                loading={loading}
                emptyText="Nenhum produto encontrado"
                emptyIcon={tristeIcon}
                emptyAction={{
                    text: "Criar primeiro produto",
                    onClick: handleCreateProduct
                }}
                mobileView={(product) => (
                    <ProductMobileCard
                        product={product}
                        onEdit={handleEditProduct}
                        onDelete={handleDeleteProduct}
                        formatCurrency={formatCurrency}
                        getCategoryLabel={getCategoryLabel}
                        getCategoryColor={getCategoryColor}
                    />
                )}
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
