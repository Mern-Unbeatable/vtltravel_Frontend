export const HOTEL_SEARCH_KEYS = [
  'location',
  'q',
  'checkIn',
  'checkOut',
  'adults',
  'rooms',
  'minPrice',
  'maxPrice',
  'starRating',
  'tags',
  'facilities',
  'breakfastIncluded',
  'freeCancellation',
  'sort',
  'page',
  'limit',
]

const STAR_SLUGS = {
  '5 ★': '5',
  '4 ★': '4',
  '3 ★': '3',
  '1 ★': '1',
}

const TAG_SLUGS = {
  'Family-Friendly Getaway': 'family-friendly',
  "Couple's Getaway": 'couples',
  'Honeymoon or Anniversary': 'honeymoon',
  'Romantic Escape': 'romantic',
  'Corporate Retreat': 'business',
  'Friends & Group Getaway': 'group',
  'Luxury Getaway': 'luxury',
  'Peaceful Nature Retreat': 'nature',
}

const FACILITY_SLUGS = {
  'Beachfront Resort': 'beachfront',
  'Private Beach Access': 'private-beach',
  'Swimming Pool': 'swimming-pool',
  "Kids' Club": 'kids-club',
  'Spa & Wellness Facilities': 'spa',
  'Watersport or Lagoon Access': 'watersports',
  'Complimentary Resort Activities': 'resort-activities',
  'Walking Distance to Lagoi Bay & Plaza': 'lagoi-bay',
}

const isEmpty = (value) =>
  value === '' || value === null || value === undefined || value === false

export const compactParams = (obj = {}) => {
  const params = {}
  HOTEL_SEARCH_KEYS.forEach((key) => {
    const value = obj[key]
    if (isEmpty(value)) return
    params[key] = String(value)
  })
  return params
}

export const buildHotelApiParams = (values = {}) => {
  const location = values.location || ''
  const q = values.q || ''

  return compactParams({
    location: location || undefined,
    q: q && q !== location ? q : !location ? q : undefined,
    checkIn: values.checkIn,
    checkOut: values.checkOut,
    adults: values.adults,
    rooms: values.rooms,
    minPrice: values.minPrice,
    maxPrice: values.maxPrice,
    starRating: Array.isArray(values.starRating)
      ? values.starRating.join(',')
      : values.starRating,
    tags: Array.isArray(values.tags) ? values.tags.join(',') : values.tags,
    facilities: Array.isArray(values.facilities)
      ? values.facilities.join(',')
      : values.facilities,
    breakfastIncluded: values.breakfastIncluded,
    freeCancellation: values.freeCancellation,
    sort: values.sort,
    page: values.page || 1,
    limit: values.limit || 12,
  })
}

export const buildSearchUrlFromCard = (searchData = {}) => {
  const destination = (searchData.destination || '').trim()
  const isHotel = searchData.searchBy === 'hotel'

  const params = compactParams({
    location: !isHotel && destination ? destination : undefined,
    q: isHotel && destination ? destination : undefined,
    checkIn: searchData.checkIn,
    checkOut: searchData.checkOut,
    adults: searchData.adults,
    rooms: searchData.rooms,
    page: 1,
    limit: 12,
  })

  if (searchData.children !== undefined && searchData.children !== null) {
    params.children = String(searchData.children)
  }

  return params
}

export const mapUiFiltersToApi = (filters) => {
  if (!filters) return {}

  const starRating = (filters.selectedStars || [])
    .map((star) => STAR_SLUGS[star])
    .filter(Boolean)

  const tags = []
  const facilities = []

  Object.entries(filters.selectedOptions || {}).forEach(([name, checked]) => {
    if (!checked) return
    if (TAG_SLUGS[name]) tags.push(TAG_SLUGS[name])
    if (FACILITY_SLUGS[name]) facilities.push(FACILITY_SLUGS[name])
  })

  return compactParams({
    minPrice: filters.minBudget,
    maxPrice: filters.maxBudget,
    starRating: starRating.join(','),
    tags: tags.join(','),
    facilities: facilities.join(','),
  })
}

export const getNightsBetween = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 1
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 1
  const nights = Math.round((end - start) / (1000 * 60 * 60 * 24))
  return nights > 0 ? nights : 1
}

export const buildDestinationSuggestions = (items = [], query = '') => {
  const q = query.trim().toLowerCase()
  if (!q) return { locations: [], hotels: [] }

  const locations = []
  const seenLocations = new Set()
  const hotels = []

  items.forEach((hotel) => {
    const city = hotel.city || hotel.location || ''
    const country = hotel.country || ''
    const address = hotel.address || ''
    const locationLabel = [city, country].filter(Boolean).join(', ')
    const locationHaystack = [city, hotel.location, country, address]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    if (
      locationLabel &&
      locationHaystack.includes(q) &&
      !seenLocations.has(locationLabel.toLowerCase())
    ) {
      seenLocations.add(locationLabel.toLowerCase())
      locations.push({
        type: 'location',
        value: city || hotel.location,
        label: locationLabel,
        subtitle: address,
      })
    }

    if (hotel.name && hotel.name.toLowerCase().includes(q)) {
      hotels.push({
        type: 'hotel',
        value: hotel.name,
        label: hotel.name,
        subtitle: locationLabel || address,
      })
    }
  })

  return {
    locations: locations.slice(0, 6),
    hotels: hotels.slice(0, 6),
  }
}
