import React from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

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
                <CalendarTodayIcon className="text-gray-400" sx={{ fontSize: 20 }} />
            </div>
        </div>
    );
};

export default DateInput;