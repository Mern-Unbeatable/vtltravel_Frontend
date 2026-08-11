import { parseLocalDate } from './hotelSearchParams'

const toTime = (value) => {
  const date = parseLocalDate(value)
  return date ? date.getTime() : null
}

const rangesOverlap = (startA, endA, startB, endB) => {
  const aStart = toTime(startA)
  const aEnd = toTime(endA)
  const bStart = toTime(startB)
  const bEnd = toTime(endB)
  if (!aStart || !aEnd || !bStart || !bEnd) return false
  return aStart < bEnd && aEnd > bStart
}

const getRange = (item) => {
  if (!item) return null
  if (typeof item === 'string') return null
  return {
    start: item.checkIn || item.startDate || item.from || item.start,
    end: item.checkOut || item.endDate || item.to || item.end,
  }
}

export const isRoomBookedForStay = (room, stay) => {
  if (!room || !stay?.checkIn || !stay?.checkOut) return false

  if (room.isAvailable === false || room.available === false) return true
  if (room.isBooked === true || room.fullyBooked === true) return true

  const availableQty =
    room.availableQuantity ??
    room.quantityAvailable ??
    room.availableRooms ??
    room.roomsAvailable
  if (availableQty !== undefined && availableQty !== null && Number(availableQty) <= 0) {
    return true
  }

  const ranges = [
    ...(Array.isArray(room.unavailableDates) ? room.unavailableDates : []),
    ...(Array.isArray(room.bookedDates) ? room.bookedDates : []),
    ...(Array.isArray(room.bookings) ? room.bookings : []),
    ...(Array.isArray(room.blockedDates) ? room.blockedDates : []),
  ]

  return ranges.some((item) => {
    const range = getRange(item)
    if (!range?.start || !range?.end) return false
    const status = String(item?.status || '').toUpperCase()
    if (status && ['CANCELLED', 'CANCELED', 'FAILED', 'EXPIRED'].includes(status)) {
      return false
    }
    return rangesOverlap(stay.checkIn, stay.checkOut, range.start, range.end)
  })
}

export const ROOM_BOOKED_MESSAGE = 'This room is already booked for these dates.'
