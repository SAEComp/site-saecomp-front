import React from 'react';

interface ITextareaInputProps {
    label: string;
    value?: string;
    onChange?: (value: string) => void;
    rows?: number;
    maxLength?: number;
    required?: boolean;
    disabled?: boolean;
    className?: React.HTMLProps<HTMLElement>["className"];
}

const TextareaInput = ({
    label,
    value = '',
    onChange,
    rows = 4,
    maxLength,
    required = false,
    disabled = false,
    className = ''
}: ITextareaInputProps) => {
    return (
        <div className="relative">
            <textarea
                value={value}
                onChange={(e) => onChange && onChange(e.target.value)}
                rows={rows}
                maxLength={maxLength}
                placeholder={label}
                required={required}
                disabled={disabled}
                spellCheck={false}
                className={`block w-full rounded-lg py-3 px-3 text-gray-900 font-inter overflow-hidden placeholder-gray-400 placeholder-opacity-100 focus:placeholder-opacity-30 focus:outline-none focus:ring-2 focus:ring-[#03B04B] focus:border-transparent border border-gray-300 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
            />
            {maxLength && (
                <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                    {value.length}/{maxLength}
                </div>
            )}
        </div>
    );
};

export default TextareaInput;