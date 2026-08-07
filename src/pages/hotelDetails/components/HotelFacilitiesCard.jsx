import {
  IoWaterOutline,
  IoCarOutline,
  IoRestaurantOutline,
  IoPawOutline,
  IoSparklesOutline,
  IoWifiOutline,
  IoAccessibilityOutline,
} from 'react-icons/io5'

const HotelFacilitiesCard = () => {
  return (
    <div className="mt-8 grid grid-cols-1 overflow-hidden rounded-2xl border border-sky-100/80 bg-[#f8fbfe] p-6 md:p-8 md:grid-cols-2 gap-6 md:gap-8">
      {/* Facilities */}
      <div>
        <h3 className="text-base font-bold text-slate-900">Most popular facilities</h3>
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-y-3.5 gap-x-2 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <IoWaterOutline className="text-base text-[#3ea5dc] shrink-0" />
            <span>Swimming pool</span>
          </div>
          <div className="flex items-center gap-2">
            <IoCarOutline className="text-base text-[#3ea5dc] shrink-0" />
            <span className="underline">Car park</span>
          </div>
          <div className="flex items-center gap-2">
            <IoRestaurantOutline className="text-base text-[#3ea5dc] shrink-0" />
            <span>Restaurant</span>
          </div>
          <div className="flex items-center gap-2">
            <IoPawOutline className="text-base text-[#3ea5dc] shrink-0" />
            <span>Pets not allowed</span>
          </div>
          <div className="flex items-center gap-2">
            <IoSparklesOutline className="text-base text-[#3ea5dc] shrink-0" />
            <span>Spa</span>
          </div>
          <div className="flex items-center gap-2">
            <IoWifiOutline className="text-base text-[#3ea5dc] shrink-0" />
            <span>Wi-Fi</span>
          </div>
          <div className="col-span-2 sm:col-span-3 flex items-center gap-2">
            <IoAccessibilityOutline className="text-base text-[#3ea5dc] shrink-0" />
            <span>Wheelchair accessible hotel</span>
            <span className="text-[#3ea5dc]">🚫</span>
          </div>
        </div>
        <a href="#services" className="mt-6 inline-block text-xs font-medium text-[#3ea5dc] hover:underline">
          See all services
        </a>
      </div>

      {/* Why book with us */}
      <div className="border-t border-sky-100/80 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
        <h3 className="text-base font-bold text-slate-900">Why book with us</h3>
        <div className="mt-4 space-y-3 text-xs leading-relaxed text-gray-500">
          <p>
            Step outside and immerse yourself into Hanoi&apos;s vibrant and bustling business district
          </p>
          <p>
            Workout in the Fit Lounge, offering modern equipment, and onsite brand new Pickleball court
          </p>
          <p>
            Seamless connection! Stay connected with free, high-speed Wi-Fi available throughout the hotel
          </p>
        </div>
      </div>
    </div>
  )
}

export default HotelFacilitiesCard
