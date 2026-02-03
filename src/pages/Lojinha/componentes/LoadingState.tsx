import React from 'react';

interface LoadingStateProps {
    /** Texto a ser exibido abaixo do spinner */
    message?: string;
    /** Tamanho do spinner ('sm', 'md', 'lg') */
    size?: 'sm' | 'md' | 'lg';
    /** Layout: 'inline' para dentro de conteúdo, 'fullscreen' para tela cheia */
    layout?: 'inline' | 'fullscreen';
    /** Incluir fundo (apenas para layout fullscreen) */
    withBackground?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
    message = 'Carregando...', 
    size = 'md',
    layout = 'inline',
    withBackground = true
}) => {
    const sizeClasses = {
        sm: 'h-6 w-6 border-2',
        md: 'h-8 w-8 border-b-2', 
        lg: 'h-12 w-12 border-b-2'
    };

    const containerClasses = layout === 'fullscreen' 
        ? `min-h-screen flex items-center justify-center ${withBackground ? 'bg-gray-50' : ''}`
        : 'text-center py-12';

    return (
        <div className={containerClasses}>
            <div className="text-center">
                <div className={`inline-block animate-spin rounded-full border-[#03B04B] mx-auto mb-4 ${sizeClasses[size]}`}></div>
                <p className="text-gray-600">{message}</p>
            </div>
        </div>
    );
};