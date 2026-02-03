import { useState, useEffect } from 'react';
import { getProducts } from '../services/api';

export const useProductsCheck = () => {
    const [hasProducts, setHasProducts] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(true);

    const checkProducts = async () => {
        try {
            setIsChecking(true);
            const response = await getProducts();
            setHasProducts(response.data ? response.data.length > 0 : false);
        } catch (error) {
            console.error('Erro ao verificar produtos:', error);
            setHasProducts(false);
        } finally {
            setIsChecking(false);
        }
    };

    useEffect(() => {
        checkProducts();
    }, []);

    return { hasProducts, isChecking, recheckProducts: checkProducts };
};
