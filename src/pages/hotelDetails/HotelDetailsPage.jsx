import { useLocation } from 'react-router-dom'
import { HiOutlinePhotograph } from 'react-icons/hi'

const galleryFallback = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1100&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1100&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1100&q=80',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1100&q=80',
]

const HotelDetailsPage = () => {
  const { state } = useLocation()
  const hotel = state?.hotel || {}

  const title = hotel.title || 'Pullman Hanoi'
  const heroImage = hotel.image || galleryFallback[0]
  const galleryImages = [heroImage, ...galleryFallback.slice(1)]

  return (
    <section className="pb-10 pt-6">
      <div className="mx-auto w-full container px-4">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {galleryImages.map((image, index) => (
            <div key={`${image}-${index}`} className="h-[160px] overflow-hidden md:h-[190px]">
              <img src={image} alt={`${title} ${index + 1}`} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{title}</h1>

            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <h2 className="text-base font-bold text-gray-900">About the property</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Located conveniently in Bintan, offering easy access to transport hub, beaches, and dining. Exceptional comfort and customer service for your tropical trip.
              </p>
            </div>

            <div className="mt-8 grid border border-gray-200 md:grid-cols-2">
              <div className="p-4">
                <h3 className="text-2xl font-semibold text-slate-900">Most popular facilities</h3>
                <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-600">
                  <span>Swimming pool</span>
                  <span>Car park</span>
                  <span>Restaurant</span>
                  <span>Spa</span>
                  <span>Wi-Fi</span>
                  <span>Wheelchair accessible</span>
                </div>
              </div>
              <div className="border-t border-gray-200 p-4 md:border-l md:border-t-0">
                <h3 className="text-2xl font-semibold text-slate-900">Why book with us</h3>
                <p className="mt-4 text-sm leading-7 text-gray-600">
                  Central location, premium service and high-speed internet with business-friendly
                  facilities.
                </p>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-xl border border-gray-200 p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-gray-500">Check-in 2:00 PM | Check-out 12:00 PM</p>
            <p className="mt-2 text-sm text-primary">July 27, 2026 - July 29, 2026</p>
            <p className="mt-2 text-sm text-gray-500">2 nights</p>
            <p className="mt-1 text-sm text-primary">1 adult - 1 room</p>
          </aside>
        </div>

        <div id="rooms" className="mt-12">
          <h2 className="text-4xl font-bold text-slate-900">Rooms available</h2>
          <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
            <div className="flex flex-col md:flex-row">
              <div className="relative h-[220px] w-full shrink-0 md:h-[190px] md:w-[280px]">
                <img src={galleryImages[2]} alt="Room preview" className="h-full w-full object-cover" />
                <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
                  <HiOutlinePhotograph className="h-4 w-4" />
                  <span>1/6</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900">Superior Room, 1 King Size Bed</h3>
                  <p className="mt-2 text-sm text-gray-500">1 king size bed | 3 pax max | 32m²</p>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <a href="#room-details" className="text-sm font-medium text-primary hover:underline">
                    See the room details
                  </a>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">From</p>
                    <p className="text-3xl font-bold text-primary">$216.57</p>
                    <button className="mt-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white">
                      Choose this room
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HotelDetailsPage
