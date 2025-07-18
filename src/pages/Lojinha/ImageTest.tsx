import { getProductImageUrl } from './utils/imageUtils';

const ImageTest = () => {
    const testProduct = {
        _id: "1",
        name: "Coca-Cola",
        imageUrl: "/images/coca.png",
        price: 4.5,
        category: "bebidas" as const,
        description: "Test product",
        stock: 10,
        isActive: true,
        createdAt: "",
        updatedAt: ""
    };

    const imageUrl = getProductImageUrl(testProduct);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Teste de Imagens</h1>
            
            <h2>Produto de Teste:</h2>
            <p><strong>Nome:</strong> {testProduct.name}</p>
            <p><strong>imageUrl original:</strong> {testProduct.imageUrl}</p>
            <p><strong>URL processada:</strong> {imageUrl}</p>
            
            <h2>Imagem com novo enquadramento:</h2>
            <div className="aspect-square bg-gray-50 p-4 flex items-center justify-center rounded-lg" style={{ width: '200px', height: '200px', border: '1px solid #ccc' }}>
                <img 
                    src={imageUrl} 
                    alt={testProduct.name}
                    className="max-w-full max-h-full object-contain rounded-lg"
                    onLoad={() => console.log('✅ Imagem carregada com sucesso:', imageUrl)}
                    onError={(e) => {
                        console.error('❌ Erro ao carregar imagem:', imageUrl);
                        e.currentTarget.src = '/placeholder-product.svg';
                    }}
                />
            </div>
            
            <h2>Imagem original (para comparação):</h2>
            <img 
                src={imageUrl} 
                alt={testProduct.name}
                style={{ width: '200px', height: '200px', objectFit: 'cover', border: '1px solid #ccc' }}
            />
            
            <h2>Teste de URL direta:</h2>
            <img 
                src="http://localhost:5001/images/coca.png"
                alt="Teste direto"
                style={{ width: '200px', height: '200px', objectFit: 'cover', border: '1px solid #ccc' }}
                onLoad={() => console.log('✅ URL direta funcionou')}
                onError={() => console.error('❌ URL direta falhou')}
            />
        </div>
    );
};

export default ImageTest;
