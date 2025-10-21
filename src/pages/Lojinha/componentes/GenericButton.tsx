import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'back';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface GenericButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    disabled?: boolean;
    className?: string;
    icon?: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
}

export const GenericButton: React.FC<GenericButtonProps> = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    className = '',
    icon,
    type = 'button'
}) => {
    const getVariantClasses = (): string => {
        switch (variant) {
            case 'primary':
                return 'bg-[#03B04B] text-white hover:bg-green-600';
            case 'secondary':
                return 'border border-gray-300 text-gray-700 hover:bg-gray-50';
            case 'outline':
                return 'border border-[#03B04B] text-[#03B04B] hover:bg-[#03B04B] hover:text-white';
            case 'back':
                return 'text-[#03B04B] hover:text-green-600 bg-transparent';
            default:
                return 'bg-[#03B04B] text-white hover:bg-green-600';
        }
    };

    const getSizeClasses = (): string => {
        switch (size) {
            case 'sm':
                return 'py-2 px-4 text-sm';
            case 'md':
                return 'py-3 px-6 text-base';
            case 'lg':
                return 'py-4 px-8 text-lg';
            default:
                return 'py-3 px-6 text-base';
        }
    };

    const baseClasses = 'font-medium rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed';
    const widthClasses = fullWidth ? 'w-full justify-center' : '';
    const variantClasses = getVariantClasses();
    const sizeClasses = getSizeClasses();

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${widthClasses} ${variantClasses} ${sizeClasses} ${className}`}
        >
            {icon && <span>{icon}</span>}
            <span>{children}</span>
        </button>
    );
};