import React from 'react';
import erroIcon from "../../../assets/lojinha-icons/perrys/ERRO.png";

interface ErrorStateProps {
    /** Mensagem de erro a ser exibida */
    error: string;
    /** Título do erro (opcional) */
    title?: string;
    /** Função chamada ao clicar no botão primário */
    onRetry?: () => void;
    /** Texto do botão primário */
    retryText?: string;
    /** Função chamada ao clicar no botão secundário (opcional) */
    onSecondaryAction?: () => void;
    /** Texto do botão secundário */
    secondaryText?: string;
    /** Layout: 'inline' para dentro de conteúdo, 'fullscreen' para tela cheia */
    layout?: 'inline' | 'fullscreen';
    /** Incluir fundo (apenas para layout fullscreen) */
    withBackground?: boolean;
    /** Tamanho do ícone */
    iconSize?: 'sm' | 'md' | 'lg';
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
    error,
    title = 'Erro',
    onRetry,
    retryText = 'Tentar novamente',
    onSecondaryAction,
    secondaryText,
    layout = 'inline',
    withBackground = true,
    iconSize = 'md'
}) => {
    const iconSizeClasses = {
        sm: 'w-16 h-16',
        md: 'w-24 h-24 md:w-28 md:h-28',
        lg: 'w-28 h-28 md:w-32 md:h-32'
    };

    const containerClasses = layout === 'fullscreen' 
        ? `min-h-screen flex items-center justify-center ${withBackground ? 'bg-gray-50' : ''}`
        : 'text-center py-12';

    const contentClasses = layout === 'fullscreen'
        ? 'text-center max-w-md mx-auto p-6'
        : 'rounded-lg p-6 max-w-md mx-auto';

    return (
        <div className={containerClasses}>
            <div className={contentClasses}>
                <img 
                    src={erroIcon} 
                    alt="Erro" 
                    className={`mx-auto mb-4 object-contain drop-shadow-lg ${iconSizeClasses[iconSize]}`}
                />
                
                {layout === 'fullscreen' ? (
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
                ) : (
                    <h3 className="text-xl font-bold text-red-600 mb-2">{title}</h3>
                )}
                
                <p className={`mb-6 ${layout === 'fullscreen' ? 'text-gray-600' : 'text-red-700'}`}>
                    {error}
                </p>
                
                <div className="space-y-3">
                    {onRetry && (
                        <button 
                            onClick={onRetry} 
                            className={`px-6 py-3 rounded-lg font-medium transition ${
                                layout === 'fullscreen' 
                                    ? 'bg-[#03B04B] text-white hover:bg-green-600' 
                                    : 'bg-red-600 hover:bg-red-700 text-white px-4 py-2'
                            }`}
                        >
                            {retryText}
                        </button>
                    )}
                    
                    {onSecondaryAction && secondaryText && (
                        <button
                            onClick={onSecondaryAction}
                            className="block text-gray-600 hover:text-gray-800"
                        >
                            {secondaryText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};