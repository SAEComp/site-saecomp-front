import { useEffect, useRef } from 'react';
import { listenToPayment } from '../../services/api';

const RECONNECT_DELAY_MS = 3000;

interface UsePaymentListenerProps {
    paymentId: number | null; // Used by parent component to trigger startListener
    totalAmount: number;
    onApproved: (orderId: number, earnedPoints: number) => void | Promise<void>;
    onCancelled: () => void;
    onExpired: () => void;
}

export const usePaymentListener = ({
    paymentId: _paymentId,
    totalAmount,
    onApproved,
    onCancelled,
    onExpired
}: UsePaymentListenerProps) => {
    const eventSourceRef = useRef<EventSource | null>(null);
    // Armazena os parâmetros atuais para reconexão manual
    const activeParamsRef = useRef<{ pmtId: number; orderIdForNav: number } | null>(null);
    const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Flag para saber se a conexão foi encerrada intencionalmente
    const closedIntentionallyRef = useRef(false);

    const startListener = (pmtId: number, orderIdForNav: number) => {
        // Cancela qualquer timer de reconexão pendente
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }

        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        closedIntentionallyRef.current = false;
        activeParamsRef.current = { pmtId, orderIdForNav };

        const eventSource = listenToPayment(pmtId, (status, data) => {
            if (status === 'approved') {
                closedIntentionallyRef.current = true;
                eventSource.close();
                const earnedPoints = Math.floor(totalAmount * 100);
                onApproved(orderIdForNav, earnedPoints);
            } else if (status === 'cancelled') {
                closedIntentionallyRef.current = true;
                eventSource.close();
                onCancelled();
            } else if (status === 'expired') {
                closedIntentionallyRef.current = true;
                eventSource.close();
                onExpired();
            } else if (status === 'error') {
                // Erro de conexão (ex: nginx timeout) → reconecta manualmente após delay
                // Isso evita o 401 que o auto-retry nativo do EventSource causa
                eventSource.close();
                eventSourceRef.current = null;

                if (!closedIntentionallyRef.current && activeParamsRef.current) {
                    console.warn(`SSE desconectado, reconectando em ${RECONNECT_DELAY_MS / 1000}s...`);
                    reconnectTimerRef.current = setTimeout(() => {
                        if (!closedIntentionallyRef.current && activeParamsRef.current) {
                            startListener(
                                activeParamsRef.current.pmtId,
                                activeParamsRef.current.orderIdForNav
                            );
                        }
                    }, RECONNECT_DELAY_MS);
                }
            }
        });

        eventSourceRef.current = eventSource;
    };

    const closeListener = () => {
        closedIntentionallyRef.current = true;
        activeParamsRef.current = null;

        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }

        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            closeListener();
        };
    }, []);

    return { startListener, closeListener, eventSourceRef };
};
