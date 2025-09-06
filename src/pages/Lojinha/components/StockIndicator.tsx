import React from 'react';

interface StockIndicatorProps {
    stock: number;
    showWarning?: boolean;
    className?: string;
}

const StockIndicator: React.FC<StockIndicatorProps> = ({ 
    stock, 
    showWarning = true, 
    className = '' 
}) => {
    const getStockStatus = () => {
        if (stock === 0) return 'out-of-stock';
        if (stock < 10) return 'low-stock';
        return 'in-stock';
    };

    const getStockText = () => {
        if (stock === 0) return 'Fora de estoque';
        if (stock === 1) return `${stock} disponível`;
        return `${stock} disponíveis`;
    };

    const stockStatus = getStockStatus();

    const getStatusStyles = () => {
        switch (stockStatus) {
            case 'out-of-stock':
                return 'text-red-600';
            case 'low-stock':
                return 'text-orange-600';
            default:
                return 'text-[#03B04B]';
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <div className={`text-base font-medium flex items-center gap-2 ${getStatusStyles()}`}>
                {/* Ícone baseado no status do estoque */}
                {stockStatus === 'out-of-stock' ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                )}
                <span>{getStockText()}</span>
            </div>
            {showWarning && stockStatus === 'low-stock' && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-700 flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Estoque baixo! Verifique a disponibilidade pessoalmente antes de realizar a compra.
                </div>
            )}
        </div>
    );
};

export default StockIndicator;
