import React from 'react';
import { useCart } from '../hooks/useCart';

const CartDebug: React.FC = () => {
    const { state, addItem, getTotalItems } = useCart();
    
    const testProduct = {
        _id: 'test-product',
        name: 'Produto Teste',
        description: 'Produto para teste',
        price: 10.00,
        category: 'doces' as const,
        image: 'test.png',
        imageUrl: 'test.png',
        stock: 10,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const handleAddTestItem = () => {
        addItem(testProduct);
    };

    return (
        <div className="fixed bottom-4 right-4 bg-white border-2 border-gray-300 rounded-lg p-4 shadow-lg z-50">
            <h3 className="font-bold mb-2">Debug do Carrinho</h3>
            <p>Total de itens: {getTotalItems()}</p>
            <p>Itens no estado: {state.items.length}</p>
            <button 
                onClick={handleAddTestItem}
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
            >
                Adicionar item teste
            </button>
            <div className="mt-2 text-xs">
                <strong>Itens:</strong>
                {state.items.map((item, index) => (
                    <div key={index}>{item.name} (x{item.quantity})</div>
                ))}
            </div>
        </div>
    );
};

export default CartDebug;
