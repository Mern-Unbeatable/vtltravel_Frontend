import React from "react";

const HotelTable = ({ hotels, onEdit, onDelete }) => {
  return (
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
          {hotels.map((hotel) => (
            <tr
              key={hotel.id}
              className="hover:bg-gray-50/40 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={hotel.primaryImage || hotel.coverImageUrl || (hotel.images && hotel.images[0]?.url)}
                    alt={hotel.name}
                    className="w-12 h-12 object-cover rounded-lg border border-gray-200 bg-gray-50"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 block text-sm">
                      {hotel.name}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 font-semibold text-amber-500 text-sm">
                {hotel.starRating} ★
              </td>
              <td className="px-6 py-4 font-bold text-slate-950">
                ${hotel.fromPrice || hotel.startingPrice || 0}/night
              </td>
              <td className="px-6 py-4 font-medium text-slate-700">
                {hotel._count?.roomTypes || hotel.roomTypes?.length || 0} room type
                {(hotel._count?.roomTypes || hotel.roomTypes?.length || 0) !== 1 ? "s" : ""}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    hotel.isActive
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                      : "bg-red-50 text-red-600 border-red-200"
                  }`}
                >
                  {hotel.isActive ? "Active" : "Unavailable"}
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
  );
};

export default HotelTable;
