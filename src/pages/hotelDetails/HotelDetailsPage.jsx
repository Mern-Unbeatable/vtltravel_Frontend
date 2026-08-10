import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import HotelHeaderGallery from './components/HotelHeaderGallery'
import HotelOverviewSection from './components/HotelOverviewSection'
import HotelFacilitiesCard from './components/HotelFacilitiesCard'
import HotelSummarySidebar from './components/HotelSummarySidebar'
import HotelRoomsSection from './components/HotelRoomsSection'
import RoomDetailsModal from './components/RoomDetailsModal'
import { useHotel } from '../../hooks/useHotels'

import Spinner from '../../components/Spinner'

const galleryFallback = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
]

const HotelDetailsPage = () => {
  const { hotelId } = useParams()
  const { state } = useLocation()
  const hotelState = state?.hotel || {}
  const targetId = hotelState.id || hotelId
  const { data: hotel, isLoading, isError } = useHotel(targetId)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [modalRoom, setModalRoom] = useState(null)

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

  const title = hotel.title || 'Pullman Hanoi'
  const galleryImages = hotel.gallery && hotel.gallery.length > 0 ? hotel.gallery : galleryFallback
  const roomsList = hotel.rooms || []

  return (
    <div className="">
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

