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
  'isFeatured',
  'sort',
  'page',
  'limit',
]

const STAR_SLUGS = {
  '5 ★': '5',
  '4 ★': '4',
  '3 ★': '3',
  '1 ★': '1',
  'Unclassified ★': 'unclassified',
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
  const stars = new Map()
  const prices = []

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

    const starValue = Number(hotel.starRating)
    if (Number.isFinite(starValue) && starValue > 0) {
      const starSlug = String(Math.round(starValue))
      incrementFacet(stars, starSlug, `${starSlug} ★`)
    } else {
      incrementFacet(stars, 'unclassified', 'Unclassified ★')
    }

    const price = Number(
      hotel.fromPrice ?? hotel.startingPrice ?? hotel.price ?? NaN,
    )
    if (Number.isFinite(price) && price >= 0) {
      prices.push(price)
    }
  })

  const byCount = (a, b) => b.count - a.count || a.name.localeCompare(b.name)

  return {
    bestFor: [...tags.values()].sort(byCount),
    accommodationStyles: [...styles.values()].sort(byCount),
    resortFeatures: [...facilities.values()].sort(byCount),
    starRatings: [...stars.values()].sort((a, b) => {
      if (a.slug === 'unclassified') return 1
      if (b.slug === 'unclassified') return -1
      return Number(b.slug) - Number(a.slug)
    }),
    priceRange:
      prices.length > 0
        ? {
            min: Math.floor(Math.min(...prices)),
            max: Math.ceil(Math.max(...prices)),
          }
        : { min: 0, max: 0 },
    featuredCount: hotels.filter((hotel) => hotel?.isFeatured === true).length,
  }
}

