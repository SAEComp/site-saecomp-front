import React from 'react';
import carrinhoIcon from '../../../../assets/lojinha-icons/perrys/carrinho.png';

// Cabeçalho do carrinho
interface CartHeaderProps {
    totalItems: number;
    onClearCart: () => void;
}

const CartHeader: React.FC<CartHeaderProps> = ({ totalItems, onClearCart }) => (
    <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
            <img 
                src={carrinhoIcon} 
                alt="Carrinho" 
                className="w-8 h-8 object-contain"
            />
            <h1 className="text-2xl font-bold text-gray-800">Meu Carrinho</h1>
            <span className="bg-green-500 text-white text-sm px-2 py-1 rounded-full">
                {totalItems} {totalItems === 1 ? 'item' : 'itens'}
            </span>
        </div>
        
        <button
            onClick={onClearCart}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            Limpar Carrinho
        </button>
    </div>
);

export default CartHeader;