import { useEffect, useState } from 'react'
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import HotelSummarySidebar from '../hotelDetails/components/HotelSummarySidebar'
import { useHotel } from '../../hooks/useHotels'
import { useCreateBooking } from '../../hooks/useBookings'
import { getStoredHotelSearch, saveHotelSearch } from '../../utils/hotelSearchStorage'
import { formatDateISO, getNightsBetween } from '../../utils/hotelSearchParams'
import { ROOM_BOOKED_MESSAGE } from '../../utils/roomAvailability'
import {
  normalizeSelectedRooms,
  buildRoomsPayload,
  getSelectedRoomsQuantity,
  updateSelectedRoomQuantity,
} from '../../utils/selectedRooms'

const NATIONALITIES = [
  'Singapore',
  'Indonesia',
  'Malaysia',
  'Vietnam',
  'United States',
  'Bangladesh',
  'India',
  'China',
  'Japan',
  'Australia',
  'United Kingdom',
  'Other',
]

const extractPhoneCode = (value) => {
  const match = String(value || '').match(/\+\d+/)
  return match ? match[0] : '+65'
}

const isAlreadyBookedError = (message = '') => {
  const text = String(message).toLowerCase()
  return (
    text.includes('already booked') ||
    text.includes('not available') ||
    text.includes('unavailable') ||
    text.includes('fully booked') ||
    (text.includes('dates') && text.includes('booked'))
  )
}

const getErrorMessage = (error) => {
  const message =
    typeof error === 'string'
      ? error
      : error?.message || error?.error || 'Failed to create booking.'

  if (isAlreadyBookedError(message)) {
    return ROOM_BOOKED_MESSAGE
  }

  return message
}

const buildStayParams = (stay) => {
  if (!stay?.checkIn || !stay?.checkOut) return {}
  return {
    checkIn: stay.checkIn,
    checkOut: stay.checkOut,
    adults: Number(stay.adults) || 1,
    rooms: Number(stay.rooms) || 1,
    children: Number(stay.children) || 0,
  }
}

