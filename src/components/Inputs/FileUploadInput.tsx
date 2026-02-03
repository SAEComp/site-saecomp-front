import React, { useRef, useState } from 'react';

interface IFileUploadInputProps {
    label: string;
    accept?: string;
    maxSize?: number; // em MB
    multiple?: boolean;
    onFileSelect?: (files: FileList | null) => void;
    disabled?: boolean;
    className?: React.HTMLProps<HTMLElement>["className"];
}

const FileUploadInput = ({
    label,
    accept = "image/*",
    maxSize = 5,
    multiple = false,
    onFileSelect,
    disabled = false,
    className = ''
}: IFileUploadInputProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateFile = (file: File): boolean => {
        if (file.size > maxSize * 1024 * 1024) {
            setError(`Arquivo muito grande. Máximo ${maxSize}MB`);
            return false;
        }
        setError(null);
        return true;
    };

    const handleFiles = (files: FileList | null) => {
        if (!files) return;
        
        const validFiles = Array.from(files).filter(validateFile);
        if (validFiles.length > 0) {
            const dataTransfer = new DataTransfer();
            validFiles.forEach(file => dataTransfer.items.add(file));
            onFileSelect && onFileSelect(dataTransfer.files);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (disabled) return;
        
        handleFiles(e.dataTransfer.files);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        handleFiles(e.target.files);
    };

    const handleClick = () => {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="relative">
            <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    dragActive 
                        ? 'border-[#03B04B] bg-green-50' 
                        : error 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 hover:border-gray-400'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleChange}
                    disabled={disabled}
                    className="hidden"
                />
                
                <div className="space-y-2">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="text-sm text-gray-700 font-medium mb-1">
                        {label}
                    </div>
                    <div className="text-sm text-gray-600">
                        <span className="font-medium text-[#03B04B] hover:text-green-600">
                            Clique para selecionar
                        </span> ou arraste arquivos aqui
                    </div>
                    <p className="text-xs text-gray-500">
                        {accept === "image/*" ? "PNG, JPG, GIF" : accept} até {maxSize}MB
                    </p>
                </div>
            </div>
            
            {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default FileUploadInput;