import React from 'react';
import { Link } from 'react-router';
import pedidosIcon from '../../../../assets/lojinha-icons/perrys/pedidos.png';

// Link para pedidos
const OrdersLink: React.FC = () => (
    <div className="mt-8 text-center">
        <Link
            to="/lojinha/orders"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition"
        >
            <img 
                src={pedidosIcon} 
                alt="Pedidos" 
                className="w-6 h-6 object-contain"
            />
            <span>Ver Meus Pedidos</span>
        </Link>
    </div>
);

export default OrdersLink;