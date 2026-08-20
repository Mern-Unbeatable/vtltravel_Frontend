/**
 * Dummy extras for search hotel cards until the API sends matching fields.
 * Backend values always win when they are present.
 */
export const HOTEL_CARD_DUMMY = {
  locationLabel: 'Bintan',
  guestRating: 4.6,
  ratingLabel: 'Excellent',
  reviewCount: 128,
  starRating: 4,
  amenities: [
    { name: 'Private Beach', slug: 'private-beach' },
    { name: 'Pool', slug: 'pool' },
    { name: 'Family Friendly', slug: 'family-friendly' },
    { name: 'Spa', slug: 'spa' },
    { name: 'Breakfast', slug: 'breakfast' },
  ],
  bestFor: ['Couples', 'Families', 'Relaxing getaway'],
  badges: [
    { label: 'Beachfront Resort', tone: 'blue' },
    { label: 'Family Favourite', tone: 'green' },
  ],
  publicRate: 150,
}

const hasValue = (value) => {
  if (value === null || value === undefined || value === '') return false
  if (Array.isArray(value) && value.length === 0) return false
  return true
}

const toNumber = (value) => {
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

const toText = (value) => {
  if (value == null || value === '') return ''
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  if (typeof value !== 'object') return String(value).trim()
  return toText(
    value.name ||
      value.label ||
      value.facility?.name ||
      value.tag?.name ||
      value.tag?.slug ||
      value.slug ||
      '',
  )
}

const toNameList = (items) => {
  if (!hasValue(items)) return []
  const list = Array.isArray(items) ? items : [items]
  return list.map(toText).filter(Boolean)
}

export const getHotelCardDisplay = (hotel) => {
  const locationLabel =
    hotel?.city || hotel?.location || hotel?.island || HOTEL_CARD_DUMMY.locationLabel

  const starRating =
    toNumber(hotel?.starRating) || HOTEL_CARD_DUMMY.starRating

  const rawGuestRating =
    toNumber(hotel?.guestRating) ??
    toNumber(hotel?.rating) ??
    toNumber(hotel?.reviewScore)
  const guestRating = (() => {
    if (rawGuestRating == null) return HOTEL_CARD_DUMMY.guestRating
    // Existing hotel details uses reviewScore /10; card UI is /5
    if (rawGuestRating > 5) return Number((rawGuestRating / 2).toFixed(1))
    return rawGuestRating
  })()

  const reviewCount =
    toNumber(hotel?.reviewCount) ??
    toNumber(hotel?.reviewsCount) ??
    HOTEL_CARD_DUMMY.reviewCount

  const ratingLabel = hotel?.ratingLabel || HOTEL_CARD_DUMMY.ratingLabel

  const amenityNames = toNameList(
    hotel?.cardAmenities || hotel?.popularFacilities || hotel?.facilities,
  )
  const amenities =
    amenityNames.length > 0
      ? amenityNames.slice(0, 5).map((name) => ({
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
        }))
      : HOTEL_CARD_DUMMY.amenities

  const bestForNames = toNameList(hotel?.bestFor || hotel?.tags)
  const bestFor =
    bestForNames.length > 0 ? bestForNames.slice(0, 3) : HOTEL_CARD_DUMMY.bestFor

  const backendBadges = toNameList(hotel?.badges || hotel?.highlights)
  const badges =
    backendBadges.length > 0
      ? backendBadges.slice(0, 2).map((label, index) => ({
          label,
          tone: index === 0 ? 'blue' : 'green',
        }))
      : hotel?.accommodationStyle
        ? [
            {
              label: String(hotel.accommodationStyle)
                .replace(/_/g, ' ')
                .toLowerCase()
                .replace(/\b\w/g, (char) => char.toUpperCase()),
              tone: 'blue',
            },
            HOTEL_CARD_DUMMY.badges[1],
          ]
        : HOTEL_CARD_DUMMY.badges

  const fromPrice = hotel?.fromPrice ?? hotel?.startingPrice ?? hotel?.price
  const publicRate =
    hotel?.publicRate ??
    hotel?.roomTypes?.[0]?.basePrice ??
    (hasValue(fromPrice) ? fromPrice : HOTEL_CARD_DUMMY.publicRate)

  return {
    locationLabel,
    starRating,
    guestRating,
    ratingLabel,
    reviewCount,
    amenities,
    bestFor,
    badges,
    fromPrice,
    publicRate,
  }
}
