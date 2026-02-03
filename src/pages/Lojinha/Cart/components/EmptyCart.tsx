import React from 'react';
import { Link } from 'react-router';
import carrinhoIcon from '../../../../assets/lojinha-icons/perrys/carrinho.png';

// Estado quando o carrinho está vazio
const EmptyCart: React.FC = () => (
    <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
            <div className="text-center py-16">
                <img 
                    src={carrinhoIcon} 
                    alt="Carrinho vazio" 
                    className="w-28 h-28 md:w-32 md:h-32 mx-auto mb-4 object-contain drop-shadow-lg"
                />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Seu carrinho está vazio</h2>
                <p className="text-gray-600 mb-6">Adicione alguns produtos deliciosos ao seu carrinho!</p>
                <Link 
                    to="/lojinha"
                    className="bg-[#03B04B] hover:bg-green-600 opacity-90 text-white px-6 py-3 rounded-lg font-medium transition"
                >
                    Continuar Comprando
                </Link>
            </div>
        </div>
    </div>
);

export default EmptyCart;