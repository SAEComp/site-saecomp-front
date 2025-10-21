import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { productService } from '../services/api';
import { LoadingState, ErrorState, GenericButton, BackButton } from '../componentes';
import { 
    ProductImage, 
    ProductInfo, 
    QuantitySelector
} from './components';

const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addItem } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) {
                setError('Product ID not found');
                setLoading(false);
                return;
            }

            try {
                const response = await productService.getById(id);
                if (response.data) {
                    setProduct(response.data);
                } else {
                    setError('Produto não encontrado');
                }
            } catch (err: any) {
                setError(err.message || 'Failed to fetch product details');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            // Add product to cart multiple times based on quantity
            for (let i = 0; i < quantity; i++) {
                addItem(product);
            }
            // Redirect back to main lojinha menu
            navigate('/lojinha');
        }
    };

    const handleBackToStore = () => {
        navigate('/lojinha');
    };

    if (loading) {
        return <LoadingState message="Carregando produto..." layout="fullscreen" />;
    }

    if (error || !product) {
        return (
            <ErrorState 
                error={error || 'Produto não encontrado'} 
                onRetry={() => navigate('/lojinha')}
                retryText="Voltar à Loja"
                layout="fullscreen"
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-2 md:py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <BackButton onBack={handleBackToStore} />
                
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        <ProductImage product={product} />
                        
                        <div className="w-full lg:w-1/2 p-3 md:p-8">
                            <ProductInfo product={product} />
                            
                            {product.stock > 0 && (
                                <div className="space-y-3 md:space-y-6">
                                    <QuantitySelector 
                                        quantity={quantity}
                                        maxQuantity={product.stock}
                                        onQuantityChange={setQuantity}
                                    />
                                    
                                    <GenericButton 
                                        onClick={handleAddToCart}
                                        variant="primary"
                                        fullWidth
                                        className="sticky bottom-4 md:static"
                                    >
                                        Adicionar ao Carrinho
                                    </GenericButton>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
