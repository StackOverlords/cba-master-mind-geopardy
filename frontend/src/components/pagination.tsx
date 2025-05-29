import React from "react";
import ChevronRightIcon from "./ui/icons/chevronRightIcon";
import ChevronLeftIcon from "./ui/icons/chevronLeftIcon";
import SelectOptions from "./ui/selectOptions";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showRows?: number;
    onShowRowsChange?: (rows: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    showRows = 10,
    onShowRowsChange
}) => {
    const getVisiblePages = () => {
        const pages = [];
        const maxVisible = 7;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (page: number | string) => {
        if (typeof page === 'number') {
            onPageChange(page);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-1 items-center justify-between px-4 py-3 bg-dashboard-bg/50 border border-dashboard-border/50 rounded-lg">
            {/* Left side - Show rows selector */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Show:</span>
                <SelectOptions
                    value={showRows}
                    onChange={(e) => onShowRowsChange?.(Number(e.target.value))}
                    className="py-1 bg-dashboard-border/50 hover:bg-dashboard-border/70"
                >
                    <option value={5}>5 rows</option>
                    <option value={10}>10 rows</option>
                    <option value={25}>25 rows</option>
                    <option value={50}>50 rows</option>
                </SelectOptions>
            </div>

            {/* Page numbers */}
            <div className="flex items-center gap-2">
                {/* Previous button */}
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-white hover:bg-dashboard-border/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors duration-200"
                >
                    <ChevronLeftIcon className="size-4" />
                </button>

                {/* Page numbers */}
                {getVisiblePages().map((page, index) => (
                    <React.Fragment key={index}>
                        {page === '...' ? (
                            <span className="flex items-center justify-center w-8 h-8 text-gray-500">
                                ...
                            </span>
                        ) : (
                            <button
                                onClick={() => handlePageClick(page)}
                                className={`flex items-center justify-center w-8 h-8 text-sm rounded-md transition-colors duration-200 ${currentPage === page
                                    ? 'bg-dashboard-border/70 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-dashboard-border/50'
                                    }`}
                            >
                                {page}
                            </button>
                        )}
                    </React.Fragment>
                ))}

                {/* Next button */}
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-white hover:bg-dashboard-border/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors duration-200"
                >
                    <ChevronRightIcon className="size-4" />
                </button>
            </div>

            {/* Right side - empty for balance */}
        </div>
    );
};

export default Pagination;