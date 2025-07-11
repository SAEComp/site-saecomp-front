
interface CheckmarkProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
}

function Checkmark({ checked = false, onChange }: CheckmarkProps) {

    return (
        <input
            type="checkbox"
            checked={checked}
            onChange={e => onChange?.(e.target.checked)}
            className="w-5 h-5 accent-green-600 cursor-pointer"
        />
    );
}

export default Checkmark;