const FerryBookingPage = () => {
  const { hotelId: hotelIdParam } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const [stay, setStay] = useState(() => state?.stay || getStoredHotelSearch())
  const [selectedRooms, setSelectedRooms] = useState(() =>
    normalizeSelectedRooms(state?.selectedRooms, state?.selectedRoom),
  )
  const stayParams = buildStayParams(stay)
  const { data: hotelData, isFetching } = useHotel(hotelIdParam, stayParams)
  const { mutateAsync: createBooking, isPending } = useCreateBooking()
  const maxRooms = Number(stay?.rooms) || 1

  const hotel = hotelData || state?.hotel || null
  const extraPrice = state?.extraPrice || 0
  const selectedAddOns = Array.isArray(state?.selectedAddOns) ? state.selectedAddOns : []
  const hotelTitle = hotel?.name || state?.title || ''

  const numAdults = Math.max(1, Number(stay?.adults) || 1)
  const numChildren = Math.max(0, Number(stay?.children) || 0)

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    countryCode: 'SG +65',
    phone: '',
    nationality: '',
    note: '',
  })

  useEffect(() => {
    if (!hotelData) return
    setSelectedRooms((prev) => {
      const normalized = normalizeSelectedRooms(prev)
      if (normalized.length === 0) return prev
      return normalized.map((selected) => {
        const updated = (hotelData.roomTypes || []).find((room) => room.id === selected.id)
        if (!updated) return selected
        return {
          ...selected,
          ...updated,
          quantity: selected.quantity,
          pricePreview: updated.pricePreview || null,
          priceNum: Number(updated.discountPrice || updated.basePrice) || selected.priceNum,
          taxNum: Number(updated.taxPerNight) || 0,
        }
      })
    })
  }, [hotelData])

  const handleStayChange = (nextStay) => {
    const saved = saveHotelSearch(nextStay)
    setStay(saved)
  }

  const handleRoomQuantityChange = (roomId, quantity) => {
    setSelectedRooms((prev) => {
      const currentTotal = getSelectedRoomsQuantity(prev)
      const currentRoom = prev.find((room) => room.id === roomId)
      const currentQty = Number(currentRoom?.quantity) || 0
      if (quantity > currentQty && currentTotal >= maxRooms) {
        toast.info(`You can select up to ${maxRooms} room${maxRooms !== 1 ? 's' : ''}.`)
        return prev
      }
      return updateSelectedRoomQuantity(prev, roomId, quantity)
    })
  }

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const buildPayload = (ferrySkipped) => {
    const hotelId = hotel?.id
    const roomsPayload = buildRoomsPayload(selectedRooms)
    const checkIn = formatDateISO(stay?.checkIn) || stay?.checkIn || ''
    const checkOut = formatDateISO(stay?.checkOut) || stay?.checkOut || ''
    const numRooms = getSelectedRoomsQuantity(selectedRooms) || Number(stay?.rooms) || 1
    const previewNights = selectedRooms
      .map((room) => Number(room?.pricePreview?.nights) || 0)
      .find((nights) => nights > 0)
    const numNights = previewNights || getNightsBetween(checkIn, checkOut)

    const guestName = form.fullName.trim()
    const guestEmail = form.email.trim()
    const guestPhone = form.phone.trim()
    const nationality = form.nationality.trim()
    const notes = form.note.trim()

    if (!hotelId) return { error: 'Hotel information is missing. Please go back and try again.' }
    if (roomsPayload.length === 0) {
      return { error: 'Please select a room before completing your booking.' }
    }
    if (!checkIn || !checkOut) return { error: 'Check-in and check-out dates are required.' }
    if (numNights < 1) return { error: 'Please choose a valid check-in and check-out date.' }
    if (!guestName) return { error: 'Please enter your full name as per passport.' }
    if (!guestEmail) return { error: 'Please enter your email address.' }
    if (!guestPhone) return { error: 'Please enter your phone number.' }
    if (!nationality) return { error: 'Please select your nationality.' }

    const payload = {
      hotelId,
      checkIn,
      checkOut,
      numAdults,
      numChildren,
      numRooms,
      numNights,
      guestName,
      guestEmail,
      guestPhoneCode: extractPhoneCode(form.countryCode),
      guestPhone,
      nationality,
      rooms: roomsPayload,
      addOns: selectedAddOns
        .filter((item) => item?.addOnId)
        .map((item) => ({
          addOnId: item.addOnId,
          quantity: Number(item.quantity) || 1,
        })),
      ferrySkipped: Boolean(ferrySkipped),
      confirm: true,
      passengers: [
        {
          type: 'adult',
          fullName: guestName,
          nationality,
        },
      ],
      notes: notes || 'Checkout from Complete Your Ferry Booking form',
    }

    return { payload }
  }

  const handleConfirmBooking = async ({ ferrySkipped } = {}) => {
    const skipped = ferrySkipped ?? state?.ferrySkipped ?? true
    const { payload, error } = buildPayload(skipped)

    if (error) {
      toast.error(error)
      return
    }

    try {
      const response = await createBooking(payload)
      const booking = response?.data || response
      const paymentUrl =
        booking?.paymentUrl || booking?.payment?.url || response?.paymentUrl

      if (!paymentUrl) {
        toast.error('Booking created but payment link is missing.')
        return
      }

      if (/^https?:\/\//i.test(paymentUrl)) {
        window.location.assign(paymentUrl)
        return
      }

      navigate(paymentUrl, { replace: true })
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24 pt-6 text-slate-800">
      <div className="mx-auto container px-4 md:px-6">
        <nav className="flex items-center gap-2 text-xs font-medium text-gray-400">
          <Link to="/" className="cursor-pointer transition hover:text-slate-900">
            Home
          </Link>
          <span>/</span>
          <button
            type="button"
            onClick={() => navigate(`/home/search`)}
            className="cursor-pointer border-0 bg-transparent p-0 font-medium text-gray-400 transition hover:text-slate-900"
          >
            Hotels
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="cursor-pointer border-0 bg-transparent p-0 font-medium text-gray-400 transition hover:text-slate-900"
          >
            Add-ons
          </button>
          <span>/</span>
          <span className="font-semibold text-[#3ea5dc]">Ferry Booking</span>
        </nav>

        <div className="mt-6">
          <span className="inline-block rounded-full border border-gray-300 bg-white px-4 py-1 text-xs font-medium text-gray-600 shadow-2xs">
            Ferry Booking Steps
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Complete Your Ferry Booking
          </h1>
          <p className="mt-2 max-w-2xl text-base text-gray-500">
            Please provide the details below to complete your booking.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault()
              handleConfirmBooking({ ferrySkipped: state?.ferrySkipped ?? true })
            }}
          >
            <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-2xs">
              <h2 className="text-xl font-bold text-slate-900">Booking Details</h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="mb-1 block font-semibold text-slate-700">
                    Full Name as per Passport <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name as per passport"
                    value={form.fullName}
                    onChange={(e) => handleFormChange('fullName', e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-xs outline-none transition focus:border-[#3ea5dc] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-semibold text-slate-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-xs outline-none transition focus:border-[#3ea5dc] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-semibold text-slate-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={form.countryCode}
                      onChange={(e) => handleFormChange('countryCode', e.target.value)}
                      className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-3 text-xs font-medium text-gray-700 outline-none focus:border-[#3ea5dc]"
                    >
                      <option value="SG +65">SG +65</option>
                      <option value="ID +62">ID +62</option>
                      <option value="MY +60">MY +60</option>
                      <option value="BD +880">BD +880</option>
                      <option value="US +1">US +1</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={form.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      className="w-full flex-1 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-xs outline-none transition focus:border-[#3ea5dc] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block font-semibold text-slate-700">
                    Nationality <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.nationality}
                    onChange={(e) => handleFormChange('nationality', e.target.value)}
                    className="w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-xs text-gray-600 outline-none focus:border-[#3ea5dc]"
                  >
                    <option value="">Select Nationality</option>
                    {NATIONALITIES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-semibold text-slate-700">Note</label>
                  <textarea
                    rows={4}
                    placeholder="Any special requests or notes (optional)"
                    value={form.note}
                    onChange={(e) => handleFormChange('note', e.target.value)}
                    className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-xs outline-none transition focus:border-[#3ea5dc] focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </form>

          <div>
            <HotelSummarySidebar
              hotel={hotel}
              title={hotelTitle}
              stay={stay}
              selectedRooms={selectedRooms}
              onRoomQuantityChange={handleRoomQuantityChange}
              extraPrice={extraPrice}
              selectedAddOns={selectedAddOns}
              onConfirmBooking={handleConfirmBooking}
              onStayChange={handleStayChange}
              isSubmitting={isPending}
              isLoading={isFetching}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FerryBookingPage
