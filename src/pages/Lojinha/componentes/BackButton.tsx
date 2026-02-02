import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface BackButtonProps {
    onBack: () => void;
    text?: string;
    className?: string;
    icon?: React.ReactNode;
}

const defaultIcon = <ArrowBackIcon sx={{ fontSize: 20 }} />;

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