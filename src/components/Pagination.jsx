import React from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center py-6 w-full">
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`w-10 h-10 flex items-center justify-center rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
            currentPage === 1
              ? "border-[#05588E29] text-gray-300 bg-gray-50/50 cursor-not-allowed"
              : "border-[#05588E29] text-slate-700 bg-white hover:bg-gray-50 active:scale-95"
          }`}
        >
          <IoChevronBack className="text-base" />
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              currentPage === page
                ? "bg-primary text-white shadow-xs"
                : "border border-[#05588E29] text-slate-700 bg-[#F9FAFB] hover:bg-gray-100 active:scale-95"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`w-10 h-10 flex items-center justify-center rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
            currentPage === totalPages
              ? "border-[#05588E29] text-gray-300 bg-gray-50/50 cursor-not-allowed"
              : "border-[#05588E29] text-slate-700 bg-white hover:bg-gray-50 active:scale-95"
          }`}
        >
          <IoChevronForward className="text-base" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
