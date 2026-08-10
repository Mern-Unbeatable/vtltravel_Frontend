import React, { useState } from "react";
import TablePagination from "../../../../components/TablePagination";

const HotelList = ({ hotels, onEdit, onDelete, onAddNew }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(hotels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = hotels.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Manage Hotels & Resort Listings
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Add, edit details, room configurations, and facilities for hotels.
          </p>
        </div>
        <button
          onClick={onAddNew}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold shadow-sm transition flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span className="text-lg font-bold">+</span> Add New Hotel
        </button>
      </div>

      {hotels.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-slate-500 font-medium">
            No hotels available. Click the button above to add one.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-[#f7f8fa] text-gray-500 uppercase text-xs font-bold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Hotel / Resort</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Starting Price</th>
                  <th className="px-6 py-4">Rooms Configured</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((hotel) => (
                  <tr
                    key={hotel.id}
                    className="hover:bg-gray-50/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={hotel.image}
                          alt={hotel.title}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200 bg-gray-50"
                        />
                        <div>
                          <span className="font-semibold text-slate-900 block text-sm">
                            {hotel.title}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-amber-500 text-sm">
                      {hotel.stars}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-950">
                      {hotel.price}/night
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {hotel.rooms ? hotel.rooms.length : 0} room type
                      {(hotel.rooms || []).length !== 1 ? "s" : ""}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          hotel.available
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : "bg-red-50 text-red-600 border-red-200"
                        }`}
                      >
                        {hotel.available ? "Active" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => onEdit(hotel)}
                        className="text-xs text-primary hover:underline font-bold cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(hotel.id)}
                        className="text-xs text-red-500 hover:underline font-bold cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 md:hidden">
            {currentData.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between gap-4"
              >
                <div className="flex gap-3">
                  <img
                    src={hotel.image}
                    alt={hotel.title}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 bg-gray-50 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-900 block text-sm truncate">
                      {hotel.title}
                    </span>
                    <span className="text-xs text-amber-500 font-bold block mt-0.5">
                      {hotel.stars} Rating
                    </span>
                    <span className="text-xs text-gray-500 font-medium block mt-0.5">
                      {hotel.rooms ? hotel.rooms.length : 0} room type
                      {(hotel.rooms || []).length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">
                      Starting Price
                    </span>
                    <span className="text-sm font-extrabold text-slate-950">
                      {hotel.price}/night
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      hotel.available
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                        : "bg-red-50 text-red-600 border-red-200"
                    }`}
                  >
                    {hotel.available ? "Active" : "Unavailable"}
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
            totalEntries={hotels.length}
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
