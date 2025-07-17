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
                return 'text-red-600 bg-red-50 border-red-200';
            case 'low-stock':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            default:
                return 'text-green-600 bg-green-50 border-green-200';
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <div className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${getStatusStyles()}`}>
                <span className="mr-1">
                    {stockStatus === 'out-of-stock' ? '✗' : '✓'}
                </span>
                {getStockText()}
            </div>
            {showWarning && stockStatus === 'low-stock' && (
                <div className="flex items-center text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <span className="mr-2">⚠️</span>
                    Estoque baixo! Verifique a disponibilidade pessoalmente antes de realizar a compra.
                </div>
            )}
        </div>
    );
};

export default StockIndicator;
