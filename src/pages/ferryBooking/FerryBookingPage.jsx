import { useEffect, useState } from 'react'
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom'
import { IoPersonOutline } from 'react-icons/io5'
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

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const createEmptyPassenger = (type = 'adult') => ({
  type,
  passportNo: '',
  nationality: '',
  fullName: '',
  gender: 'Male',
  dobDay: '',
  dobMonth: '',
  dobYear: '',
  issuanceCountry: '',
  issueDay: '',
  issueMonth: '',
  issueYear: '',
  expDay: '',
  expMonth: '',
  expYear: '',
})

const buildPassengerSlots = (adultsCount, childrenCount) => {
  const adults = Math.max(1, Number(adultsCount) || 1)
  const children = Math.max(0, Number(childrenCount) || 0)
  return [
    ...Array.from({ length: adults }, () => createEmptyPassenger('adult')),
    ...Array.from({ length: children }, () => createEmptyPassenger('child')),
  ]
}

const resizePassengers = (prev, adultsCount, childrenCount) => {
  const nextSlots = buildPassengerSlots(adultsCount, childrenCount)
  return nextSlots.map((slot, index) => {
    const prevItem = prev[index]
    if (!prevItem) return slot
    return { ...prevItem, type: slot.type }
  })
}

const toIsoDate = (day, monthName, year) => {
  if (!day || !monthName || !year) return ''
  const monthIndex = MONTHS.indexOf(monthName) + 1
  if (monthIndex < 1) return ''
  return `${year}-${String(monthIndex).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

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

const DateSelectRow = ({ day, month, year, onDay, onMonth, onYear, dayOptions, yearOptions }) => (
  <div className="grid grid-cols-3 gap-2">
    <select
      value={day}
      onChange={(e) => onDay(e.target.value)}
      className="rounded-xl border border-gray-200 bg-gray-50/50 px-2 py-3 text-xs text-gray-600 outline-none cursor-pointer"
    >
      <option value="">Day</option>
      {dayOptions.map((d) => (
        <option key={d} value={d}>
          {d}
        </option>
      ))}
    </select>
    <select
      value={month}
      onChange={(e) => onMonth(e.target.value)}
      className="rounded-xl border border-gray-200 bg-gray-50/50 px-2 py-3 text-xs text-gray-600 outline-none cursor-pointer"
    >
      <option value="">Month</option>
      {MONTHS.map((m) => (
        <option key={m} value={m}>
          {m}
        </option>
      ))}
    </select>
    <select
      value={year}
      onChange={(e) => onYear(e.target.value)}
      className="rounded-xl border border-gray-200 bg-gray-50/50 px-2 py-3 text-xs text-gray-600 outline-none cursor-pointer"
    >
      <option value="">Year</option>
      {yearOptions.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
  </div>
)

const PassengerFormCard = ({
  index,
  passenger,
  onChange,
  days,
  years,
  expYears,
}) => {
  const labelType = passenger.type === 'child' ? 'CHILD' : 'ADULT'

  return (
    <div className="space-y-4 border-t border-gray-100 pt-6 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-2">
        <h3 className="text-base font-bold text-slate-900">Passenger {index + 1}</h3>
        <span className="rounded-full bg-[#3ea5dc] px-2.5 py-0.5 text-[10px] font-bold uppercase text-white">
          {labelType}
        </span>
      </div>

      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block font-semibold text-slate-700">
              Passport No. <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter number"
              value={passenger.passportNo}
              onChange={(e) => onChange(index, 'passportNo', e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-xs outline-none transition focus:border-[#3ea5dc] focus:bg-white"
            />
          </div>
          <div>
            <label className="mb-1 block font-semibold text-slate-700">
              Nationality <span className="text-red-500">*</span>
            </label>
            <select
              value={passenger.nationality}
              onChange={(e) => onChange(index, 'nationality', e.target.value)}
              className="w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-xs text-gray-600 outline-none focus:border-[#3ea5dc]"
            >
              <option value="">Select Nationality</option>
              <option value="Singapore">Singapore</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Vietnam">Vietnam</option>
              <option value="United States">United States</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block font-semibold text-slate-700">
            Name (As in Passport) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter full name"
            value={passenger.fullName}
            onChange={(e) => onChange(index, 'fullName', e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-xs outline-none transition focus:border-[#3ea5dc] focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block font-semibold text-slate-700">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <DateSelectRow
              day={passenger.dobDay}
              month={passenger.dobMonth}
              year={passenger.dobYear}
              onDay={(v) => onChange(index, 'dobDay', v)}
              onMonth={(v) => onChange(index, 'dobMonth', v)}
              onYear={(v) => onChange(index, 'dobYear', v)}
              dayOptions={days}
              yearOptions={years}
            />
          </div>
          <div>
            <label className="mb-1 block font-semibold text-slate-700">Gender</label>
            <div className="grid grid-cols-2 gap-2">
              {['Male', 'Female'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => onChange(index, 'gender', g)}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl py-3 text-xs font-semibold transition ${
                    passenger.gender === g
                      ? 'bg-[#3ea5dc] text-white shadow-sm'
                      : 'border border-gray-200 bg-gray-50/50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <IoPersonOutline className="text-sm" />
                  <span>{g}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block font-semibold text-slate-700">
            Issuance Country <span className="text-red-500">*</span>
          </label>
          <select
            value={passenger.issuanceCountry}
            onChange={(e) => onChange(index, 'issuanceCountry', e.target.value)}
            className="w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-xs text-gray-600 outline-none focus:border-[#3ea5dc]"
          >
            <option value="">Select Country</option>
            <option value="Singapore">Singapore</option>
            <option value="Indonesia">Indonesia</option>
            <option value="Malaysia">Malaysia</option>
            <option value="Vietnam">Vietnam</option>
            <option value="United States">United States</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block font-semibold text-slate-700">
              Passport Issuance Date <span className="text-red-500">*</span>
            </label>
            <DateSelectRow
              day={passenger.issueDay}
              month={passenger.issueMonth}
              year={passenger.issueYear}
              onDay={(v) => onChange(index, 'issueDay', v)}
              onMonth={(v) => onChange(index, 'issueMonth', v)}
              onYear={(v) => onChange(index, 'issueYear', v)}
              dayOptions={days}
              yearOptions={years}
            />
          </div>
          <div>
            <label className="mb-1 block font-semibold text-slate-700">
              Passport Expiry Date <span className="text-red-500">*</span>
            </label>
            <DateSelectRow
              day={passenger.expDay}
              month={passenger.expMonth}
              year={passenger.expYear}
              onDay={(v) => onChange(index, 'expDay', v)}
              onMonth={(v) => onChange(index, 'expMonth', v)}
              onYear={(v) => onChange(index, 'expYear', v)}
              dayOptions={days}
              yearOptions={expYears}
            />
          </div>
        </div>
      </div>
    </div>
  )
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

  const [agreed, setAgreed] = useState(true)
  const [contact, setContact] = useState({
    fullName: '',
    email: '',
    countryCode: 'SG +65',
    phone: '',
  })
  const [passengers, setPassengers] = useState(() =>
    buildPassengerSlots(
      state?.stay?.adults || getStoredHotelSearch()?.adults || 1,
      state?.stay?.children || getStoredHotelSearch()?.children || 0,
    ),
  )

  useEffect(() => {
    setPassengers((prev) => resizePassengers(prev, numAdults, numChildren))
  }, [numAdults, numChildren])

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

  const handleContactChange = (field, value) => {
    setContact((prev) => ({ ...prev, [field]: value }))
  }

  const handlePassengerChange = (index, field, value) => {
    setPassengers((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    )
  }

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))
  const years = Array.from({ length: 50 }, (_, i) => String(2026 - i))
  const expYears = Array.from({ length: 20 }, (_, i) => String(2026 + i))

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
    const guestName = contact.fullName.trim()
    const guestEmail = contact.email.trim()
    const guestPhone = contact.phone.trim()

    if (!hotelId) return { error: 'Hotel information is missing. Please go back and try again.' }
    if (roomsPayload.length === 0) {
      return { error: 'Please select a room before completing your booking.' }
    }
    if (!checkIn || !checkOut) return { error: 'Check-in and check-out dates are required.' }
    if (numNights < 1) return { error: 'Please choose a valid check-in and check-out date.' }
    if (!guestName) return { error: 'Please enter your full name.' }
    if (!guestEmail) return { error: 'Please enter your email address.' }
    if (!guestPhone) return { error: 'Please enter your phone number.' }
    if (!agreed) return { error: 'Please confirm that passenger details are accurate.' }

    const passengersPayload = []
    for (let i = 0; i < passengers.length; i += 1) {
      const p = passengers[i]
      const label = `Passenger ${i + 1}`
      const fullName = String(p.fullName || '').trim()
      const passportNo = String(p.passportNo || '').trim()
      const dateOfBirth = toIsoDate(p.dobDay, p.dobMonth, p.dobYear)
      const passportIssuanceDate = toIsoDate(p.issueDay, p.issueMonth, p.issueYear)
      const passportExpiryDate = toIsoDate(p.expDay, p.expMonth, p.expYear)

      if (!passportNo) return { error: `${label}: please enter the passport number.` }
      if (!p.nationality) return { error: `${label}: please select nationality.` }
      if (!fullName) return { error: `${label}: please enter the name as in the passport.` }
      if (!dateOfBirth) return { error: `${label}: please enter the date of birth.` }
      if (!p.issuanceCountry) return { error: `${label}: please select the issuance country.` }
      if (!passportIssuanceDate) {
        return { error: `${label}: please enter the passport issuance date.` }
      }
      if (!passportExpiryDate) {
        return { error: `${label}: please enter the passport expiry date.` }
      }

      passengersPayload.push({
        type: p.type === 'child' ? 'child' : 'adult',
        fullName,
        passportNo,
        nationality: p.nationality,
        dateOfBirth,
        gender: p.gender || 'Male',
        issuanceCountry: p.issuanceCountry,
        passportIssuanceDate,
        passportExpiryDate,
      })
    }

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
      guestPhoneCode: extractPhoneCode(contact.countryCode),
      guestPhone,
      rooms: roomsPayload,
      addOns: selectedAddOns
        .filter((item) => item?.addOnId)
        .map((item) => ({
          addOnId: item.addOnId,
          quantity: Number(item.quantity) || 1,
        })),
      ferrySkipped: Boolean(ferrySkipped),
      confirm: true,
      passengers: passengersPayload,
      notes: 'Checkout from Complete Your Ferry Booking form',
    }

    console.log('[FerryBooking] passengers array', passengersPayload)

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
            Follow the steps below to review your trip, enter passenger details, and confirm your
            ferry tickets.
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
                  <label className="mb-1 block font-semibold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={contact.fullName}
                    onChange={(e) => handleContactChange('fullName', e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-xs outline-none transition focus:border-[#3ea5dc] focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-semibold text-slate-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={contact.email}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-xs outline-none transition focus:border-[#3ea5dc] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-semibold text-slate-700">
                      Phone Number
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={contact.countryCode}
                        onChange={(e) => handleContactChange('countryCode', e.target.value)}
                        className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-3 text-xs font-medium text-gray-700 outline-none focus:border-[#3ea5dc]"
                      >
                        <option value="SG +65">SG +65</option>
                        <option value="ID +62">ID +62</option>
                        <option value="MY +60">MY +60</option>
                        <option value="US +1">US +1</option>
                      </select>
                      <input
                        type="tel"
                        placeholder="Enter phone number"
                        value={contact.phone}
                        onChange={(e) => handleContactChange('phone', e.target.value)}
                        className="w-full flex-1 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-xs outline-none transition focus:border-[#3ea5dc] focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-2xs">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Booking Passengers Details</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Enter details for all {passengers.length} passenger
                  {passengers.length !== 1 ? 's' : ''} ({numAdults} adult
                  {numAdults !== 1 ? 's' : ''}
                  {numChildren > 0
                    ? `, ${numChildren} child${numChildren !== 1 ? 'ren' : ''}`
                    : ''}
                  ). Incorrect or incomplete details may cause check-in or boarding issues.
                </p>
              </div>

              {passengers.map((passenger, index) => (
                <PassengerFormCard
                  key={`passenger-${index}-${passenger.type}`}
                  index={index}
                  passenger={passenger}
                  onChange={handlePassengerChange}
                  days={days}
                  years={years}
                  expYears={expYears}
                />
              ))}
            </div>

            <div className="flex items-start gap-3 pt-2 text-xs leading-relaxed text-gray-500 md:text-sm">
              <input
                type="checkbox"
                id="confirm"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded accent-[#3ea5dc]"
              />
              <label htmlFor="confirm" className="cursor-pointer">
                I confirm that all passenger data entered here is accurate and every passenger holds
                a valid travelling document (min 6 months from travel date), entry, exit visa(s) and
                other required documents. I have checked and verified the data of every passenger and
                understand and accept the consequences for failing to comply with the requirements.
                We will not seek compensation or refund from Batam Fast in these cases.
              </label>
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
