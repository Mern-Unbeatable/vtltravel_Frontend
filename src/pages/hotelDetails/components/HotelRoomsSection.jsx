import { IoCalendarOutline, IoPersonOutline, IoCheckmarkOutline } from 'react-icons/io5'
import RoomCard from './RoomCard'

const HotelRoomsSection = ({ rooms = [], onSelectRoom }) => {
  return (
    <div id="rooms" className="mt-10">
      <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Rooms available</h2>

      {/* Quick Filter Bar */}
      <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm text-xs font-medium text-gray-700">
        <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 border border-gray-200">
          <IoCalendarOutline className="text-[#3ea5dc] text-base" />
          <span>July 23 → July 24</span>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 border border-gray-200">
          <IoPersonOutline className="text-[#3ea5dc] text-base" />
          <span>1 Room - 1 adult</span>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 border border-gray-200">
          <IoCheckmarkOutline className="text-[#3ea5dc] text-base" />
          <span>Special rates</span>
        </div>

        <button
          type="button"
          className="ml-auto rounded-full bg-[#3ea5dc] px-6 py-2 font-semibold text-white transition hover:bg-[#3296cc]"
        >
          Search
        </button>
      </div>

      {/* Room Filter Badges */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-gray-600">
        <span className="font-bold text-slate-900">Filter:</span>
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" className="h-3.5 w-3.5 accent-[#3ea5dc] rounded cursor-pointer" />
          <span>Free cancellation</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" className="h-3.5 w-3.5 accent-[#3ea5dc] rounded cursor-pointer" />
          <span>Breakfast included</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" className="h-3.5 w-3.5 accent-[#3ea5dc] rounded cursor-pointer" />
          <span>Accessible room</span>
        </label>
      </div>

      {/* Room Cards List */}
      <div className="mt-6 space-y-5">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} onSelectRoom={onSelectRoom} />
        ))}
      </div>
    </div>
  )
}

export default HotelRoomsSection
