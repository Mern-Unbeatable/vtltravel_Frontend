import { useState } from 'react'
import { HiOutlinePhotograph } from 'react-icons/hi'
import HotelGalleryModal from '../../searchResultsPage/components/HotelGalleryModal'
import FallbackImage from '../../../components/FallbackImage'

const RoomCard = ({
  room,
  stay,
  selectedQuantity = 0,
  onSelectRoom,
  onCancelRoom,
  onOpenDetails,
}) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const roomImage =
    room?.image ||
    (typeof room?.images?.[0] === 'string' ? room.images[0] : room?.images?.[0]?.url) ||
    ''
  const roomGallery = (room?.gallery || room?.images || [])
    .map((img) => (typeof img === 'string' ? img : img?.url))
    .filter(Boolean)
  const rawTags = room?.tags || []
  const roomTags = (() => {
    const joined = rawTags.join(',').trim()
    if (joined.startsWith('[') && joined.endsWith(']')) {
      try {
        const parsed = JSON.parse(joined)
        if (Array.isArray(parsed)) {
          return parsed.map((t) => (typeof t === 'string' ? t.replace(/^["']|["']$/g, '').trim() : String(t))).filter(Boolean)
        }
      } catch (e) {
        // ignore and fallback
      }
    }
    return rawTags
      .map((tag) => {
        if (typeof tag !== 'string') return String(tag)
        return tag.replace(/[\[\]\\"]/g, '').trim()
      })
      .filter(Boolean)
  })()
  const nights = stay?.nights || 0
  const adults = Number(stay?.adults) || 0
  const meta = [room?.bedInfo, room?.capacity, room?.size].filter(Boolean).join(' | ')
  const isSelected = selectedQuantity > 0

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="flex flex-col lg:flex-row">
        <div className="relative h-[220px] w-full shrink-0 overflow-hidden bg-[#f3f4f6] lg:h-auto lg:w-[300px] lg:self-stretch">
          <FallbackImage
            src={roomImage}
            alt={room?.name || 'Room'}
            className="h-full w-full object-cover lg:absolute lg:inset-0"
            dummyClassName="h-full w-full object-contain p-10 lg:absolute lg:inset-0"
          />
          <button
            type="button"
            onClick={() => onOpenDetails && onOpenDetails(room)}
            className="absolute bottom-3 left-3 z-10 flex cursor-pointer items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-xs transition hover:bg-black/75"
          >
            <HiOutlinePhotograph className="h-4 w-4" />
            <span>1/{roomGallery.length || 1}</span>
          </button>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4 p-5 md:p-6">
          <div className="min-w-0">
            {room?.name ? (
              <h3 className="text-xl font-bold tracking-tight text-slate-900">
                {room.name}
              </h3>
            ) : null}
            {meta ? (
              <p className="mt-1 text-xs font-medium text-gray-500 md:text-sm">
                {meta}
              </p>
            ) : null}

            {roomTags.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {roomTags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-[#3ea5dc] md:text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {room?.description ? (
              <p className="mt-3 text-sm leading-relaxed text-gray-500 md:text-base">
                {room.description}
              </p>
            ) : null}
          </div>

          <div className="mt-auto flex shrink-0 flex-col items-start gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              {room?.memberRate ? (
                <span className="inline-block rounded-md bg-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase text-[#3ea5dc] md:text-sm">
                  Member rate
                </span>
              ) : null}
              {nights > 0 || adults > 0 || room?.taxes ? (
                <p className="mt-1 text-xs text-gray-400 md:text-sm">
                  {nights > 0 ? `${nights} night${nights !== 1 ? 's' : ''}` : ''}
                  {nights > 0 && adults > 0 ? ', ' : ''}
                  {adults > 0 ? `${adults} adult${adults !== 1 ? 's' : ''}` : ''}
                  {room?.taxes ? ` • Taxes not included: ${room.taxes}` : ''}
                </p>
              ) : null}
              {room?.roomsLeft ? (
                <p className="line-clamp-1 text-[11px] font-semibold text-emerald-600 md:text-sm">
                  {room.roomsLeft}
                </p>
              ) : null}

              {/* <button
                type="button"
                onClick={() => onOpenDetails && onOpenDetails(room)}
                className="mt-2 block cursor-pointer text-xs font-medium text-[#3ea5dc] hover:underline md:text-sm"
              >
                See the room details
              </button> */}
            </div>

            <div className="flex flex-col items-start text-left sm:items-end sm:text-right">
              {(() => {
                const basePriceNum = Number(room?.basePrice)
                if (!Number.isFinite(basePriceNum) || basePriceNum <= 0) return null
                return (
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-[#3ea5dc]">
                      ${basePriceNum}
                    </span>
                    <span className="text-xs text-gray-500">/night</span>
                  </div>
                )
              })()}

              <button
                type="button"
                onClick={() => {
                  if (isSelected) {
                    onCancelRoom?.(room)
                    return
                  }
                  onSelectRoom?.(room)
                }}
                className={`group mt-3 cursor-pointer rounded-full px-7 py-2.5 text-xs font-bold text-white shadow-md transition active:scale-95 ${
                  isSelected
                    ? 'bg-emerald-500 hover:bg-red-500'
                    : 'bg-[#3ea5dc] hover:bg-[#3296cc]'
                }`}
              >
                {isSelected ? (
                  <>
                    <span className="group-hover:hidden">Added ({selectedQuantity})</span>
                    <span className="hidden group-hover:inline">Cancel</span>
                  </>
                ) : (
                  'Choose this room'
                )}
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
