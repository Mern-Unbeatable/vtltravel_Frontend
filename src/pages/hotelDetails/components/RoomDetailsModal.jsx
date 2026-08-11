import { useState, useEffect } from 'react'
import {
  IoClose,
  IoChevronBack,
  IoChevronForward,
  IoBedOutline,
  IoWaterOutline,
  IoStatsChartOutline,
  IoRestaurantOutline,
  IoShieldCheckmarkOutline,
  IoTvOutline,
  IoSparklesOutline,
} from 'react-icons/io5'
import { HiOutlinePhotograph } from 'react-icons/hi'
import FallbackImage from '../../../components/FallbackImage'

const CATEGORY_META = {
  food_beverage: { title: 'Food And Beverage', icon: IoRestaurantOutline },
  bathroom: { title: 'Bathroom', icon: IoWaterOutline },
  media: { title: 'Media And Technology', icon: IoTvOutline },
  service: { title: 'Service And Equipment', icon: IoShieldCheckmarkOutline },
  general: { title: 'Comfort Features', icon: IoSparklesOutline },
}

const groupAmenities = (amenities = []) => {
  const groups = {}
  amenities.forEach((item) => {
    const amenity = item?.amenity || item
    const name = amenity?.name
    if (!name) return
    const category = amenity?.category || 'general'
    if (!groups[category]) groups[category] = []
    if (!groups[category].includes(name)) groups[category].push(name)
  })
  return groups
}

const RoomDetailsModal = ({ room, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  if (!room) return null

  const images = (room.gallery || room.images || [])
    .map((img) => (typeof img === 'string' ? img : img?.url))
    .filter(Boolean)
  const displayImages = images.length > 0 ? images : ['']
  const amenityGroups = groupAmenities(room.amenities)
  const tags = (room.tags || []).filter(Boolean)
  const categoryEntries = Object.entries(amenityGroups)

  const scrollSlide = (dir) => {
    if (displayImages.length <= 1) return
    if (dir === 'next') {
      setCurrentSlide((prev) => (prev + 1) % displayImages.length)
    } else {
      setCurrentSlide((prev) => (prev - 1 + displayImages.length) % displayImages.length)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs transition-opacity">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl z-10 space-y-6 text-slate-800 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="relative h-[260px] sm:h-[320px] w-full overflow-hidden rounded-2xl bg-[#f3f4f6]">
          <FallbackImage
            src={displayImages[currentSlide]}
            alt={room.name}
            className="h-full w-full object-cover transition-all duration-300"
            dummyClassName="h-full w-full object-contain p-12"
          />

          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:bg-black/80 cursor-pointer shadow-md"
            aria-label="Close modal"
          >
            <IoClose className="text-xl" />
          </button>

          {displayImages.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => scrollSlide('prev')}
                className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md backdrop-blur-xs transition hover:bg-white cursor-pointer"
              >
                <IoChevronBack className="text-lg" />
              </button>
              <button
                type="button"
                onClick={() => scrollSlide('next')}
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md backdrop-blur-xs transition hover:bg-white cursor-pointer"
              >
                <IoChevronForward className="text-lg" />
              </button>
            </>
          ) : null}

          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-xs">
            <HiOutlinePhotograph className="h-4 w-4" />
            <span>
              {currentSlide + 1}/{displayImages.length}
            </span>
          </div>
        </div>

        <div>
          {room.name ? (
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {room.name}
            </h2>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-gray-600">
            {room.bedInfo ? (
              <div className="flex items-center gap-1.5">
                <IoBedOutline className="text-base text-[#3ea5dc]" />
                <span>{room.bedInfo}</span>
              </div>
            ) : null}
            {room.bathrooms ? (
              <div className="flex items-center gap-1.5">
                <IoWaterOutline className="text-base text-[#3ea5dc]" />
                <span>
                  {room.bathrooms} Bath{room.bathrooms !== 1 ? 's' : ''}
                </span>
              </div>
            ) : null}
            {room.size ? (
              <div className="flex items-center gap-1.5">
                <IoStatsChartOutline className="text-base text-[#3ea5dc]" />
                <span>{room.size}</span>
              </div>
            ) : null}
          </div>

          {tags.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-[#3ea5dc]"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {room.description ? (
            <p className="mt-4 text-xs leading-relaxed text-gray-500">{room.description}</p>
          ) : null}

          <a
            href="#rooms"
            onClick={onClose}
            className="mt-4 inline-block rounded-full bg-[#3ea5dc] px-6 py-2 text-xs font-semibold text-white transition hover:bg-[#3296cc]"
          >
            See the rates
          </a>
        </div>

        {categoryEntries.length > 0 ? (
          <>
            <div className="border-t border-gray-100 pt-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-600">
              {categoryEntries.map(([category, names]) => {
                const meta = CATEGORY_META[category] || CATEGORY_META.general
                const Icon = meta.icon
                return (
                  <div key={category}>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <Icon className="text-[#3ea5dc]" />
                      <h3>{meta.title}</h3>
                    </div>
                    <ul className="mt-2 list-disc space-y-0.5 pl-6 text-[11px] text-gray-500">
                      {names.map((name) => (
                        <li key={name}>{name}</li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default RoomDetailsModal
