import { useLocation } from 'react-router-dom'
import HotelHeaderGallery from './components/HotelHeaderGallery'
import HotelOverviewSection from './components/HotelOverviewSection'
import HotelFacilitiesCard from './components/HotelFacilitiesCard'
import HotelSummarySidebar from './components/HotelSummarySidebar'
import HotelRoomsSection from './components/HotelRoomsSection'

const galleryFallback = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
]

const roomsList = [
  {
    id: 1,
    name: 'SUPERIOR ROOM, 1 King Size Bed, City View',
    bedInfo: '1 King size bed(s)',
    capacity: '3 pers. max',
    size: '32m²',
    tags: ['City View', 'Bathtub/shower combination', 'Rainfall shower experience'],
    memberRate: true,
    price: '$216.57',
    publicRate: '$227.95',
    taxes: '$29.02',
    roomsLeft: 'Only 1 room left',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'DELUXE SUITE, 1 King Size Bed, Ocean View',
    bedInfo: '1 King size bed(s)',
    capacity: '3 pers. max',
    size: '48m²',
    tags: ['Ocean View', 'Private Balcony', 'Executive Lounge Access'],
    memberRate: true,
    price: '$285.00',
    publicRate: '$310.00',
    taxes: '$32.50',
    roomsLeft: '2 rooms left',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  },
]

const HotelDetailsPage = () => {
  const { state } = useLocation()
  const hotel = state?.hotel || {}

  const title = hotel.title || 'Pullman Hanoi'
  const galleryImages = galleryFallback

  return (
    <div className="pb-16 pt-0">
      {/* 1. Top Image Gallery Banner */}
      <HotelHeaderGallery images={galleryImages} title={title} />

      {/* 2. Main Content Container */}
      <div className="mx-auto container px-4 pt-8 md:px-6">
        {/* Title, Overview & "See the rooms" CTA */}
        <HotelOverviewSection title={title} />

        {/* 2-Column Grid: Facilities & Summary Box */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          {/* Left Column: Facilities Card */}
          <div>
            <HotelFacilitiesCard />
          </div>

          {/* Right Column: Sticky Summary Box */}
          <div>
            <HotelSummarySidebar title={title} />
          </div>
        </div>
      </div>

      {/* 3. Rooms Available Section */}
      <HotelRoomsSection rooms={roomsList} />
    </div>
  )
}

export default HotelDetailsPage
