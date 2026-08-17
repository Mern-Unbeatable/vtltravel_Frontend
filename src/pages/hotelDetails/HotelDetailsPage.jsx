import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import HotelHeaderGallery from './components/HotelHeaderGallery'
import HotelOverviewSection from './components/HotelOverviewSection'
import HotelFacilitiesCard from './components/HotelFacilitiesCard'
import HotelSummarySidebar from './components/HotelSummarySidebar'
import HotelRoomsSection from './components/HotelRoomsSection'
import RoomDetailsModal from './components/RoomDetailsModal'
import { useHotel, useHotelRooms } from '../../hooks/useHotels'
import { HotelDetailsSkeleton } from '../../components/skeletons/Skeleton'
import { getStoredHotelSearch, saveHotelSearch } from '../../utils/hotelSearchStorage'
import { isRoomBookedForStay, ROOM_BOOKED_MESSAGE } from '../../utils/roomAvailability'
import {
  normalizeSelectedRooms,
  updateSelectedRoomQuantity,
  getSelectedRoomsQuantity,
} from '../../utils/selectedRooms'
import { toast } from 'react-toastify'

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
    roomsLeft: (() => {
      const raw = room.roomsLeftAlert || room.roomsLeft || ''
      if (!raw) return ''
      const match = String(raw).match(/(\d+)/)
      if (!match) return String(raw)
      const count = Number(match[1])
      return `Only ${count} room${count !== 1 ? 's' : ''} left`
    })(),
    memberRate: Boolean(room.isMemberDeal),
    pricePreview: room.pricePreview || null,
    availableForDates: room.availableForDates,
  }
}

