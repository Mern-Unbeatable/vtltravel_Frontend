import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlinePhotograph } from 'react-icons/hi'
import HotelGalleryModal from './HotelGalleryModal'
import FallbackImage from '../../../components/FallbackImage'
import { useHotelImages } from '../../../hooks/useHotels'

const formatStyle = (style) => {
  if (!style) return ''
  return style
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

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

const HotelResultCard = ({ hotel, nights = 1, adults = 1, rooms = 1 }) => {
  const navigate = useNavigate()
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const hotelId = hotel?.id || hotel?.slug
  const { data: apiImages } = useHotelImages(hotel?.id, Boolean(hotel?.id))

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
  const priceValue = hotel?.fromPrice ?? hotel?.startingPrice ?? hotel?.price
  const hasPrice = priceValue !== null && priceValue !== undefined && priceValue !== ''
  const publicRate = hotel?.roomTypes?.[0]?.basePrice
  const brandText =
    formatStyle(hotel?.accommodationStyle) || hotel?.city || hotel?.location || ''
  const roomCount = hotel?._count?.roomTypes || hotel?.roomTypes?.length || hotel?.rooms?.length || 0

  const handleHotelClick = () => {
    if (!hotelId) return
    navigate(`/home/search/${hotelId}`, { state: { hotel } })
  }

  return (
    <>
      <article className="flex w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:flex-row">
        <div className="relative h-[220px] w-full shrink-0 overflow-hidden bg-[#f3f4f6] sm:h-[240px] md:h-auto md:min-h-[280px] md:w-[42%] lg:w-[320px]">
          <FallbackImage
            src={imageUrl}
            alt={title || 'Hotel'}
            className="absolute inset-0 h-full w-full object-cover"
            dummyClassName="absolute inset-0 h-full w-full object-contain p-10 sm:p-12"
          />

          {brandText ? (
            <div className="absolute left-3 top-3 rounded-lg bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-xs">
              {brandText}
            </div>
          ) : null}

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              setIsGalleryOpen(true)
            }}
            className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-xs transition-colors hover:bg-black/75"
          >
            <HiOutlinePhotograph className="h-4 w-4" />
            <span>1/{photoCount}</span>
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-between p-4 sm:p-5 md:p-6">
          <div className="mb-4 md:mb-0">
            {title ? (
              <h3 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">{title}</h3>
            ) : null}
            {shortDescription ? (
              <p className="mt-1 text-sm text-gray-500">{shortDescription}</p>
            ) : null}
            {roomCount > 0 ? (
              <p className="mt-1 text-sm font-medium text-gray-500">
                {roomCount} room{roomCount !== 1 ? 's' : ''}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col-reverse gap-5 md:flex-row md:items-end md:justify-between md:gap-0">
            <a href="#calendar" className="text-sm font-medium text-[#2d9cdb] hover:underline">
              See price calendar
            </a>

            <div className="flex flex-col items-start text-left md:items-end md:text-right">
              {hasPrice ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-base text-gray-500">From</span>
                  <span className="text-2xl font-extrabold text-[#2d9cdb] ">${priceValue}</span>
                </div>
              ) : null}

              {publicRate ? (
                <p className="mt-1 text-base font-medium text-slate-900">
                  Public rate from <span className="font-bold">${publicRate}</span>
                </p>
              ) : null}

              {/* <p className="mt-0.5 text-base text-gray-400">
                {nights} night{nights !== 0 ? 's' : ''} - {adults} adult{adults !== 0? 's' : ''}
                {rooms > 1 ? ` - ${rooms} rooms` : ''}
              </p> */}

              <button
                type="button"
                onClick={handleHotelClick}
                disabled={!hotelId}
                className="mt-4 w-full rounded-full bg-[#2d9cdb] px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-[#2680b4] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
              >
                See the hotel
              </button>
            </div>
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
