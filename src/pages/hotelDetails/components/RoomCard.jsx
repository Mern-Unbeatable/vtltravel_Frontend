import { HiOutlinePhotograph } from 'react-icons/hi'
import {
  IoLeafOutline,
  IoWaterOutline,
  IoWifiOutline,
  IoCheckmarkCircleOutline,
} from 'react-icons/io5'
import { MdOutlineDeck, MdOutlineBathtub } from 'react-icons/md'
import FallbackImage from '../../../components/FallbackImage'

const amenityIcons = {
  deck: MdOutlineDeck,
  bathtub: MdOutlineBathtub,
  bath: MdOutlineBathtub,
  shower: IoWaterOutline,
  wifi: IoWifiOutline,
  'free-wifi': IoWifiOutline,
  'air-conditioning': IoCheckmarkCircleOutline,
  'mini-bar': IoCheckmarkCircleOutline,
  balcony: IoCheckmarkCircleOutline,
}

const getAmenityIcon = (name) => {
  const key = String(name).toLowerCase()
  const match = Object.keys(amenityIcons).find(
    (slug) => key.includes(slug.replace(/-/g, ' ')) || key.includes(slug),
  )
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

const extractViewFromName = (name = '') => {
  if (!name) return ''
  const parts = String(name).split(',').map((part) => part.trim())
  const viewPart = parts.find((part) => /view/i.test(part))
  return viewPart || ''
}

const pickViewBadge = (tags, amenityNames, roomName = '') => {
  const viewTag = tags.find((tag) => /view/i.test(tag))
  if (viewTag) return viewTag

  const fromName = extractViewFromName(roomName)
  if (fromName) return fromName

  const amenitySet = new Set(amenityNames.map((item) => item.toLowerCase()))
  const standalone = tags.find((tag) => !amenitySet.has(tag.toLowerCase()))
  return standalone || ''
}

const getRoomsLeftLabel = (room) => {
  if (room?.roomsLeft) return room.roomsLeft

  const raw = room?.roomsLeftAlert || ''
  if (raw) {
    const match = String(raw).match(/(\d+)/)
    if (match) {
      const count = Number(match[1])
      return `Only ${count} room${count !== 1 ? 's' : ''} left`
    }
    return String(raw)
  }

  const count = Number(
    room?.availableQuantity ??
      room?.availability?.availableQuantity ??
      room?.totalInventory ??
      room?.quantityAvailable ??
      room?.roomsAvailable,
  )
  if (Number.isFinite(count) && count >= 0) {
    return `Only ${count} room${count !== 1 ? 's' : ''} left`
  }

  return ''
}

const RoomCard = ({
  room,
  selectedQuantity = 0,
  onSelectRoom,
  onCancelRoom,
  onOpenDetails,
}) => {
  const roomImage =
    room?.image ||
    (typeof room?.images?.[0] === 'string' ? room.images[0] : room?.images?.[0]?.url) ||
    ''
  const roomGallery = (room?.gallery || room?.images || [])
    .map((img) => (typeof img === 'string' ? img : img?.url))
    .filter(Boolean)

  const allTags = parseRoomTags(room?.tags || [])
  const amenityNames = (room?.amenityNames || []).filter(Boolean)
  const viewBadge = pickViewBadge(allTags, amenityNames, room?.name)
  const amenityItems = (
    amenityNames.length > 0
      ? amenityNames
      : allTags.filter((tag) => tag !== viewBadge)
  ).slice(0, 4)

  const meta = [room?.bedInfo, room?.capacity, room?.size].filter(Boolean).join(' | ')
  const isSelected = selectedQuantity > 0

  const basePriceNum = Number(room?.basePrice)
  const discountPriceNum = Number(room?.discountPrice)
  const hasBase = Number.isFinite(basePriceNum) && basePriceNum > 0
  const hasDiscount = Number.isFinite(discountPriceNum) && discountPriceNum > 0
  const displayPrice = hasDiscount ? discountPriceNum : basePriceNum
  const hasPrice = hasBase || hasDiscount
  const roomsLeftLabel = getRoomsLeftLabel(room)

  return (
    <>
      <article className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
          {/* Left — tall inset image */}
          <div className="relative h-52 w-full shrink-0 overflow-hidden rounded-xl bg-[#f3f4f6] lg:h-auto lg:min-h-60 lg:w-72">
            <FallbackImage
              src={roomImage}
              alt={room?.name || 'Room'}
              className="h-full w-full object-cover lg:absolute lg:inset-0"
              dummyClassName="h-full w-full object-contain p-10 lg:absolute lg:inset-0"
            />
            <button
              type="button"
              onClick={() => onOpenDetails?.(room)}
              className="absolute bottom-2.5 left-2.5 z-10 flex cursor-pointer items-center gap-1 rounded bg-black/55 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-xs transition hover:bg-black/70"
            >
              <HiOutlinePhotograph className="h-3.5 w-3.5" />
              <span>1/{roomGallery.length || 1}</span>
            </button>
          </div>

          {/* Middle + right */}
          <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
            {/* Middle */}
            <div className="flex min-w-0 flex-1 flex-col lg:min-h-60 lg:py-1 lg:pr-2">
              {room?.name ? (
                <h3 className="text-xl font-bold leading-snug text-slate-900">
                  {room.name}
                </h3>
              ) : null}

              {meta ? (
                <p className="mt-1 text-sm text-gray-500">{meta}</p>
              ) : null}

              {viewBadge ? (
                <span className="mt-2.5 inline-flex w-fit items-center gap-1.5 rounded-md border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-[#3ea5dc]">
                  <IoLeafOutline className="h-3.5 w-3.5" />
                  {viewBadge}
                </span>
              ) : null}

              {room?.description ? (
                <p className="mt-3 text-sm leading-relaxed text-gray-500 line-clamp-1">
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

              {roomsLeftLabel ? (
                <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 lg:mt-auto">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                  {roomsLeftLabel}
                </div>
              ) : null}
            </div>

            {/* Right — price + button */}
            <div className="flex shrink-0 flex-col justify-end border-t border-gray-100 pt-4 lg:min-h-60 lg:w-50 lg:border-l lg:border-t-0 lg:pl-6 lg:pr-2 lg:pt-0">
              <div className="mt-auto w-full">
                {hasPrice ? (
                  <div className="mb-5 text-center">
                    <div className="flex flex-wrap items-baseline justify-center gap-x-1">
                      {/* {hasDiscount && hasBase ? (
                        <span className="text-sm text-gray-400 line-through">
                          ${basePriceNum}
                        </span>
                      ) : null} */}
                      <span className="text-[32px] font-extrabold leading-none text-[#3ea5dc]">
                        ${displayPrice}
                      </span>
                      <span className="text-sm text-gray-500">/night</span>
                    </div>
                   
                  </div>
                ) : null}

                <button
                type="button"
                onClick={() => {
                  if (isSelected) {
                    onCancelRoom?.(room)
                    return
                  }
                  onSelectRoom?.(room)
                }}
                className={`group w-full cursor-pointer rounded-xl px-5 py-3 text-sm font-bold text-white shadow-sm transition active:scale-95 ${
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
      </article>

    </>
  )
}

export default RoomCard