const HotelDetailsPage = () => {
  const { hotelId } = useParams()
  const [selectedRooms, setSelectedRooms] = useState([])
  const [modalRoom, setModalRoom] = useState(null)
  const [stay, setStay] = useState(() => getStoredHotelSearch())
  const stayParams =
    stay?.checkIn && stay?.checkOut
      ? {
          checkIn: stay.checkIn,
          checkOut: stay.checkOut,
          adults: Number(stay.adults) || 1,
          rooms: Number(stay.rooms) || 1,
          children: Number(stay.children) || 0,
        }
      : {}
  const { data: hotel, isLoading, isFetching, isError } = useHotel(hotelId, stayParams)
  const { data: apiRooms } = useHotelRooms(hotelId, stayParams)

  const getRoomAvailableQuantity = (room) => {
    // Prefer "Only X rooms left" inventory text — availability.availableQuantity
    // is often scoped to the search rooms count (e.g. 1) and blocks checkout +.
    const alertText = room?.roomsLeftAlert || room?.roomsLeft || ''
    const alertMatch = String(alertText).match(/(\d+)/)
    if (alertMatch) return Math.max(0, Number(alertMatch[1]))

    for (const key of ['totalRooms', 'totalQuantity', 'inventory', 'stock']) {
      const value = room?.[key]
      if (value !== undefined && value !== null && value !== '') {
        const n = Number(value)
        if (!Number.isNaN(n) && n > 0) return Math.max(0, n)
      }
    }

    const fromAvailability = room?.availability?.availableQuantity ?? room?.availableQuantity
    if (fromAvailability !== undefined && fromAvailability !== null && fromAvailability !== '') {
      const n = Number(fromAvailability)
      if (!Number.isNaN(n)) return Math.max(0, n)
    }
    return null
  }

  const resolveRoomInventory = (roomId, fallbackRoom = null) => {
    const fromApi = (apiRooms || []).find((item) => item.id === roomId)
    const fromHotel = (hotel?.roomTypes || []).find((item) => item.id === roomId)
    return {
      ...fromHotel,
      ...fromApi,
      ...fallbackRoom,
      roomsLeftAlert:
        fromApi?.roomsLeftAlert ||
        fromHotel?.roomsLeftAlert ||
        fallbackRoom?.roomsLeftAlert ||
        '',
      roomsLeft:
        fallbackRoom?.roomsLeft ||
        fromApi?.roomsLeftAlert ||
        fromHotel?.roomsLeftAlert ||
        fromApi?.roomsLeft ||
        fromHotel?.roomsLeft ||
        '',
    }
  }

  const handleStaySearch = (nextStay) => {
    const saved = saveHotelSearch(nextStay)
    setStay(saved)
    const nextMax = Number(saved.rooms) || 1
    setSelectedRooms((prev) => {
      const normalized = normalizeSelectedRooms(prev)
      const total = getSelectedRoomsQuantity(normalized)
      if (total <= nextMax) return normalized
      let remaining = nextMax
      const trimmed = []
      for (const room of normalized) {
        if (remaining <= 0) break
        const quantity = Math.min(room.quantity, remaining)
        trimmed.push({ ...room, quantity })
        remaining -= quantity
      }
      return trimmed
    })
  }

  useEffect(() => {
    if (!hotel) return
    setSelectedRooms((prev) => {
      const normalized = normalizeSelectedRooms(prev)
      if (normalized.length === 0) return prev
      return normalized.map((selected) => {
        const updated = (hotel.roomTypes || [])
          .filter((room) => room.isActive !== false)
          .map(mapRoomType)
          .find((room) => room.id === selected.id)
        return updated ? { ...updated, quantity: selected.quantity } : selected
      })
    })
  }, [hotel])

  const handleSelectRoom = (room) => {
    if (isRoomBookedForStay(room, stay)) {
      toast.error(ROOM_BOOKED_MESSAGE)
      return
    }

    const maxRooms = Math.max(1, Number(stay?.rooms) || 1)
    const inventoryRoom = resolveRoomInventory(room.id, room)
    const current = normalizeSelectedRooms(selectedRooms)
    const existing = current.find((item) => item.id === room.id)
    const currentQty = Number(existing?.quantity) || 0
    const currentTotal = getSelectedRoomsQuantity(current)
    const available = getRoomAvailableQuantity(inventoryRoom)

    if (currentTotal >= maxRooms && !existing) {
      toast.info(
        `You can select up to ${maxRooms} room${maxRooms !== 1 ? 's' : ''} for this search.`,
      )
      return
    }

    if (existing && currentTotal >= maxRooms) {
      toast.info(
        `You can select up to ${maxRooms} room${maxRooms !== 1 ? 's' : ''} for this search.`,
      )
      return
    }

    if (available !== null && currentQty >= available) {
      toast.info(
        `Only ${available} room${available !== 1 ? 's' : ''} available for this type.`,
      )
      return
    }

    const next = existing
      ? current.map((item) =>
          item.id === room.id
            ? { ...item, ...room, quantity: item.quantity + 1 }
            : item,
        )
      : [...current, { ...room, quantity: 1 }]

    setSelectedRooms(next)
  }

  const handleCancelRoom = (room) => {
    setSelectedRooms(updateSelectedRoomQuantity(selectedRooms, room.id, 0))
  }

  const handleRoomQuantityChange = (roomId, quantity) => {
    const currentRoom = selectedRooms.find((room) => room.id === roomId)
    const inventoryRoom = resolveRoomInventory(roomId, currentRoom)
    const nextQty = Number(quantity) || 0
    const currentQty = Number(currentRoom?.quantity) || 0
    const maxRooms = Math.max(1, Number(stay?.rooms) || 1)
    const currentTotal = getSelectedRoomsQuantity(selectedRooms)
    const available = getRoomAvailableQuantity(inventoryRoom)

    if (nextQty > currentQty && currentTotal >= maxRooms) {
      toast.info(
        `You can select up to ${maxRooms} room${maxRooms !== 1 ? 's' : ''} for this search.`,
      )
      return
    }

    if (available !== null && nextQty > available) {
      toast.info(
        `Only ${available} room${available !== 1 ? 's' : ''} available for this type.`,
      )
      return
    }

    setSelectedRooms(updateSelectedRoomQuantity(selectedRooms, roomId, nextQty))
  }

  if (isLoading) {
    return <HotelDetailsSkeleton />
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
  const roomsSource = apiRooms || hotel.roomTypes || []
  console.log("--- RENDERING HOTEL DETAILS ROOMS ---", { hotelId, stayParams, apiRooms, roomsSource })
  const roomsList = roomsSource
    .filter((room) => {
      if (room.isActive === false) return false
      if (room.availableForDates === false) return false
      if (room.availability) {
        if (room.availability.blockedByCalendar === true) return false
        if (room.availability.isAvailable === false) return false
        if (room.availability.availableForDates === false) return false
        if (
          room.availability.availableQuantity !== undefined &&
          room.availability.availableQuantity !== null &&
          Number(room.availability.availableQuantity) <= 0
        ) {
          return false
        }
      }
      return true
    })
    .map(mapRoomType)

  return (
    <div className="">
      <HotelHeaderGallery images={galleryImages} title={title} hotelId={hotel.id} />

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
              initialCheckIn={stay?.checkIn || ''}
              initialCheckOut={stay?.checkOut || ''}
              initialRooms={stay?.rooms || 1}
              initialAdults={stay?.adults || 1}
              initialChildren={stay?.children || 0}
              stay={stay}
              selectedRooms={selectedRooms}
              onStaySearch={handleStaySearch}
              onSelectRoom={handleSelectRoom}
              onCancelRoom={handleCancelRoom}
              onOpenDetails={(room) => setModalRoom(room)}
            />
          </div>

          <div>
            <HotelSummarySidebar
              hotel={hotel}
              stay={stay}
              selectedRooms={selectedRooms}
              onRoomQuantityChange={handleRoomQuantityChange}
              onStayChange={handleStaySearch}
              isLoading={isFetching}
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
