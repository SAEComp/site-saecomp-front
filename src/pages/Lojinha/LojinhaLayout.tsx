import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { getPendingPayments } from './services/api';

const LojinhaLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Verifica ao entrar em qualquer página da lojinha se um pedido foi pago
    // enquanto o usuário estava fora (localStorage tem o buyOrderId salvo)
    useEffect(() => {
        // Não roda na página de sucesso para evitar loop
        if (location.pathname.includes('/sucesso')) return;

        const savedStr = localStorage.getItem('lojinha:pending_order');
        if (!savedStr) return;

        const { buyOrderId } = JSON.parse(savedStr);

        getPendingPayments()
            .then(response => {
                const pendingList = (response.success && response.data) ? response.data : [];
                const stillPending = pendingList.some(
                    (o: any) => String(o.id) === String(buyOrderId)
                );
                if (!stillPending) {
                    // Não está mais pendente → foi pago
                    localStorage.removeItem('lojinha:pending_order');
                    navigate(`/lojinha/sucesso/${buyOrderId}`, { replace: true });
                }
            })
            .catch(() => {
                // Ignora erros silenciosamente
            });
    }, [location.pathname]);

    return <Outlet />;
};

export default LojinhaLayout;
