import {
  IoWaterOutline,
  IoCarOutline,
  IoRestaurantOutline,
  IoPawOutline,
  IoSparklesOutline,
  IoWifiOutline,
  IoAccessibilityOutline,
  IoCheckmarkCircleOutline,
} from 'react-icons/io5'

const facilityIcons = {
  'Free Wi-Fi': <IoWifiOutline className="text-base text-[#3ea5dc] shrink-0" />,
  'Wi-Fi': <IoWifiOutline className="text-base text-[#3ea5dc] shrink-0" />,
  'Swimming Pool': <IoWaterOutline className="text-base text-[#3ea5dc] shrink-0" />,
  'Giant Swimming Pools': <IoWaterOutline className="text-base text-[#3ea5dc] shrink-0" />,
  'Restaurant': <IoRestaurantOutline className="text-base text-[#3ea5dc] shrink-0" />,
  'Spa': <IoSparklesOutline className="text-base text-[#3ea5dc] shrink-0" />,
  'Free Parking': <IoCarOutline className="text-base text-[#3ea5dc] shrink-0" />,
}

const HotelFacilitiesCard = ({ facilities = [] }) => {
  const displayFacilities = facilities.length > 0 ? facilities : ['Free Wi-Fi', 'Swimming pool', 'Restaurant', 'Spa', 'Free Parking']

  return (
    <div className="mt-8 grid grid-cols-1 overflow-hidden rounded-2xl border border-sky-100/80 bg-[#f8fbfe] p-6 md:p-8 md:grid-cols-2 gap-6 md:gap-8">
      {/* Facilities */}
      <div>
        <h3 className="text-base font-bold text-slate-900">Most popular facilities</h3>
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-y-3.5 gap-x-2 text-xs text-gray-600">
          {displayFacilities.map((fac, idx) => {
            const facName = typeof fac === 'string' 
              ? fac 
              : (fac?.facility?.name || fac?.name || 'Facility');
            return (
              <div key={idx} className="flex items-center gap-2">
                {facilityIcons[facName] || <IoCheckmarkCircleOutline className="text-base text-[#3ea5dc] shrink-0" />}
                <span>{facName}</span>
              </div>
            );
          })}
        </div>
      </div>


      {/* Why book with us */}
      <div className="border-t border-sky-100/80 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
        <h3 className="text-base font-bold text-slate-900">Why book with us</h3>
        <div className="mt-4 space-y-3 text-xs leading-relaxed text-gray-500">
          <p>
            Step outside and immerse yourself into the vibrant and bustling surroundings.
          </p>
          <p>
            Workout in the Fitness Lounge, offering modern equipment and clean facilities.
          </p>
          <p>
            Seamless connection! Stay connected with free, high-speed Wi-Fi available throughout the hotel.
          </p>
        </div>
      </div>
    </div>
  )
}

export default HotelFacilitiesCard

