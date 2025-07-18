import { useEffect, useState } from 'react';
import { getProducts } from './services/api';

const SimpleProductList = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                console.log('🔄 Starting to load products...');
                setLoading(true);
                setError(null);
                
                const response = await getProducts();
                console.log('✅ Products response:', response);
                
                if (response.data) {
                    setProducts(response.data);
                    console.log(`✅ Loaded ${response.data.length} products`);
                } else {
                    setProducts([]);
                    console.log('⚠️ No products data in response');
                }
            } catch (err) {
                console.error('❌ Error loading products:', err);
                setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Carregando produtos...</h2>
                <div>🔄 Aguarde...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Erro ao carregar produtos</h2>
                <p style={{ color: 'red' }}>{error}</p>
                <button onClick={() => window.location.reload()}>
                    Tentar novamente
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>Produtos da Lojinha ({products.length})</h2>
            {products.length === 0 ? (
                <p>Nenhum produto encontrado.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                    {products.map((product) => (
                        <div key={product._id} style={{ 
                            border: '1px solid #ddd', 
                            padding: '10px', 
                            borderRadius: '8px',
                            backgroundColor: '#f9f9f9'
                        }}>
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p><strong>Preço:</strong> R$ {product.price.toFixed(2)}</p>
                            <p><strong>Categoria:</strong> {product.category}</p>
                            <p><strong>Estoque:</strong> {product.stock}</p>
                            <p><strong>Disponível:</strong> {product.isAvailable ? '✅ Sim' : '❌ Não'}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SimpleProductList;
