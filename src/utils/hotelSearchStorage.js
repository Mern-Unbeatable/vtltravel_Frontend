import { formatDateISO } from './hotelSearchParams'

export const HOTEL_SEARCH_STORAGE_KEY = 'vtl_hotel_search'

export const getStoredHotelSearch = () => {
  try {
    const raw = localStorage.getItem(HOTEL_SEARCH_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return {
      checkIn: parsed.checkIn || '',
      checkOut: parsed.checkOut || '',
      adults: Number(parsed.adults) || 1,
      rooms: Number(parsed.rooms) || 1,
      children: Number(parsed.children) || 0,
      location: parsed.location || parsed.destination || '',
    }
  } catch {
    return null
  }
}

export const saveHotelSearch = (data = {}) => {
  const prev = getStoredHotelSearch() || {}
  const next = {
    checkIn: formatDateISO(data.checkIn) || data.checkIn || '',
    checkOut: formatDateISO(data.checkOut) || data.checkOut || '',
    adults: Number(data.adults ?? prev.adults) || 1,
    rooms: Number(data.rooms ?? prev.rooms) || 1,
    children: Number(data.children ?? prev.children) || 0,
    location: data.location || data.destination || prev.location || '',
  }

  localStorage.setItem(HOTEL_SEARCH_STORAGE_KEY, JSON.stringify(next))
  return next
}
