import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlinePhotograph } from 'react-icons/hi'
import {
  IoStar,
  IoStarHalf,
  IoStarOutline,
  IoPeopleOutline,
  IoSparklesOutline,
  IoRestaurantOutline,
  IoCheckmarkCircleOutline,
  IoWifiOutline,
  IoFitnessOutline,
} from 'react-icons/io5'
import { MdOutlineBeachAccess, MdOutlinePool, MdOutlineFamilyRestroom } from 'react-icons/md'
import { TbBeach } from 'react-icons/tb'
import HotelGalleryModal from './HotelGalleryModal'
import FallbackImage from '../../../components/FallbackImage'
import { useHotelImages } from '../../../hooks/useHotels'
import { getHotelCardDisplay } from '../../../utils/hotelCardDisplay'

const amenityIcons = {
  'private-beach': MdOutlineBeachAccess,
  beach: MdOutlineBeachAccess,
  pool: MdOutlinePool,
  'swimming-pool': MdOutlinePool,
  'family-friendly': IoPeopleOutline,
  spa: IoSparklesOutline,
  breakfast: IoRestaurantOutline,
  wifi: IoWifiOutline,
  'free-wifi': IoWifiOutline,
  fitness: IoFitnessOutline,
}

const getAmenityIcon = (slug) => amenityIcons[slug] || IoCheckmarkCircleOutline

const toImageUrls = (images) => {
  if (!images) return []
  const list = Array.isArray(images) ? images : [images]
  const seen = new Set()
  return list
    .map((img) => (typeof img === 'string' ? img : img?.url))
    .filter((url) => {
      if (!url || seen.has(url)) return false
      seen.add(url)
      return true
    })
}

const StarRow = ({ rating }) => {
  const value = Number(rating) || 0
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = value >= index + 1
        const half = !filled && value >= index + 0.5
        if (filled) return <IoStar key={index} className="h-4 w-4 text-amber-400" />
        if (half) return <IoStarHalf key={index} className="h-4 w-4 text-amber-400" />
        return <IoStarOutline key={index} className="h-4 w-4 text-amber-300" />
      })}
    </div>
  )
}

