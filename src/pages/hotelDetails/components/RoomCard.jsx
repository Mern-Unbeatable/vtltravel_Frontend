import { useState } from 'react'
import { HiOutlinePhotograph } from 'react-icons/hi'
import HotelGalleryModal from '../../searchResultsPage/components/HotelGalleryModal'
import FallbackImage from '../../../components/FallbackImage'

const RoomCard = ({ room, stay, selectedQuantity = 0, onSelectRoom, onOpenDetails }) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const roomImage =
    room?.image ||
    (typeof room?.images?.[0] === 'string' ? room.images[0] : room?.images?.[0]?.url) ||
    ''
  const roomGallery = (room?.gallery || room?.images || [])
    .map((img) => (typeof img === 'string' ? img : img?.url))
    .filter(Boolean)
  const roomTags = (room?.tags || []).filter(Boolean)
  const nights = stay?.nights || 0
  const adults = Number(stay?.adults) || 0
  const meta = [room?.bedInfo, room?.capacity, room?.size].filter(Boolean).join(' | ')
  const isSelected = selectedQuantity > 0

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="flex flex-col lg:flex-row">
        <div className="relative h-[220px] w-full shrink-0 overflow-hidden bg-[#f3f4f6] lg:h-auto lg:w-[320px]">
          <FallbackImage
            src={roomImage}
            alt={room?.name || 'Room'}
            className="h-full w-full object-cover"
            dummyClassName="h-full w-full object-contain p-10"
          />
          <button
            type="button"
            onClick={() => onOpenDetails && onOpenDetails(room)}
            className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-xs transition hover:bg-black/75 cursor-pointer"
          >
            <HiOutlinePhotograph className="h-4 w-4" />
            <span>1/{roomGallery.length || 1}</span>
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
          <div>
            {room?.name ? (
              <h3 className="text-xl font-bold tracking-tight text-slate-900">{room.name}</h3>
            ) : null}
            {meta ? <p className="mt-1 text-xs md:text-sm font-medium text-gray-500">{meta}</p> : null}

            {roomTags.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {roomTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-sky-50 px-2.5 py-1 text-[11px] md:text-sm font-semibold text-[#3ea5dc]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {room?.description ? (
              <p className="mt-3 line-clamp-2 text-sm   md:text-base leading-relaxed text-gray-500">
                {room.description}
              </p>
            ) : null}
          </div>

          <div className="mt-6 flex flex-col items-start gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              {room?.memberRate ? (
                <span className="inline-block rounded-md bg-sky-100 px-2 py-0.5 text-[10px] md:text-sm font-bold text-[#3ea5dc] uppercase">
                  Member rate
                </span>
              ) : null}
              {(nights > 0 || adults > 0 || room?.taxes) ? (
                <p className="mt-1 text-xs md:text-sm text-gray-400">
                  {nights > 0 ? `${nights} night${nights !== 1 ? 's' : ''}` : ''}
                  {nights > 0 && adults > 0 ? ', ' : ''}
                  {adults > 0 ? `${adults} adult${adults !== 1 ? 's' : ''}` : ''}
                  {room?.taxes ? ` • Taxes not included: ${room.taxes}` : ''}
                </p>
              ) : null}
              {room?.roomsLeft ? (
                <p className="text-[11px] md:text-sm font-semibold text-emerald-600"></p>
              ) : null}

              <button
                type="button"
                onClick={() => onOpenDetails && onOpenDetails(room)}
                className="mt-3 block text-xs md:text-sm font-medium text-[#3ea5dc] hover:underline cursor-pointer"
              >
                See the room details
              </button>
            </div>

            <div className="flex flex-col items-start text-left sm:items-end sm:text-right">
              {room?.price ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-gray-500">From</span>
                  <span className="text-2xl font-extrabold text-[#3ea5dc]">{room.price}</span>
                </div>
              ) : null}
              {room?.publicRate && room.publicRate !== room.price ? (
                <p className="mt-0.5 text-xs text-gray-500">
                  Public rate from <span className="font-semibold">{room.publicRate}</span>
                </p>
              ) : null}

              <button
                type="button"
                onClick={() => onSelectRoom && onSelectRoom(room)}
                className={`mt-3 rounded-full px-7 py-2.5 text-xs font-bold text-white shadow-md transition active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 hover:bg-emerald-600'
                    : 'bg-[#3ea5dc] hover:bg-[#3296cc]'
                }`}
              >
                {isSelected ? `Added (${selectedQuantity})` : 'Choose this room'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <HotelGalleryModal
        open={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        hotelTitle={room?.name}
        images={roomGallery}
      />
    </article>
  )
}

export default RoomCard
