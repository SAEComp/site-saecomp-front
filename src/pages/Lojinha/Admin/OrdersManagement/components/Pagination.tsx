import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPrevious: () => void;
    onNext: () => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    onPrevious,
    onNext
}) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center">
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                    onClick={onPrevious}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                        currentPage === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-400 hover:bg-gray-50'
                    } ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0`}
                >
                    <span className="sr-only">Anterior</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                </button>

                {/* Números das páginas */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Mostrar no máximo 7 páginas: primeira, última, atual e algumas ao redor
                    const showPage = page === 1 || page === totalPages || 
                                   (page >= currentPage - 2 && page <= currentPage + 2);
                    
                    if (!showPage) {
                        // Mostrar "..." apenas uma vez entre grupos
                        if (page === currentPage - 3 || page === currentPage + 3) {
                            return (
                                <span key={page} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                                    ...
                                </span>
                            );
                        }
                        return null;
                    }

                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                page === currentPage
                                    ? 'z-10 bg-[#03B04B] text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#03B04B]'
                                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                            }`}
                        >
                            {page}
                        </button>
                    );
                })}

                <button
                    onClick={onNext}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                        currentPage === totalPages
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-400 hover:bg-gray-50'
                    } ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0`}
                >
                    <span className="sr-only">Próxima</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                </button>
            </nav>
        </div>
    );
};
