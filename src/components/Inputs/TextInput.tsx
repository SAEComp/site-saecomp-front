interface ITextInputProps {
    label: string;
    multiline?: boolean;
    rows?: number;
    value?: string;
    onChange?: (value: string) => void;
    onClick?: React.MouseEventHandler<HTMLElement>;
    className?: React.HTMLProps<HTMLElement>["className"];
}

const TextInput = ({
    label,
    value = '',
    multiline = false,
    rows = 3,
    onChange,
    onClick,
    className = ''
}: ITextInputProps) => {
    return (
        <div className="relative" onClick={onClick}>
            {multiline ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange && onChange(e.target.value)}
                    rows={rows}
                    placeholder={label}
                    spellCheck={false}
                    className={`block w-full h-full rounded-lg pr-16 py-3 pl-3 text-gray-900 font-inter overflow-hidden text-ellipsis placeholder-gray-400 placeholder-opacity-100 focus:placeholder-opacity-30 focus:outline-none focus:ring-0 focus:border-0 resize-none ${className}`}
                />
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange && onChange(e.target.value)}
                    placeholder={label}
                    className={`block w-full h-full rounded-lg py-3 px-3 text-gray-900 font-inter whitespace-nowrap overflow-hidden text-ellipsis placeholder-gray-400 placeholder-opacity-100 focus:placeholder-opacity-30 focus:outline-none focus:ring-0 focus:border-0 ${className}`}
                />
            )}
        </div>
    );
};

export default TextInput;
