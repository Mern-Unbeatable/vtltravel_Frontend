import {
  IoWaterOutline,
  IoCarOutline,
  IoRestaurantOutline,
  IoPawOutline,
  IoSparklesOutline,
  IoWifiOutline,
  IoAccessibilityOutline,
  IoCheckmarkCircleOutline,
  IoWineOutline,
} from 'react-icons/io5'

const facilityIcons = {
  wifi: IoWifiOutline,
  'swimming-pool': IoWaterOutline,
  pool: IoWaterOutline,
  restaurant: IoRestaurantOutline,
  spa: IoSparklesOutline,
  'car-park': IoCarOutline,
  parking: IoCarOutline,
  'pets-allowed': IoPawOutline,
  'wheelchair-accessible': IoAccessibilityOutline,
  accessible: IoAccessibilityOutline,
  bar: IoWineOutline,
}

const getFacilityMeta = (item) => {
  if (typeof item === 'string') {
    return { name: item, slug: item.toLowerCase().replace(/\s+/g, '-') }
  }
  const facility = item?.facility || item
  return {
    name: facility?.name || '',
    slug: facility?.slug || '',
    isPopular: item?.isPopular,
  }
}

const HotelFacilitiesCard = ({ facilities = [], highlights = [], whyBookWithUs = [] }) => {
  const mapped = facilities.map(getFacilityMeta).filter((item) => item.name)
  const popular = mapped.filter((item) => item.isPopular)
  const displayFacilities = popular.length > 0 ? popular : mapped

  let displayHighlights = (highlights || [])
    .map((item) => {
      if (typeof item === 'string') return item
      return item?.name || item?.tag?.name || item?.facility?.name || item?.slug || ''
    })
    .filter(Boolean)

  if (displayHighlights.length === 0) {
    displayHighlights = [
      "Family friendly resort in Sekupang",
      "Beachfront property with direct beach access",
      "Perfect for couples and family getaways",
    ]
  }

  if (displayFacilities.length === 0 && displayHighlights.length === 0 && whyBookWithUs.length === 0) {
    return null
  }

  return (
    <div className="mt-4 grid grid-cols-1 overflow-hidden rounded-2xl border border-sky-100/80 bg-[#f8fbfe] p-6 md:p-8 md:grid-cols-2 gap-6 md:gap-8">
      {displayFacilities.length > 0 ? (
        <div>
          <h3 className="text-base font-bold text-slate-900">Most popular facilities</h3>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-y-3.5 gap-x-2 text-xs text-gray-600">
            {displayFacilities.map((fac) => {
              const Icon = facilityIcons[fac.slug] || IoCheckmarkCircleOutline
              return (
                <div key={fac.slug || fac.name} className="flex items-center gap-2">
                  <Icon className="text-base text-[#3ea5dc] shrink-0" />
                  <span>{fac.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}

      {displayHighlights.length > 0 ? (
        <div className="border-t border-sky-100/80 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
          <h3 className="text-base font-bold text-slate-900">Hotel Highlights</h3>
          <div className="mt-4 space-y-3 text-xs leading-relaxed text-gray-500">
            {displayHighlights.map((item, idx) => (
              <p key={idx} className="flex items-start gap-2">
                <span className="text-[#3ea5dc] font-extrabold shrink-0">•</span>
                <span>{item}</span>
              </p>
            ))}
          </div>
        </div>
      ) : whyBookWithUs.length > 0 ? (
        <div className="border-t border-sky-100/80 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
          <h3 className="text-base font-bold text-slate-900">Why book with us</h3>
          <div className="mt-4 space-y-3 text-xs leading-relaxed text-gray-500">
            {whyBookWithUs.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default HotelFacilitiesCard
