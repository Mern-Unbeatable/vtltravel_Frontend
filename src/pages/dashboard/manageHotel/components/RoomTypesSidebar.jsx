import React from "react";

const RoomTypesSidebar = ({
  roomsVal,
  selectedRoomId,
  setSelectedRoomId,
  onAddRoom,
  onEditRoom,
  onDeleteRoom,
}) => {
  return (
    <div className="lg:col-span-1 border border-gray-200 rounded-2xl p-4 bg-slate-50 space-y-4 h-full overflow-y-auto">
      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
          Room Types
        </h3>
        <button
          type="button"
          onClick={onAddRoom}
          className="px-2 py-1 bg-primary text-white rounded text-[10px] font-bold hover:bg-slate-800 cursor-pointer"
        >
          + Add Room
        </button>
      </div>

      {roomsVal.length === 0 ? (
        <div className="text-center py-8 text-xs text-gray-400 font-semibold">
          No room types configured yet.
        </div>
      ) : (
        <div className="space-y-2">
          {roomsVal.map((room) => {
            const isSelected =
              selectedRoomId === (room.id || room._id) ||
              (!selectedRoomId && roomsVal[0] === room);
            // Ensure state matches
            if (!selectedRoomId && roomsVal[0] === room) {
              setTimeout(() => setSelectedRoomId(room.id || room._id), 0);
            }
            return (
              <div
                key={room.id || room._id}
                onClick={() => setSelectedRoomId(room.id || room._id)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition flex flex-col justify-between gap-2 ${
                  isSelected
                    ? "bg-white border-primary text-primary shadow-sm"
                    : "bg-white border-gray-200 text-slate-700 hover:bg-gray-50"
                }`}
              >
                <div>
                  <p className="text-xs font-bold">{room.name}</p>
                  <p
                    className={`text-[10px] mt-0.5 ${isSelected ? "text-primary" : "text-gray-450"}`}
                  >
                    Base price: ${room.price}
                  </p>
                </div>
                <div className="flex gap-2.5 justify-end border-t border-slate-200/60 pt-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditRoom(room);
                    }}
                    className={`text-[10px] font-bold hover:underline ${isSelected ? "text-primary" : "text-slate-900"}`}
                  >
                    Edit
                  </button>
                  <span
                    className={`text-[10px] ${isSelected ? "text-slate-700" : "text-gray-300"}`}
                  >
                    |
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRoom(room.id || room._id);
                    }}
                    className="text-[10px] font-bold text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RoomTypesSidebar;
