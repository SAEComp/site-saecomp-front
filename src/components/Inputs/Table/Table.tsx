import React from 'react';

export interface ITableColumn<T = any> {
    key: string;
    title: string;
    dataIndex?: keyof T;
    render?: (value: any, record: T, index: number) => React.ReactNode;
    className?: string;
    headerClassName?: string;
    align?: 'left' | 'center' | 'right';
    width?: string | number;
}

export interface ITableProps<T = any> {
    columns: ITableColumn<T>[];
    data: T[];
    loading?: boolean;
    emptyText?: string;
    emptyIcon?: string;
    emptyAction?: {
        text: string;
        onClick: () => void;
    };
    className?: string;
    headerClassName?: string;
    rowClassName?: string | ((record: T, index: number) => string);
    onRowClick?: (record: T, index: number) => void;
    responsive?: boolean;
    mobileView?: (record: T, index: number) => React.ReactNode;
}

const Table = <T extends any>({
    columns,
    data,
    loading = false,
    emptyText = "Nenhum item encontrado",
    emptyIcon,
    emptyAction,
    className = "",
    headerClassName = "",
    rowClassName,
    onRowClick,
    responsive = true,
    mobileView
}: ITableProps<T>) => {
    const getAlignClass = (align?: string) => {
        switch (align) {
            case 'center': return 'text-center';
            case 'right': return 'text-right';
            default: return 'text-left';
        }
    };

    const getRowClassName = (record: T, index: number) => {
        if (typeof rowClassName === 'function') {
            return rowClassName(record, index);
        }
        return rowClassName || '';
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="ml-2 text-gray-600">Carregando...</span>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-8 text-center">
                    {emptyIcon && (
                        <img 
                            src={emptyIcon} 
                            alt="Vazio" 
                            className="mx-auto h-16 w-16 mb-4 opacity-50"
                        />
                    )}
                    <p className="text-gray-500 mb-4">{emptyText}</p>
                    {emptyAction && (
                        <button
                            onClick={emptyAction.onClick}
                            className="px-4 py-2 bg-[#03B04B] text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                            {emptyAction.text}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
            {responsive && mobileView ? (
                <>
                    {/* Versão desktop */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className={`bg-gray-50 ${headerClassName}`}>
                                <tr>
                                    {columns.map((column) => (
                                        <th 
                                            key={column.key}
                                            className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${getAlignClass(column.align)} ${column.headerClassName || ''}`}
                                            style={column.width ? { width: column.width } : undefined}
                                        >
                                            {column.title}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.map((record, index) => (
                                    <tr 
                                        key={index}
                                        className={`${getRowClassName(record, index)} ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                                        onClick={() => onRowClick && onRowClick(record, index)}
                                    >
                                        {columns.map((column) => {
                                            const value = column.dataIndex ? record[column.dataIndex] : record;
                                            const renderedValue = column.render 
                                                ? column.render(value, record, index)
                                                : String(value);

                                            return (
                                                <td 
                                                    key={column.key}
                                                    className={`px-6 py-4 whitespace-nowrap ${getAlignClass(column.align)} ${column.className || ''}`}
                                                >
                                                    {renderedValue}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Versão mobile */}
                    <div className="md:hidden">
                        {data.map((record, index) => (
                            <div 
                                key={index}
                                className={`border-b border-gray-200 last:border-b-0 ${getRowClassName(record, index)} ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                                onClick={() => onRowClick && onRowClick(record, index)}
                            >
                                {mobileView(record, index)}
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className={`bg-gray-50 ${headerClassName}`}>
                            <tr>
                                {columns.map((column) => (
                                    <th 
                                        key={column.key}
                                        className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${getAlignClass(column.align)} ${column.headerClassName || ''}`}
                                        style={column.width ? { width: column.width } : undefined}
                                    >
                                        {column.title}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.map((record, index) => (
                                <tr 
                                    key={index}
                                    className={`${getRowClassName(record, index)} ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                                    onClick={() => onRowClick && onRowClick(record, index)}
                                >
                                    {columns.map((column) => {
                                        const value = column.dataIndex ? record[column.dataIndex] : record;
                                        const renderedValue = column.render 
                                            ? column.render(value, record, index)
                                            : String(value);

                                        return (
                                            <td 
                                                key={column.key}
                                                className={`px-6 py-4 whitespace-nowrap ${getAlignClass(column.align)} ${column.className || ''}`}
                                            >
                                                {renderedValue}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Table;
