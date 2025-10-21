import React from 'react';

interface ISearchInputProps {
    label: string;
    value?: string;
    onChange?: (value: string) => void;
    onClear?: () => void;
    disabled?: boolean;
    className?: React.HTMLProps<HTMLElement>["className"];
}

const SearchInput = ({
    label,
    value = '',
    onChange,
    onClear,
    disabled = false,
    className = ''
}: ISearchInputProps) => {
    const handleClear = () => {
        onChange && onChange('');
        onClear && onClear();
    };

    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
            </div>
            <input
                type="search"
                value={value}
                onChange={(e) => onChange && onChange(e.target.value)}
                placeholder={label}
                disabled={disabled}
                className={`block w-full rounded-lg py-3 pl-10 pr-10 text-gray-900 font-inter whitespace-nowrap overflow-hidden text-ellipsis placeholder-gray-400 placeholder-opacity-100 focus:placeholder-opacity-30 focus:outline-none focus:ring-2 focus:ring-[#03B04B] focus:border-transparent border border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
            />
            {value && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
                >
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default SearchInput;