/** Keep full option list from catalog; apply current-search counts (0 if none). */
export const mergeFilterFacets = (catalog = {}, scoped = {}) => {
  const byCount = (a, b) => b.count - a.count || a.name.localeCompare(b.name)

  const mergeList = (allItems = [], scopedItems = []) => {
    const scopedMap = new Map(
      scopedItems.map((item) => [item.slug, Number(item.count) || 0]),
    )

    const merged = allItems.map((item) => ({
      name: item.name,
      slug: item.slug,
      count: scopedMap.has(item.slug) ? scopedMap.get(item.slug) : 0,
    }))

    scopedItems.forEach((item) => {
      if (!merged.some((row) => row.slug === item.slug)) {
        merged.push({
          name: item.name,
          slug: item.slug,
          count: Number(item.count) || 0,
        })
      }
    })

    return merged.sort(byCount)
  }

  const catalogPrice = catalog.priceRange || { min: 0, max: 0 }
  const scopedPrice = scoped.priceRange || { min: 0, max: 0 }
  const hasScopedPrice = scopedPrice.max > 0
  const hasCatalogPrice = catalogPrice.max > 0

  return {
    bestFor: mergeList(catalog.bestFor, scoped.bestFor),
    accommodationStyles: mergeList(
      catalog.accommodationStyles,
      scoped.accommodationStyles,
    ),
    resortFeatures: mergeList(catalog.resortFeatures, scoped.resortFeatures),
    starRatings: mergeList(catalog.starRatings, scoped.starRatings).sort(
      (a, b) => {
        if (a.slug === 'unclassified') return 1
        if (b.slug === 'unclassified') return -1
        return Number(b.slug) - Number(a.slug)
      },
    ),
    // Prefer current-search price bounds; fallback to catalog
    priceRange: hasScopedPrice
      ? scopedPrice
      : hasCatalogPrice
        ? catalogPrice
        : { min: 0, max: 0 },
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
    isFeatured: values.isFeatured,
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
    .map((star) => STAR_SLUGS[star] || star)
    .filter(Boolean)
    .filter((star) => star !== 'unclassified')

  return compactParams({
    minPrice: filters.minBudget,
    maxPrice: filters.maxBudget,
    starRating: starRating.join(','),
    tags: (filters.selectedTags || []).join(','),
    facilities: (filters.selectedFacilities || []).join(','),
    isFeatured: filters.isFeatured ? true : undefined,
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

const hotelSuggestionKey = (item) =>
  String(item?.id || item?.slug || item?.value || item?.label || '')
    .trim()
    .toLowerCase()

const getHotelMatchScore = (name, query) => {
  const label = String(name || '')
    .trim()
    .toLowerCase()
  const q = String(query || '')
    .trim()
    .toLowerCase()
  if (!q || !label) return 0
  if (label === q) return 3
  if (label.startsWith(q)) return 2
  if (label.includes(q)) return 1
  return 0
}

/** Rank matches first (exact → prefix → partial), then other hotels as recommendations. */
export const rankHotelSuggestions = (hotels = [], query = '', limit = 8) => {
  const q = query.trim()
  const seen = new Set()
  const unique = []

  hotels.forEach((hotel) => {
    const key = hotelSuggestionKey(hotel)
    if (!key || seen.has(key)) return
    seen.add(key)
    unique.push(hotel)
  })

  if (!q) return unique.slice(0, limit)

  const matches = []
  const recommendations = []

  unique.forEach((hotel) => {
    const score = getHotelMatchScore(hotel.label || hotel.value, q)
    if (score > 0) matches.push({ hotel, score })
    else recommendations.push(hotel)
  })

  matches.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return String(a.hotel.label || '').localeCompare(String(b.hotel.label || ''))
  })

  return [...matches.map((item) => item.hotel), ...recommendations].slice(0, limit)
}

/** Rank hotel list results: name/location matches first, then remaining hotels. */
export const rankHotelsForResults = (hotels = [], query = '') => {
  const q = String(query || '').trim()
  if (!q) return hotels

  const seen = new Set()
  const unique = []

  hotels.forEach((hotel) => {
    const key = String(hotel?.id || hotel?.slug || hotel?.name || '')
      .trim()
      .toLowerCase()
    if (!key || seen.has(key)) return
    seen.add(key)
    unique.push(hotel)
  })

  const matches = []
  const recommendations = []

  unique.forEach((hotel) => {
    const nameScore = getHotelMatchScore(hotel?.name, q)
    const locationHaystack = [hotel?.city, hotel?.location, hotel?.country, hotel?.address]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    const qLower = q.toLowerCase()
    let locationScore = 0
    if (locationHaystack === qLower) locationScore = 3
    else if (
      hotel?.city?.toLowerCase() === qLower ||
      hotel?.location?.toLowerCase() === qLower ||
      locationHaystack.startsWith(qLower)
    ) {
      locationScore = 2
    } else if (locationHaystack.includes(qLower)) {
      locationScore = 1
    }

    // Prefer name matches over location matches
    const score = nameScore > 0 ? nameScore + 10 : locationScore
    if (score > 0) matches.push({ hotel, score })
    else recommendations.push(hotel)
  })

  matches.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return String(a.hotel?.name || '').localeCompare(String(b.hotel?.name || ''))
  })

  return [...matches.map((item) => item.hotel), ...recommendations]
}

export const buildDestinationSuggestions = (items = [], query = '') => {
  const q = query.trim().toLowerCase()
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

    const locationMatches = !q || (locationLabel && locationHaystack.includes(q))
    if (locationLabel && locationMatches && !seenLocations.has(locationLabel.toLowerCase())) {
      seenLocations.add(locationLabel.toLowerCase())
      locations.push({
        type: 'location',
        value: city || hotel.location,
        label: locationLabel,
        subtitle: address,
      })
    }

    if (hotel.name) {
      hotels.push({
        type: 'hotel',
        value: hotel.name,
        label: hotel.name,
        subtitle: locationLabel || address,
        id: hotel.id,
        slug: hotel.slug,
      })
    }
  })

  return {
    locations: q ? locations.slice(0, 6) : locations,
    hotels: rankHotelSuggestions(hotels, query, q ? 8 : hotels.length),
  }
}
