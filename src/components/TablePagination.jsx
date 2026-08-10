import React from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const TablePagination = ({
  currentPage,
  totalPages,
  totalEntries,
  startIndex,
  endIndex,
  onPageChange,
}) => {
  if (totalPages <= 0) return null;

  const displayStart = totalEntries === 0 ? 0 : startIndex + 1;
  const displayEnd = Math.min(endIndex, totalEntries);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full py-4 px-6 border-t border-gray-100 bg-white">
      {/* Left side: Results info */}
      <div className="text-sm text-slate-500 font-medium">
        Showing <span className="font-semibold text-slate-800">{displayStart}</span> to{" "}
        <span className="font-semibold text-slate-800">{displayEnd}</span> of{" "}
        <span className="font-semibold text-slate-800">{totalEntries}</span> results
      </div>

      {/* Right side: Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm transition-all cursor-pointer ${
            currentPage === 1
              ? "border-gray-200 text-gray-300 bg-gray-50/50 cursor-not-allowed"
              : "border-gray-200 text-slate-600 bg-white hover:bg-gray-50 active:scale-95 shadow-sm"
          }`}
        >
          <IoChevronBack className="text-base" />
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              currentPage === page
                ? "bg-primary text-white shadow-sm border border-primary"
                : "border border-gray-200 text-slate-700 bg-white hover:bg-gray-50 active:scale-95 shadow-sm"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm transition-all cursor-pointer ${
            currentPage === totalPages
              ? "border-gray-200 text-gray-300 bg-gray-50/50 cursor-not-allowed"
              : "border-gray-200 text-slate-600 bg-white hover:bg-gray-50 active:scale-95 shadow-sm"
          }`}
        >
          <IoChevronForward className="text-base" />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
