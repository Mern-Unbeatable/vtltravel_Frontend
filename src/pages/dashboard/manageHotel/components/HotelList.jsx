import React, { useState } from "react";
import TablePagination from "../../../../components/TablePagination";
import HotelTable from "./HotelTable";

const HotelList = ({ hotels, onEdit, onDelete, onAddNew }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 4;

  const filteredHotels = hotels.filter((hotel) =>
    (hotel.name || hotel.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredHotels.length);
  const currentData = filteredHotels.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Manage Hotels & Resort Listings
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Add, edit details, room configurations, and facilities for hotels.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:w-auto w-full">
          <div className="relative flex-1 sm:min-w-[400px]">
            <input
              type="text"
              placeholder="Search by hotel name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-sm pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-xs transition-all"
            />
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            onClick={onAddNew}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold shadow-sm transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span className="text-lg font-bold">+</span> Add New Hotel
          </button>
        </div>
      </div>

      {hotels.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-slate-500 font-medium">
            No hotels available. Click the button above to add one.
          </p>
        </div>
      ) : filteredHotels.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-slate-500 font-medium">
            No matching hotels found for "{searchTerm}".
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <HotelTable
            hotels={currentData}
            onEdit={onEdit}
            onDelete={onDelete}
          />

          {/* Mobile/Tablet Card View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 md:hidden">
            {currentData.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between gap-4"
              >
                <div className="flex gap-3">
                  <img
                    src={hotel.primaryImage || hotel.coverImageUrl || (hotel.images && hotel.images[0]?.url)}
                    alt={hotel.name}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 bg-gray-50 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-900 block text-sm truncate">
                      {hotel.name}
                    </span>
                    <span className="text-xs text-amber-500 font-bold block mt-0.5">
                      {hotel.starRating} ★ Rating
                    </span>
                    <span className="text-xs text-gray-500 font-medium block mt-0.5">
                      {hotel._count?.roomTypes || hotel.roomTypes?.length || 0} room type
                      {(hotel._count?.roomTypes || hotel.roomTypes?.length || 0) !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">
                      Starting Price
                    </span>
                    <span className="text-sm font-extrabold text-slate-950">
                      ${hotel.fromPrice || hotel.startingPrice || 0}/night
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      hotel.isActive
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                        : "bg-red-50 text-red-600 border-red-200"
                    }`}
                  >
                    {hotel.isActive ? "Active" : "Unavailable"}
                  </span>
                </div>

                <div className="flex gap-2 border-t border-gray-100 pt-3">
                  <button
                    onClick={() => onEdit(hotel)}
                    className="flex-1 py-2 text-center text-xs font-bold bg-gray-50 text-primary hover:bg-primary/5 rounded-lg border border-gray-200 transition cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(hotel.id)}
                    className="flex-1 py-2 text-center text-xs font-bold bg-gray-50 text-red-500 hover:bg-red-50 rounded-lg border border-gray-200 transition cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Reusable Pagination Component */}
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalEntries={filteredHotels.length}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default HotelList;
