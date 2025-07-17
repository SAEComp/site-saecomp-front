import React from 'react';
import { Outlet } from 'react-router';
import { CartProvider } from './hooks/useCart';

const LojinhaLayout: React.FC = () => {
    return (
        <CartProvider>
            <Outlet />
        </CartProvider>
    );
};

export default LojinhaLayout;
