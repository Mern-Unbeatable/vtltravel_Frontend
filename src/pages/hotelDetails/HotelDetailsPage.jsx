import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import HotelHeaderGallery from './components/HotelHeaderGallery'
import HotelOverviewSection from './components/HotelOverviewSection'
import HotelFacilitiesCard from './components/HotelFacilitiesCard'
import HotelSummarySidebar from './components/HotelSummarySidebar'
import HotelRoomsSection from './components/HotelRoomsSection'
import RoomDetailsModal from './components/RoomDetailsModal'
import { useHotel } from '../../hooks/useHotels'

const galleryFallback = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
]

const HotelDetailsPage = () => {
  const { state } = useLocation()
  const hotelState = state?.hotel || {}
  const { data: hotel, isLoading, isError } = useHotel(hotelState.id)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [modalRoom, setModalRoom] = useState(null)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <svg className="animate-spin h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    )
  }

  if (isError || !hotel) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 border border-red-200 bg-red-50 text-red-600 rounded-2xl text-center font-bold">
        Failed to load hotel details. Please try again.
      </div>
    )
  }

  const title = hotel.title || 'Pullman Hanoi'
  const galleryImages = hotel.gallery && hotel.gallery.length > 0 ? hotel.gallery : galleryFallback
  const roomsList = hotel.rooms || []

  return (
    <div className="pb-16 pt-0">
      {/* 1. Top Image Gallery Banner */}
      <HotelHeaderGallery images={galleryImages} title={title} />

      {/* 2. Main Content Container */}
      <div className="mx-auto container px-4 pt-8 md:px-6">
        {/* Title, Overview & "See the rooms" CTA */}
        <HotelOverviewSection title={title} description={hotel.description} />

        {/* 2-Column Grid: Left Column (Facilities & Rooms), Right Column (Summary Sidebar) */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          {/* Left Column: Facilities Card + Rooms Section */}
          <div className="space-y-10">
            <HotelFacilitiesCard facilities={hotel.facilities} />
            <HotelRoomsSection
              rooms={roomsList}
              onSelectRoom={(room) => setSelectedRoom(room)}
              onOpenDetails={(room) => setModalRoom(room)}
            />
          </div>

          {/* Right Column: Sticky Summary Box */}
          <div>
            <HotelSummarySidebar title={title} selectedRoom={selectedRoom} />
          </div>
        </div>
      </div>

      {/* 3. Room Details Modal */}
      {modalRoom && (
        <RoomDetailsModal room={modalRoom} onClose={() => setModalRoom(null)} />
      )}
    </div>
  )
}

export default HotelDetailsPage

