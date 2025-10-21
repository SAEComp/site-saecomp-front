import React from 'react';

interface IDateInputProps {
    label: string;
    value?: string;
    onChange?: (value: string) => void;
    min?: string;
    max?: string;
    required?: boolean;
    disabled?: boolean;
    className?: React.HTMLProps<HTMLElement>["className"];
}

const DateInput = ({
    label,
    value = '',
    onChange,
    min,
    max,
    required = false,
    disabled = false,
    className = ''
}: IDateInputProps) => {
    return (
        <div className="relative">
            <input
                type="date"
                value={value}
                onChange={(e) => onChange && onChange(e.target.value)}
                min={min}
                max={max}
                placeholder={label}
                required={required}
                disabled={disabled}
                className={`block w-full rounded-lg py-3 px-3 pr-10 text-gray-900 font-inter placeholder-gray-400 placeholder-opacity-100 focus:placeholder-opacity-30 focus:outline-none focus:ring-2 focus:ring-[#03B04B] focus:border-transparent border border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
    );
};

export default DateInput;