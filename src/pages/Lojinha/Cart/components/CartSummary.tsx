import React from 'react';
import { Link } from 'react-router';

// Resumo do pedido
interface CartSummaryProps {
    totalItems: number;
    totalPrice: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ totalItems, totalPrice }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h2>
        
        <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'itens'})</span>
                <span>R$ {totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>R$ {totalPrice.toFixed(2)}</span>
                </div>
            </div>
        </div>
        
        <div className="mt-6 space-y-3">
            <Link
                to="/lojinha/checkout"
                className="w-full bg-[#03B04B] hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium text-center block transition"
            >
                Finalizar Compra
            </Link>
            
            <Link
                to="/lojinha"
                className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium text-center block transition"
            >
                Continuar Comprando
            </Link>
        </div>
    </div>
);

export default CartSummary;