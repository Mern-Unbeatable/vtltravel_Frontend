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
    // Outer cell: height comes from right calendar (grid row).
    // Inner panel fills that height; room cards scroll inside.
    <div className="relative min-h-[360px] lg:min-h-0 xl:col-span-1">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-slate-50 p-3 lg:absolute lg:inset-0 xl:p-4">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800">
            Room Types
          </h3>
          <button
            type="button"
            onClick={onAddRoom}
            className="cursor-pointer rounded bg-primary px-2 py-1 text-[10px] font-bold text-white hover:bg-slate-800"
          >
            + Add Room
          </button>
        </div>

        {roomsVal.length === 0 ? (
          <div className="py-8 text-center text-xs font-semibold text-gray-400">
            No room types configured yet.
          </div>
        ) : (
          <div className="room-list-scroll mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain pr-1">
            {roomsVal.map((room) => {
              const roomId = room.id || room._id;
              const isSelected =
                selectedRoomId === roomId ||
                (!selectedRoomId && roomsVal[0] === room);

              if (!selectedRoomId && roomsVal[0] === room) {
                setTimeout(() => setSelectedRoomId(roomId), 0);
              }

              return (
                <div
                  key={roomId}
                  onClick={() => setSelectedRoomId(roomId)}
                  className={`flex shrink-0 cursor-pointer flex-col justify-between gap-2 rounded-xl border p-3 text-left transition ${
                    isSelected
                      ? "border-primary bg-white text-primary shadow-sm"
                      : "border-gray-200 bg-white text-slate-700 hover:bg-gray-50"
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold">{room.name}</p>
                    <p
                      className={`mt-0.5 text-[10px] ${isSelected ? "text-primary" : "text-gray-450"}`}
                    >
                      Base price: $
                      {room.price ||
                        room.pricePerNight ||
                        room.basePrice ||
                        "—"}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2.5 border-t border-slate-200/60 pt-1.5">
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
                        onDeleteRoom(roomId);
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
    </div>
  );
};

export default RoomTypesSidebar;
