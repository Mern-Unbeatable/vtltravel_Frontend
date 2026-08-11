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

const formatAccommodationStyle = (style) => {
  if (!style) return ''
  return style
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

const incrementFacet = (map, slug, name) => {
  const existing = map.get(slug) || { name, slug, count: 0 }
  existing.count += 1
  map.set(slug, existing)
}

export const buildFilterFacets = (hotels = []) => {
  const tags = new Map()
  const styles = new Map()
  const facilities = new Map()

  hotels.forEach((hotel) => {
    ;(hotel.tags || []).forEach((item) => {
      const tag = item?.tag || item
      if (!tag?.slug) return
      if (tag.category && tag.category !== 'best_for') return
      incrementFacet(tags, tag.slug, tag.name || tag.slug)
    })

    if (hotel.accommodationStyle) {
      incrementFacet(
        styles,
        hotel.accommodationStyle,
        formatAccommodationStyle(hotel.accommodationStyle),
      )
    }

    ;(hotel.facilities || []).forEach((item) => {
      const facility = item?.facility || item
      if (!facility?.slug) return
      incrementFacet(facilities, facility.slug, facility.name || facility.slug)
    })
  })

  const byCount = (a, b) => b.count - a.count || a.name.localeCompare(b.name)

  return {
    bestFor: [...tags.values()].sort(byCount),
    accommodationStyles: [...styles.values()].sort(byCount),
    resortFeatures: [...facilities.values()].sort(byCount),
  }
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

  return compactParams({
    minPrice: filters.minBudget,
    maxPrice: filters.maxBudget,
    starRating: starRating.join(','),
    tags: (filters.selectedTags || []).join(','),
    facilities: (filters.selectedFacilities || []).join(','),
  })
}

export const parseLocalDate = (value) => {
  if (!value) return null
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value
  const str = String(value)
  const parts = str.split('-')
  if (parts.length === 3 && parts[0].length === 4) {
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
    return Number.isNaN(date.getTime()) ? null : date
  }
  const date = new Date(str)
  return Number.isNaN(date.getTime()) ? null : date
}

export const formatDateISO = (dateObj) => {
  if (!dateObj) return ''
  const date = parseLocalDate(dateObj)
  if (!date) return ''
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export const formatStayDate = (value) => {
  const date = parseLocalDate(value)
  if (!date) return ''
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export const formatClockTime = (time) => {
  if (!time) return ''
  const [hourStr, minuteStr = '00'] = String(time).split(':')
  const hour = Number(hourStr)
  if (Number.isNaN(hour)) return time
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${String(minuteStr).padStart(2, '0')} ${period}`
}

export const getNightsBetween = (checkIn, checkOut) => {
  const start = parseLocalDate(checkIn)
  const end = parseLocalDate(checkOut)
  if (!start || !end) return 0
  const nights = Math.round((end - start) / (1000 * 60 * 60 * 24))
  return nights > 0 ? nights : 0
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
