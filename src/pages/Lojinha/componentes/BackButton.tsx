import React from 'react';

interface BackButtonProps {
    onBack: () => void;
    text?: string;
    className?: string;
    icon?: React.ReactNode;
}

const defaultIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

export const BackButton: React.FC<BackButtonProps> = ({ 
    onBack, 
    text = 'Voltar',
    className = '',
    icon = defaultIcon 
}) => (
    <button 
        onClick={onBack}
        className={`mb-3 md:mb-6 flex items-center text-[#03B04B] hover:text-green-600 transition-colors ${className}`}
    >
        {icon && <span className="mr-2">{icon}</span>}
        {text}
    </button>
);