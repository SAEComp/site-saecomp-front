import React, { useState } from 'react';

interface IEmailInputProps {
    label: string;
    value?: string;
    onChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
    className?: React.HTMLProps<HTMLElement>["className"];
}

const EmailInput = ({
    label,
    value = '',
    onChange,
    required = false,
    disabled = false,
    className = ''
}: IEmailInputProps) => {
    const [isValid, setIsValid] = useState(true);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange && onChange(newValue);
        
        if (newValue.length > 0) {
            setIsValid(validateEmail(newValue));
        } else {
            setIsValid(true);
        }
    };

    return (
        <div className="relative">
            <input
                type="email"
                value={value}
                onChange={handleChange}
                placeholder={label}
                required={required}
                disabled={disabled}
                className={`block w-full rounded-lg py-3 px-3 pr-10 text-gray-900 font-inter whitespace-nowrap overflow-hidden text-ellipsis placeholder-gray-400 placeholder-opacity-100 focus:placeholder-opacity-30 focus:outline-none focus:ring-2 focus:ring-[#03B04B] focus:border-transparent border ${
                    !isValid ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                } disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {!isValid && value.length > 0 ? (
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                )}
            </div>
            {!isValid && value.length > 0 && (
                <p className="mt-1 text-sm text-red-600">Por favor, insira um email válido</p>
            )}
        </div>
    );
};

export default EmailInput;