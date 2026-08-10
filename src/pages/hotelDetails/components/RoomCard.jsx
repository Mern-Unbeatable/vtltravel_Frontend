import { useState } from 'react'
import { HiOutlinePhotograph } from 'react-icons/hi'
import HotelGalleryModal from '../../searchResultsPage/components/HotelGalleryModal'

const RoomCard = ({ room, onSelectRoom, onOpenDetails }) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const roomGallery = room?.gallery || [
    room.image,
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
  ]

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="flex flex-col lg:flex-row">
        {/* Room Image */}
        <div className="relative h-[220px] w-full shrink-0 lg:h-auto lg:w-[320px]">
          <img src={room.image} alt={room.name} className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => setIsGalleryOpen(true)}
            className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-xs transition hover:bg-black/75 cursor-pointer"
          >
            <HiOutlinePhotograph className="h-4 w-4" />
            <span>1/{roomGallery.length}</span>
          </button>
        </div>

        {/* Room Details */}
        <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900">{room.name}</h3>
            <p className="mt-1 text-xs font-medium text-gray-500">
              {room.bedInfo} | {room.capacity} | {room.size}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {room.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-[#3ea5dc]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col items-start gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              {room.memberRate && (
                <span className="inline-block rounded-md bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-[#3ea5dc] uppercase">
                  Member rate
                </span>
              )}
              <p className="mt-1 text-xs text-gray-400">
                2 nights, 1 adult • Taxes not included: {room.taxes}
              </p>
              <p className="text-[11px] font-semibold text-emerald-600">{room.roomsLeft}</p>

              <button
                type="button"
                onClick={() => onOpenDetails && onOpenDetails(room)}
                className="mt-3 block text-xs font-medium text-[#3ea5dc] hover:underline cursor-pointer"
              >
                See the room details
              </button>
            </div>

            <div className="flex flex-col items-start text-left sm:items-end sm:text-right">
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-gray-500">From</span>
                <span className="text-2xl font-extrabold text-[#3ea5dc]">{room.price}</span>
              </div>
              <p className="mt-0.5 text-xs text-gray-500">
                Public rate from <span className="font-semibold">{room.publicRate}</span>
              </p>

              <button
                type="button"
                onClick={() => onSelectRoom && onSelectRoom(room)}
                className="mt-3 rounded-full bg-[#3ea5dc] px-7 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#3296cc] active:scale-95 cursor-pointer"
              >
                Choose this room
              </button>
            </div>
          </div>
        </div>
      </div>
      <HotelGalleryModal
        open={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        hotelTitle={room.name}
        images={roomGallery}
      />
    </article>
  )
}

export default RoomCard
