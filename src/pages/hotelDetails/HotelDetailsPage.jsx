import { useState } from 'react'
import { useParams } from 'react-router-dom'
import HotelHeaderGallery from './components/HotelHeaderGallery'
import HotelOverviewSection from './components/HotelOverviewSection'
import HotelFacilitiesCard from './components/HotelFacilitiesCard'
import HotelSummarySidebar from './components/HotelSummarySidebar'
import HotelRoomsSection from './components/HotelRoomsSection'
import RoomDetailsModal from './components/RoomDetailsModal'
import { useHotel } from '../../hooks/useHotels'
import Spinner from '../../components/Spinner'
import { getStoredHotelSearch, saveHotelSearch } from '../../utils/hotelSearchStorage'
import { formatDateISO } from '../../utils/hotelSearchParams'

const mapRoomType = (room) => {
  const images = (room.images || []).map((img) => img.url).filter(Boolean)
  const amenityNames = (room.amenities || [])
    .map((item) => item?.amenity?.name || item?.name)
    .filter(Boolean)
  const tags = (room.tags || []).length > 0 ? room.tags : amenityNames
  const priceValue = room.discountPrice || room.basePrice
  const publicRate = room.basePrice
  const adults = room.maxAdults || room.maxCapacity || 0
  const size = room.sizeLabel || (room.sizeSqm ? `${room.sizeSqm}m²` : '')
  const bedInfo =
    room.bedInfo ||
    [room.bedCount, room.bedType].filter(Boolean).join(' ') ||
    ''

  return {
    ...room,
    image: images[0] || '',
    images,
    gallery: images,
    tags,
    amenityNames,
    price: priceValue ? `$${priceValue}` : '',
    priceNum: Number(priceValue) || 0,
    publicRate: publicRate ? `$${publicRate}` : '',
    capacity: adults ? `${adults} Adult${adults !== 1 ? 's' : ''}` : '',
    size,
    bedInfo,
    taxes: room.taxPerNight ? `$${room.taxPerNight}` : '',
    taxNum: Number(room.taxPerNight) || 0,
    roomsLeft: room.roomsLeftAlert || '',
    memberRate: Boolean(room.isMemberDeal),
  }
}

const HotelDetailsPage = () => {
  const { hotelId } = useParams()
  const { data: hotel, isLoading, isError } = useHotel(hotelId)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [modalRoom, setModalRoom] = useState(null)
  const [stay, setStay] = useState(() => getStoredHotelSearch())

  const handleStaySearch = (nextStay) => {
    const saved = saveHotelSearch(nextStay)
    setStay(saved)
  }

  if (isLoading) {
    return <Spinner />
  }

  if (isError || !hotel) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 border border-red-200 bg-red-50 text-red-600 rounded-2xl text-center font-bold">
        Failed to load hotel details. Please try again.
      </div>
    )
  }

  const title = hotel.name || ''
  const galleryImages = (hotel.images || [])
    .slice()
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .map((img) => img.url)
    .filter(Boolean)
  const roomsList = (hotel.roomTypes || []).filter((room) => room.isActive !== false).map(mapRoomType)
  const todayIso = formatDateISO(new Date())

  return (
    <div className="">
      <HotelHeaderGallery images={galleryImages} title={title} />

      <div className="mx-auto container px-4 pt-8 md:px-6">
        <HotelOverviewSection hotel={hotel} />

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-10">
            <HotelFacilitiesCard
              facilities={hotel.facilities}
              whyBookWithUs={hotel.whyBookWithUs}
            />
            <HotelRoomsSection
              rooms={roomsList}
              initialCheckIn={todayIso}
              initialCheckOut=""
              initialRooms={stay?.rooms || 1}
              initialAdults={stay?.adults || 1}
              initialChildren={stay?.children || 0}
              stay={stay}
              onStaySearch={handleStaySearch}
              onSelectRoom={(room) => setSelectedRoom(room)}
              onOpenDetails={(room) => setModalRoom(room)}
            />
          </div>

          <div>
            <HotelSummarySidebar
              hotel={hotel}
              stay={stay}
              selectedRoom={selectedRoom}
            />
          </div>
        </div>
      </div>

      {modalRoom && (
        <RoomDetailsModal room={modalRoom} onClose={() => setModalRoom(null)} />
      )}
    </div>
  )
}

export default HotelDetailsPage
