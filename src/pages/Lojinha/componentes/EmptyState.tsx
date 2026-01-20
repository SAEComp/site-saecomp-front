import React from 'react';

interface EmptyStateProps {
    /** Ícone a ser exibido (emoji ou texto) */
    icon?: string;
    /** Caminho da imagem a ser exibida (opcional, sobrescreve icon) */
    image?: string;
    /** Mensagem principal a ser exibida */
    message: string;
    /** Descrição adicional (opcional) */
    description?: string;
    /** Layout: 'inline' para dentro de conteúdo, 'fullscreen' para tela cheia */
    layout?: 'inline' | 'fullscreen';
    /** Incluir fundo (apenas para layout fullscreen) */
    withBackground?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
    icon = '📭',
    image,
    message,
    description,
    layout = 'inline',
    withBackground = true
}) => {
    const containerClasses = layout === 'fullscreen' 
        ? `min-h-screen flex items-center justify-center ${withBackground ? 'bg-gray-50' : ''}`
        : 'text-center py-12';

    const contentClasses = layout === 'fullscreen'
        ? 'text-center max-w-md mx-auto p-6'
        : 'bg-gray-100 rounded-lg p-8 max-w-md mx-auto';

    return (
        <div className={containerClasses}>
            <div className={contentClasses}>
                {image ? (
                    <img 
                        src={image} 
                        alt="Vazio" 
                        className="w-48 h-48 mx-auto mb-3 object-contain"
                    />
                ) : (
                    <span className="text-4xl mb-4 block">{icon}</span>
                )}
                <p className={`text-gray-600 ${layout === 'fullscreen' ? 'text-xl' : 'text-lg'}`}>
                    {message}
                </p>
                {description && (
                    <p className="text-gray-500 text-sm mt-2">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
};