const HotelResultCard = ({ hotel }) => {
  const navigate = useNavigate()
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const hotelId = hotel?.id || hotel?.slug
  const { data: apiImages } = useHotelImages(hotel?.id, Boolean(hotel?.id))
  const display = getHotelCardDisplay(hotel)

  const title = hotel?.name || hotel?.title || ''
  const shortDescription = hotel?.shortDescription || ''
  const imageUrl =
    hotel?.primaryImage || hotel?.coverImageUrl || hotel?.images?.[0]?.url || hotel?.image || ''
  const galleryImages = useMemo(() => {
    const fromApi = toImageUrls(apiImages)
    if (fromApi.length > 0) return fromApi

    const fromHotel = toImageUrls(hotel?.images)
    if (fromHotel.length > 0) return fromHotel

    const fromGallery = toImageUrls(hotel?.gallery)
    if (fromGallery.length > 0) return fromGallery

    return imageUrl ? [imageUrl] : []
  }, [apiImages, hotel?.images, hotel?.gallery, imageUrl])
  const photoCount = galleryImages.length || 1
  const hasPrice =
    display.fromPrice !== null && display.fromPrice !== undefined && display.fromPrice !== ''

  const handleHotelClick = () => {
    if (!hotelId) return
    navigate(`/home/search/${hotelId}`, { state: { hotel } })
  }

  return (
    <>
      <article className="flex w-full flex-col rounded-xl border border-gray-200 bg-white p-3 shadow-sm md:flex-row md:items-stretch md:gap-4 md:p-3">
        <div className="relative h-52 w-full shrink-0 overflow-hidden rounded-2xl bg-[#f3f4f6] sm:h-56 md:h-auto md:w-0 lg:w-65">
          <FallbackImage
            src={imageUrl}
            alt={title || 'Hotel'}
            className="absolute inset-0 h-full w-full object-cover"
            dummyClassName="absolute inset-0 h-full w-full object-contain p-10"
          />

          {display.locationLabel ? (
            <div className="absolute left-3 top-3 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
              {display.locationLabel}
            </div>
          ) : null}

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              setIsGalleryOpen(true)
            }}
            className="absolute bottom-3 left-3 flex items-center gap-1 rounded-md bg-black/55 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-xs transition-colors hover:bg-black/70"
          >
            <HiOutlinePhotograph className="h-3.5 w-3.5" />
            <span>1/{photoCount}</span>
          </button>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4 px-1 py-3 md:flex-row md:items-stretch md:justify-between md:py-2 md:pr-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
              {title ? (
                <h3 className="text-[22px] font-bold leading-tight tracking-tight text-slate-900">
                  {title}
                </h3>
              ) : null}

              {display.badges.length > 0 ? (
                <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">
                  {display.badges.map((badge, index) => {
                    const isGreen = badge.tone === 'green'
                    const BadgeIcon = isGreen ? MdOutlineFamilyRestroom : TbBeach
                    return (
                      <span
                        key={`${badge.label}-${index}`}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                          isGreen
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-sky-50 text-[#3ea5dc]'
                        }`}
                      >
                        <BadgeIcon className="h-3.5 w-3.5" />
                        {badge.label}
                      </span>
                    )
                  })}
                </div>
              ) : null}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StarRow rating={display.guestRating} />
              <span className="text-sm font-semibold text-[#3ea5dc]">
                {display.guestRating} {display.ratingLabel}
              </span>
              <span className="text-sm text-gray-400">
                ({display.reviewCount} reviews)
              </span>
            </div>

            {shortDescription ? (
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {shortDescription}
              </p>
            ) : null}

            {display.amenities.length > 0 ? (
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                {display.amenities.map((amenity) => {
                  const Icon = getAmenityIcon(amenity.slug)
                  return (
                    <span
                      key={amenity.slug || amenity.name}
                      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-500"
                    >
                      <Icon className="h-4 w-4 text-slate-400" />
                      {amenity.name}
                    </span>
                  )
                })}
              </div>
            ) : null}

            {display.bestFor.length > 0 ? (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#eaf6fc] px-3.5 py-2.5 text-sm text-[#3ea5dc]">
                <IoPeopleOutline className="h-4 w-4 shrink-0" />
                <p>
                  <span className="font-bold">Best for:</span>{' '}
                  <span className="font-medium">{display.bestFor.join(' • ')}</span>
                </p>
              </div>
            ) : null}

            {/* <a
              href="#calendar"
              className="mt-3 inline-block text-sm font-semibold text-[#3ea5dc] hover:underline"
            >
              See price calendar
            </a> */}
          </div>

          <div className="mt-auto flex shrink-0 flex-col items-start justify-end border-t border-gray-100 pt-4 md:w-42 md:items-end md:border-t-0 md:pt-0 md:text-right">
            {hasPrice ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm text-gray-400">From</span>
                <span className="text-[28px] font-extrabold leading-none text-[#2d9cdb]">
                  ${display.fromPrice}
                </span>
              </div>
            ) : null}

            {display.publicRate ? (
              <p className="mt-1.5 text-sm text-gray-400">
                Public rate from{' '}
                <span className="font-semibold text-slate-700">${display.publicRate}</span>
              </p>
            ) : null}

            <button
              type="button"
              onClick={handleHotelClick}
              disabled={!hotelId}
              className="mt-5 w-full rounded-full bg-[#2d9cdb] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2680b4] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
            >
              See the hotel
            </button>
          </div>
        </div>
      </article>

      <HotelGalleryModal
        open={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        hotelTitle={title}
        hotelId={hotel?.id || hotelId}
        images={galleryImages}
      />
    </>
  )
}

export default HotelResultCard
