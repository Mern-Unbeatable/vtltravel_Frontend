import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  totalEntries,
  startIndex,
  endIndex,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#f8f9fa] w-full">
      {/* Entries Info */}
      <div className="text-xs text-gray-500 font-semibold">
        Showing{" "}
        <span className="text-slate-950 font-bold">{startIndex + 1}</span> to{" "}
        <span className="text-slate-950 font-bold">
          {Math.min(endIndex, totalEntries)}
        </span>{" "}
        of <span className="text-slate-950 font-bold">{totalEntries}</span>{" "}
        entries
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
            currentPage === 1
              ? "border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed"
              : "border-gray-300 text-slate-700 bg-white hover:bg-gray-50"
          }`}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentPage === page
                ? "bg-primary text-white shadow-sm"
                : "border border-gray-300 text-slate-700 bg-white hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
            currentPage === totalPages
              ? "border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed"
              : "border-gray-300 text-slate-700 bg-white hover:bg-gray-50"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
