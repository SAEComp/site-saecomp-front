import { useState, useEffect } from 'react';

interface UsePaymentTimerProps {
    timeout: number;
    orderCreatedAt: Date | null;
    onTimeout: () => void;
}

export const usePaymentTimer = ({ timeout, orderCreatedAt: _orderCreatedAt, onTimeout }: UsePaymentTimerProps) => {
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [isExpired, setIsExpired] = useState(false);

    // Calcular tempo restante baseado na data de criação
    const calculateTimeLeft = (createdAt: Date): number => {
        const now = new Date();
        const elapsedSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);
        const remaining = timeout - elapsedSeconds;
        return Math.max(0, remaining);
    };

    // Timer effect - decrements every second
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev === null || prev <= 1) {
                    setIsExpired(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Handle timeout expiration
    useEffect(() => {
        if (isExpired) {
            onTimeout();
        }
    }, [isExpired, onTimeout]);

    const setInitialTime = (createdAt: Date) => {
        const remaining = calculateTimeLeft(createdAt);
        setTimeLeft(remaining);
        
        if (remaining <= 0) {
            setIsExpired(true);
        }
    };

    return { timeLeft, isExpired, setTimeLeft, setIsExpired, setInitialTime };
};
