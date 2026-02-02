import { useEffect, useRef } from 'react';
import { listenToPayment } from '../../services/api';

interface UsePaymentListenerProps {
    paymentId: number | null; // Used by parent component to trigger startListener
    totalAmount: number;
    onApproved: (orderId: number, earnedPoints: number) => void;
    onCancelled: () => void;
    onExpired: () => void;
}

export const usePaymentListener = ({
    paymentId,
    totalAmount,
    onApproved,
    onCancelled,
    onExpired
}: UsePaymentListenerProps) => {
    const eventSourceRef = useRef<EventSource | null>(null);

    const startListener = (pmtId: number, orderIdForNav: number) => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        const eventSource = listenToPayment(pmtId, (status, data) => {
            if (status === 'approved') {
                eventSource.close();
                const earnedPoints = Math.floor(totalAmount * 100);
                onApproved(orderIdForNav, earnedPoints);
            } else if (status === 'cancelled') {
                eventSource.close();
                onCancelled();
            } else if (status === 'expired') {
                eventSource.close();
                onExpired();
            } else if (status === 'error') {
                console.error('Erro no SSE:', data);
            }
        });

        eventSourceRef.current = eventSource;
    };

    const closeListener = () => {
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
