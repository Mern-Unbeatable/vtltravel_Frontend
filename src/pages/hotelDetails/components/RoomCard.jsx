import { useState } from 'react'
import { HiOutlinePhotograph } from 'react-icons/hi'
import {
  IoLeafOutline,
  IoWaterOutline,
  IoWifiOutline,
  IoCheckmarkCircleOutline,
} from 'react-icons/io5'
import { MdOutlineDeck, MdOutlineBathtub } from 'react-icons/md'
import HotelGalleryModal from '../../searchResultsPage/components/HotelGalleryModal'
import FallbackImage from '../../../components/FallbackImage'

const amenityIcons = {
  deck: MdOutlineDeck,
  bathtub: MdOutlineBathtub,
  bath: MdOutlineBathtub,
  shower: IoWaterOutline,
  wifi: IoWifiOutline,
  'free-wifi': IoWifiOutline,
}

const getAmenityIcon = (name) => {
  const key = String(name).toLowerCase()
  const match = Object.keys(amenityIcons).find((slug) => key.includes(slug))
  return match ? amenityIcons[match] : IoCheckmarkCircleOutline
}

const parseRoomTags = (rawTags = []) => {
  const joined = rawTags.join(',').trim()
  if (joined.startsWith('[') && joined.endsWith(']')) {
    try {
      const parsed = JSON.parse(joined)
      if (Array.isArray(parsed)) {
        return parsed
          .map((t) =>
            typeof t === 'string' ? t.replace(/^["']|["']$/g, '').trim() : String(t),
          )
          .filter(Boolean)
      }
    } catch {
      // fall through
    }
  }
  return rawTags
    .map((tag) => {
      if (typeof tag !== 'string') return String(tag)
      return tag.replace(/[\[\]\\"]/g, '').trim()
    })
    .filter(Boolean)
}

const RoomCard = ({
  room,
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

  const allTags = parseRoomTags(room?.tags || [])
  const amenityNames = (room?.amenityNames || []).filter(Boolean)
  const viewBadge = allTags[0] || ''
  const amenityItems =
    amenityNames.length > 0
      ? amenityNames.slice(0, 4)
      : allTags.slice(1, 5)

  const meta = [room?.bedInfo, room?.capacity, room?.size].filter(Boolean).join(' | ')
  const isSelected = selectedQuantity > 0

  const basePriceNum = Number(room?.basePrice)
  const discountPriceNum = Number(room?.discountPrice)
  const hasBase = Number.isFinite(basePriceNum) && basePriceNum > 0
  const hasDiscount = Number.isFinite(discountPriceNum) && discountPriceNum > 0
  const displayPrice = hasDiscount ? discountPriceNum : basePriceNum
  const hasPrice = hasBase || hasDiscount

  return (
    <>
      <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-stretch">
          {/* Image */}
          <div className="relative h-[220px] w-full shrink-0 overflow-hidden bg-[#f3f4f6] lg:h-auto lg:w-[280px] xl:w-[300px]">
            <FallbackImage
              src={roomImage}
              alt={room?.name || 'Room'}
              className="h-full w-full object-cover lg:absolute lg:inset-0"
              dummyClassName="h-full w-full object-contain p-10 lg:absolute lg:inset-0"
            />
            <button
              type="button"
              onClick={() => setIsGalleryOpen(true)}
              className="absolute bottom-3 left-3 z-10 flex cursor-pointer items-center gap-1.5 rounded-md bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-xs transition hover:bg-black/70"
            >
              <HiOutlinePhotograph className="h-3.5 w-3.5" />
              <span>1/{roomGallery.length || 1}</span>
            </button>
          </div>

          {/* Details + pricing */}
          <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
            {/* Middle: room info */}
            <div className="flex min-w-0 flex-1 flex-col p-5 md:p-6">
              {room?.name ? (
                <h3 className="text-xl font-bold tracking-tight text-slate-900 md:text-[22px]">
                  {room.name}
                </h3>
              ) : null}

              {meta ? (
                <p className="mt-1 text-sm font-medium text-gray-500">{meta}</p>
              ) : null}

              {viewBadge ? (
                <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-[#3ea5dc]">
                  <IoLeafOutline className="h-3.5 w-3.5" />
                  {viewBadge}
                </span>
              ) : null}

              {room?.description ? (
                <p className="mt-3 text-sm leading-relaxed text-gray-500">
                  {room.description}
                </p>
              ) : null}

              {amenityItems.length > 0 ? (
                <>
                  <div className="my-4 border-t border-gray-100" />
                  <div className="flex flex-wrap gap-2">
                    {amenityItems.map((item) => {
                      const Icon = getAmenityIcon(item)
                      return (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600"
                        >
                          <Icon className="h-3.5 w-3.5 text-slate-400" />
                          {item}
                        </span>
                      )
                    })}
                  </div>
                </>
              ) : null}

              {room?.roomsLeft ? (
                <div className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {room.roomsLeft}
                </div>
              ) : null}

              {room?.memberRate ? (
                <span className="mt-3 inline-block w-fit rounded-md bg-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase text-[#3ea5dc]">
                  Member rate
                </span>
              ) : null}
            </div>

            {/* Right: price + CTA */}
            <div className="flex shrink-0 flex-col items-center justify-between border-t border-gray-100 px-5 py-5 lg:w-[190px] lg:border-l lg:border-t-0 lg:px-6 lg:py-6">
              <div className="flex w-full flex-col items-center text-center">
                {hasPrice ? (
                  <>
                    <div className="flex flex-wrap items-baseline justify-center gap-1.5">
                      {hasDiscount && hasBase ? (
                        <span className="text-sm font-semibold text-gray-400 line-through">
                          ${basePriceNum}
                        </span>
                      ) : null}
                      <span className="text-3xl font-extrabold leading-none text-[#3ea5dc]">
                        ${displayPrice}
                      </span>
                      <span className="text-sm text-gray-500">/night</span>
                    </div>
                    <p className="mt-1.5 text-xs text-gray-400">Per room / night</p>
                  </>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => {
                  if (isSelected) {
                    onCancelRoom?.(room)
                    return
                  }
                  onSelectRoom?.(room)
                }}
                className={`group mt-5 w-full cursor-pointer rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-md transition active:scale-95 ${
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
      </article>

      <HotelGalleryModal
        open={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        hotelTitle={room?.name}
        images={roomGallery}
      />
    </>
  )
}

export default RoomCard
