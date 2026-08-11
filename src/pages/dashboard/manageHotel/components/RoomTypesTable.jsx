import React from 'react';

const RoomTypesTable = ({ hotel, roomsVal, onAddClick, onEditClick, onDeleteClick }) => {
  if (!hotel) return null;

  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-slate-900">Room Types & Pricing</h3>
        <button
          type="button"
          onClick={onAddClick}
          className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition cursor-pointer"
        >
          + Add Room Type
        </button>
      </div>

      {roomsVal.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 text-center text-sm text-gray-500 font-semibold">
          No rooms configured for this hotel yet. Add at least one room type.
        </div>
      ) : (
        <div className="border border-gray-200 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 min-w-[600px]">
            <thead className="bg-gray-50 uppercase font-semibold text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Room Name</th>
                <th className="px-4 py-3">Bed Info</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {roomsVal.map(room => (
                <tr key={room.id || room._id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-semibold text-slate-800">{room.name}</td>
                  <td className="px-4 py-3">{room.bedInfo || room.bedInformation}</td>
                  <td className="px-4 py-3">{room.size || room.roomSize}</td>
                  <td className="px-4 py-3 font-bold text-slate-950">${room.price || room.pricePerNight}/night</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => onEditClick(room)}
                      className="text-xs text-primary font-bold hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteClick(room.id || room._id)}
                      className="text-xs text-red-500 font-bold hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RoomTypesTable;
