import { useEffect, useMemo, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import FallbackImage from '../../../components/FallbackImage'
import Spinner from '../../../components/Spinner'
import { useHotelImages } from '../../../hooks/useHotels'

const CATEGORIES = [
  'Videos',
  'Hotel',
  'Rooms',
  'Suite',
  'Restaurant',
  'Bar',
  'Breakfast',
  'Family',
  'Weddings',
  'Meetings and events',
  'Services',
  'Hotel advantages',
  'Spa',
]

const CATEGORY_KEYS = {
  Videos: ['VIDEOS', 'VIDEO'],
  Hotel: ['HOTEL'],
  Rooms: ['ROOMS', 'ROOM'],
  Suite: ['SUITE', 'SUITES'],
  Restaurant: ['RESTAURANT', 'RESTAURANTS'],
  Bar: ['BAR', 'BARS'],
  Breakfast: ['BREAKFAST'],
  Family: ['FAMILY'],
  Weddings: ['WEDDINGS', 'WEDDING'],
  'Meetings and events': ['MEETINGS_AND_EVENTS', 'MEETINGS', 'EVENTS'],
  Services: ['SERVICES', 'SERVICE'],
  'Hotel advantages': ['HOTEL_ADVANTAGES', 'ADVANTAGES'],
  Spa: ['SPA'],
}

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)(\?|$)/i

const normalizeCategory = (value) =>
  String(value || '')
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_')

const isVideoItem = (item) =>
  CATEGORY_KEYS.Videos.includes(normalizeCategory(item?.category)) ||
  VIDEO_EXT.test(item?.url || '')

const uniqueByUrl = (items = []) => {
  const seen = new Set()
  return items.filter((item) => {
    const key = item?.url || item?.id
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const sortMedia = (items = []) =>
  [...items].sort((a, b) => {
    if (Boolean(b?.isPrimary) !== Boolean(a?.isPrimary)) {
      return a?.isPrimary ? -1 : 1
    }
    return (a?.sortOrder || 0) - (b?.sortOrder || 0)
  })

const filterByCategory = (items, category) => {
  if (category === 'Videos') {
    return sortMedia(uniqueByUrl(items.filter(isVideoItem)))
  }

  const keys = CATEGORY_KEYS[category] || [normalizeCategory(category)]
  return sortMedia(
    uniqueByUrl(
      items.filter(
        (item) =>
          !isVideoItem(item) && keys.includes(normalizeCategory(item?.category)),
      ),
    ),
  )
}

const GalleryMedia = ({ item, alt }) => {
  if (isVideoItem(item)) {
    return (
      <video
        src={item.url}
        controls
        preload="metadata"
        className="h-[180px] w-full object-cover sm:h-[200px] md:h-[220px]"
      >
        <track kind="captions" />
      </video>
    )
  }

  return (
    <FallbackImage
      src={item?.url}
      alt={item?.altText || item?.caption || alt}
      className="h-[180px] w-full object-cover sm:h-[200px] md:h-[220px]"
      dummyClassName="h-[180px] w-full object-contain p-8 sm:h-[200px] md:h-[220px]"
    />
  )
}

const HotelGalleryModal = ({ open, onClose, hotelTitle, images, hotelId }) => {
  const [activeCategory, setActiveCategory] = useState('Hotel')
  const { data: apiImages, isLoading, isFetching } = useHotelImages(hotelId, open)

  const mediaItems = useMemo(() => {
    if (hotelId) return Array.isArray(apiImages) ? apiImages : []
    return (images || [])
      .map((image, index) =>
        typeof image === 'string'
          ? { id: `local-${index}`, url: image, category: 'HOTEL' }
          : image,
      )
      .filter((item) => item?.url)
  }, [hotelId, apiImages, images])

  const filteredItems = useMemo(() => {
    if (!hotelId) return mediaItems
    return filterByCategory(mediaItems, activeCategory)
  }, [hotelId, mediaItems, activeCategory])

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  useEffect(() => {
    if (open) setActiveCategory('Hotel')
  }, [open])

  if (!open) return null

  const showLoader = Boolean(hotelId) && (isLoading || (isFetching && !apiImages))

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex h-[min(860px,90vh)] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${hotelTitle || 'Hotel'} gallery`}
      >
        <aside className="hidden w-[220px] shrink-0 border-r border-gray-200 md:block">
          <nav className="h-full overflow-y-auto py-4">
            {CATEGORIES.map((category) => {
              const isActive = category === activeCategory

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`relative flex w-full items-center px-5 py-3 text-left text-[15px] transition-colors ${
                    isActive
                      ? 'font-semibold text-slate-900'
                      : 'font-medium text-slate-700 hover:bg-gray-50'
                  }`}
                >
                  {category}
                  {isActive ? (
                    <span className="absolute bottom-2 right-0 top-2 w-[3px] rounded-l bg-primary" />
                  ) : null}
                </button>
              )
            })}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-2xl font-semibold text-slate-900">{activeCategory}</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-slate-600 transition-colors hover:bg-gray-100"
              aria-label="Close gallery"
            >
              <IoClose className="h-6 w-6" />
            </button>
          </div>

          <div className="border-b border-gray-100 px-5 py-3 md:hidden overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] shrink-0">
            <div className="flex gap-2">
              {CATEGORIES.map((category) => {
                const isActive = category === activeCategory
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-transparent">
            {showLoader ? (
              <Spinner />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <div
                      key={item.id || `${activeCategory}-${item.url}-${index}`}
                      className="overflow-hidden rounded-xl bg-[#f3f4f6]"
                    >
                      <GalleryMedia
                        item={item}
                        alt={`${activeCategory} ${index + 1}`}
                      />
                    </div>
                  ))
                ) : (
                  <div className="overflow-hidden rounded-xl bg-[#f3f4f6] sm:col-span-2">
                    <FallbackImage
                      src=""
                      alt={`${activeCategory} placeholder`}
                      className="h-[180px] w-full object-cover sm:h-[200px] md:h-[220px]"
                      dummyClassName="h-[180px] w-full object-contain p-8 sm:h-[200px] md:h-[220px]"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotelGalleryModal
