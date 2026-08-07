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
} from 'react-icons/io5'
import { HiOutlinePhotograph } from 'react-icons/hi'

const sampleGallery = [
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=80',
]

const RoomDetailsModal = ({ room, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Lock background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  if (!room) return null

  const images = room.image ? [room.image, ...sampleGallery] : sampleGallery

  const scrollSlide = (dir) => {
    if (dir === 'next') {
      setCurrentSlide((prev) => (prev + 1) % images.length)
    } else {
      setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs transition-opacity">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog Content - Hidden Scrollbar */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl z-10 space-y-6 text-slate-800 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Top Image Carousel */}
        <div className="relative h-[260px] sm:h-[320px] w-full overflow-hidden rounded-2xl bg-gray-100">
          <img
            src={images[currentSlide]}
            alt={room.name}
            className="h-full w-full object-cover transition-all duration-300"
          />

          {/* Close Button Inside Top-Right Corner of Image */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:bg-black/80 cursor-pointer shadow-md"
            aria-label="Close modal"
          >
            <IoClose className="text-xl" />
          </button>

          {/* Navigation Arrows */}
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

          {/* Photo Count Badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-xs">
            <HiOutlinePhotograph className="h-4 w-4" />
            <span>
              {currentSlide + 1}/{images.length}
            </span>
          </div>
        </div>

        {/* Title & Quick Info Header */}
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {room.name}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-gray-600">
            <div className="flex items-center gap-1.5">
              <IoBedOutline className="text-base text-[#3ea5dc]" />
              <span>{room.bedInfo || '1 Twin bed(s)'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <IoWaterOutline className="text-base text-[#3ea5dc]" />
              <span>Baths</span>
            </div>
            <div className="flex items-center gap-1.5">
              <IoStatsChartOutline className="text-base text-[#3ea5dc]" />
              <span>{room.size || '32m²'}</span>
            </div>
          </div>

          {/* Tag Badges */}
          <div className="mt-3 flex flex-wrap gap-2">
            {(room.tags || ['City View', 'Rainfall shower experience', 'High floor']).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-[#3ea5dc]"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="mt-4 text-xs leading-relaxed text-gray-500">
            Our 32m² contemporary Twin Beds room at Pullman Hanoi offers city views, a 42&quot; LED TV,
            free Wi-Fi, and a bathtub. Minibar available (charges apply). Ideal for Hanoi stays with
            friends.
          </p>

          <a
            href="#rates"
            onClick={onClose}
            className="mt-4 inline-block rounded-full bg-[#3ea5dc] px-6 py-2 text-xs font-semibold text-white transition hover:bg-[#3296cc]"
          >
            See the rates
          </a>
        </div>

        <div className="border-t border-gray-100 pt-4" />

        {/* Detailed Amenities 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-600">
          {/* Column 1 */}
          <div className="space-y-6">
            {/* Food and Beverage */}
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <IoRestaurantOutline className="text-[#3ea5dc]" />
                <h3>Food And Beverage</h3>
              </div>
              <div className="mt-2 space-y-1 pl-6 text-gray-500">
                <p className="font-semibold text-slate-700">Food And Beverage Facilities</p>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  <li>Bottled water</li>
                  <li>Coffee maker</li>
                  <li>Coffee/tea making facilities</li>
                  <li>Kettle</li>
                  <li>Mini-refrigerator</li>
                  <li>Free in Room Mineral Water</li>
                </ul>
              </div>
            </div>

            {/* Bathroom */}
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <IoWaterOutline className="text-[#3ea5dc]" />
                <h3>Bathroom</h3>
              </div>
              <div className="mt-2 space-y-1 pl-6 text-gray-500">
                <p className="font-semibold text-slate-700">Bathroom Facilities</p>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  <li>Bathroom doors 32 inches wide</li>
                  <li>Bathroom products</li>
                  <li>Hair dryer in bathroom</li>
                  <li>Make-up/magnifying mirror</li>
                  <li>Telephone in bathroom</li>
                  <li>Universal shaving plug</li>
                </ul>
              </div>
            </div>

            {/* Media And Technology */}
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <IoTvOutline className="text-[#3ea5dc]" />
                <h3>Media And Technology</h3>
              </div>
              <div className="mt-2 space-y-2 pl-6 text-gray-500">
                <div>
                  <p className="font-semibold text-slate-700">Complementary Elements</p>
                  <p className="text-[11px]">Radio</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-700">Internet Facilities</p>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                    <li>Data port in room</li>
                    <li>High speed internet</li>
                    <li>Wireless internet in your room</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-slate-700">Phone Facilities</p>
                  <p className="text-[11px]">Direct dial telephone</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-700">Tv Facilities</p>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                    <li>Children&apos;s TV Channels</li>
                    <li>Music TV channels</li>
                    <li>Satellite/cable colour TV</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            {/* Service And Equipment */}
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <IoShieldCheckmarkOutline className="text-[#3ea5dc]" />
                <h3>Service And Equipment</h3>
              </div>
              <div className="mt-2 space-y-3 pl-6 text-gray-500">
                <div>
                  <p className="font-semibold text-slate-700">Accessibility And Security</p>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                    <li>Alarm clock</li>
                    <li>Audible smoke alarms in rooms</li>
                    <li>Dead bolt in rooms</li>
                    <li>Emergency info in rooms</li>
                    <li>Keycard-operated door locks</li>
                    <li>Message alert</li>
                    <li>Room interior entrance only</li>
                    <li>Safe deposit box in room</li>
                    <li>Security Peephole</li>
                    <li>Self-closing rooms</li>
                    <li>Smoke alarm in room</li>
                    <li>Sprinkler in room</li>
                    <li>Visual alarm for hearing impaired</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-slate-700">Comfort Features</p>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                    <li>Blackout curtain</li>
                    <li>Blackout facilities</li>
                    <li>Brand Magazine</li>
                    <li>Hair dryer</li>
                    <li>Soundproof doors</li>
                    <li>Soundproof room</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-slate-700">Electric Facilities</p>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                    <li>220/240 V AC</li>
                    <li>Room Services</li>
                    <li>Automatic wake up call</li>
                    <li>Operator wake up call</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-slate-700">Temperature Air Control</p>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                    <li>Air Conditioning</li>
                    <li>Pulse Air</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-slate-700">Working Area</p>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                    <li>Adjustable desk lamp</li>
                    <li>Business Desk</li>
                    <li>Rolling seats</li>
                    <li>Safe large enough to accommodate a laptop</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomDetailsModal
