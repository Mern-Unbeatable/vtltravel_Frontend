import { isRoomBookedForStay } from './roomAvailability'

export const normalizeSelectedRooms = (selectedRooms, selectedRoom = null) => {
  if (Array.isArray(selectedRooms) && selectedRooms.length > 0) {
    return selectedRooms
      .filter((room) => room?.id)
      .map((room) => ({
        ...room,
        quantity: Math.max(1, Number(room.quantity) || 1),
      }))
  }

  if (selectedRoom?.id) {
    return [
      {
        ...selectedRoom,
        quantity: Math.max(1, Number(selectedRoom.quantity) || 1),
      },
    ]
  }

  return []
}

export const getSelectedRoomsQuantity = (selectedRooms = []) =>
  selectedRooms.reduce((sum, room) => sum + (Number(room.quantity) || 0), 0)

export const buildRoomsPayload = (selectedRooms = []) =>
  selectedRooms
    .filter((room) => room?.id)
    .map((room) => ({
      roomTypeId: room.id,
      quantity: Math.max(1, Number(room.quantity) || 1),
    }))

export const getSelectedRoomsPricing = (selectedRooms = [], extraPrice = 0) => {
  const rooms = normalizeSelectedRooms(selectedRooms)
  let roomSubtotal = 0
  let taxAmount = 0
  let nightlyBase = 0
  let previewTotal = 0
  let hasPreview = false
  let breakdownText = ''
  let previewNights = 0

  rooms.forEach((room) => {
    const preview = room.pricePreview
    const pricePerNight =
      Number(preview?.pricePerNight ?? room.priceNum ?? room.discountPrice ?? room.basePrice) || 0

    if (preview && preview.roomSubtotal != null && preview.taxAmount != null && preview.totalPrice != null) {
      hasPreview = true
      roomSubtotal += Number(preview.roomSubtotal) || 0
      taxAmount += Number(preview.taxAmount) || 0
      previewTotal += Number(preview.totalPrice) || 0
      previewNights = Number(preview.nights) || previewNights
      if (!breakdownText && preview.breakdownText) breakdownText = preview.breakdownText
    } else {
      roomSubtotal += pricePerNight
    }

    nightlyBase += pricePerNight
  })

  const extra = Number(extraPrice || 0)
  const totalPrice = hasPreview ? previewTotal + extra : roomSubtotal + extra

  return {
    rooms,
    hasPreview,
    roomSubtotal,
    taxAmount: hasPreview ? taxAmount : 0,
    totalPrice,
    nightlyBase,
    breakdownText,
    previewNights,
    totalQuantity: getSelectedRoomsQuantity(rooms),
  }
}

export const isAnySelectedRoomBooked = (selectedRooms = [], stay = null) =>
  normalizeSelectedRooms(selectedRooms).some((room) => isRoomBookedForStay(room, stay))

export const upsertSelectedRoom = (prevRooms = [], room, maxRooms = 1) => {
  const current = normalizeSelectedRooms(prevRooms)
  const total = getSelectedRoomsQuantity(current)
  const existing = current.find((item) => item.id === room.id)

  if (existing) {
    if (total >= maxRooms) return { rooms: current, error: `You can select up to ${maxRooms} room${maxRooms !== 1 ? 's' : ''}.` }
    return {
      rooms: current.map((item) =>
        item.id === room.id
          ? { ...item, ...room, quantity: item.quantity + 1 }
          : item,
      ),
    }
  }

  if (total >= maxRooms) {
    if (maxRooms <= 1) {
      return { rooms: [{ ...room, quantity: 1 }] }
    }
    return { rooms: current, error: `You can select up to ${maxRooms} room${maxRooms !== 1 ? 's' : ''}.` }
  }

  return { rooms: [...current, { ...room, quantity: 1 }] }
}

export const updateSelectedRoomQuantity = (prevRooms = [], roomId, quantity) => {
  const nextQty = Number(quantity) || 0
  if (nextQty <= 0) {
    return normalizeSelectedRooms(prevRooms).filter((room) => room.id !== roomId)
  }
  return normalizeSelectedRooms(prevRooms).map((room) =>
    room.id === roomId ? { ...room, quantity: nextQty } : room,
  )
}
