import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import {
  IoCalendarOutline,
  IoPersonOutline,
  IoChevronUp,
  IoChevronDown,
} from 'react-icons/io5'
import { toast } from 'react-toastify'
import FallbackImage from '../../../components/FallbackImage'
import {
  formatStayDate,
  formatClockTime,
  formatDateISO,
  getNightsBetween,
  parseLocalDate,
} from '../../../utils/hotelSearchParams'
import { ROOM_BOOKED_MESSAGE } from '../../../utils/roomAvailability'
import {
  normalizeSelectedRooms,
  getSelectedRoomsPricing,
  isAnySelectedRoomBooked,
} from '../../../utils/selectedRooms'
import { HotelSummarySidebarSkeleton } from '../../../components/skeletons/Skeleton'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const formatDateDisplay = (dateObj) => {
  if (!dateObj) return ''
  return `${MONTH_NAMES[dateObj.getMonth()].slice(0, 3)} ${dateObj.getDate()}`
}

const isSameDay = (d1, d2) => {
  if (!d1 || !d2) return false
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}
const HotelSummarySidebar = ({
  hotel,
  title: titleProp = '',
  stay = null,
  selectedRoom = null,
  selectedRooms: selectedRoomsProp = null,
  extraPrice = 0,
  selectedAddOns = [],
  onConfirmBooking = null,
  onStayChange = null,
  onRoomQuantityChange = null,
  isSubmitting = false,
  isLoading = false,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { hotelId } = useParams()
  const [showDetails, setShowDetails] = useState(true)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showGuestsPicker, setShowGuestsPicker] = useState(false)
  const [activeDateTab, setActiveDateTab] = useState('checkIn')
  const [checkInDate, setCheckInDate] = useState(() => parseLocalDate(stay?.checkIn))
  const [checkOutDate, setCheckOutDate] = useState(() => parseLocalDate(stay?.checkOut))
  const [adultsCount, setAdultsCount] = useState(() => Number(stay?.adults) || 1)
  const [roomsCount, setRoomsCount] = useState(() => Number(stay?.rooms) || 1)
  const [childrenCount, setChildrenCount] = useState(() => Number(stay?.children) || 0)
  const today = new Date()
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  )
  const datePickerRef = useRef(null)
  const guestsPickerRef = useRef(null)

  const selectedRooms = normalizeSelectedRooms(selectedRoomsProp, selectedRoom)
  const selectedRoomLegacy = selectedRooms[0] || null

  useEffect(() => {
    if (selectedRooms.length === 0) return
    const nextPricing = getSelectedRoomsPricing(selectedRooms, extraPrice)
    console.log('[HotelSummarySidebar] data sources', {
      fromBackend: {
        hotel: {
          id: hotel?.id,
          name: hotel?.name,
          checkInTime: hotel?.checkInTime,
          checkOutTime: hotel?.checkOutTime,
        },
        selectedRoomsRaw: selectedRooms.map((room) => ({
          id: room.id,
          name: room.name,
          basePrice: room.basePrice,
          discountPrice: room.discountPrice,
          taxPerNight: room.taxPerNight,
          pricePreview: room.pricePreview,
          image: room.image,
          quantity: room.quantity,
        })),
      },
      fromFrontend: {
        stay,
        nights: getNightsBetween(stay?.checkIn, stay?.checkOut),
        adults: Number(stay?.adults) || 1,
        rooms: Number(stay?.rooms) || 1,
        children: Number(stay?.children) || 0,
      },
      computedOnFrontend: {
        pricing: nextPricing,
        breakdownText: nextPricing.breakdownText,
      },
    })
  }, [hotel, stay, selectedRooms, extraPrice])

  useEffect(() => {
    setCheckInDate(parseLocalDate(stay?.checkIn))
    setCheckOutDate(parseLocalDate(stay?.checkOut))
    setAdultsCount(Number(stay?.adults) || 1)
    setRoomsCount(Number(stay?.rooms) || 1)
    setChildrenCount(Number(stay?.children) || 0)
  }, [stay?.checkIn, stay?.checkOut, stay?.adults, stay?.rooms, stay?.children])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false)
      }
      if (guestsPickerRef.current && !guestsPickerRef.current.contains(event.target)) {
        setShowGuestsPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (isLoading) {
    return <HotelSummarySidebarSkeleton />
  }

  const title = hotel?.name || titleProp || ''
  const checkInTime = formatClockTime(hotel?.checkInTime)
  const checkOutTime = formatClockTime(hotel?.checkOutTime)
  const checkInLabel = formatStayDate(stay?.checkIn) || formatStayDate(checkInDate)
  const checkOutLabel = formatStayDate(stay?.checkOut) || formatStayDate(checkOutDate)
  const nights = getNightsBetween(
    stay?.checkIn || formatDateISO(checkInDate),
    stay?.checkOut || formatDateISO(checkOutDate),
  )
  const adults = adultsCount
  const rooms = roomsCount
  const children = childrenCount
  const guestSummaryLabel = [
    `${adults} adult${adults !== 1 ? 's' : ''}`,
    children > 0 ? `${children} child${children !== 1 ? 'ren' : ''}` : null,
    `${rooms} room${rooms !== 1 ? 's' : ''}`,
  ]
    .filter(Boolean)
    .join(' · ')
  const targetId = hotel?.id || hotel?.slug || hotelId
  const isFerryPage = location.pathname.includes('/book-ferry')
  const isRoomBooked = isAnySelectedRoomBooked(selectedRooms, stay)
  const pricing = getSelectedRoomsPricing(selectedRooms, extraPrice)

  const applyStayChange = (overrides = {}) => {
    if (!onStayChange) return
    onStayChange({
      checkIn: formatDateISO(checkInDate) || stay?.checkIn || '',
      checkOut: formatDateISO(checkOutDate) || stay?.checkOut || '',
      adults: adultsCount,
      rooms: roomsCount,
      children: childrenCount,
      ...overrides,
    })
  }

  const applyStayDates = (nextCheckIn, nextCheckOut) => {
    applyStayChange({
      checkIn: formatDateISO(nextCheckIn),
      checkOut: formatDateISO(nextCheckOut),
    })
  }

  const updateGuests = (next) => {
    const adultsNext = Math.max(1, Number(next.adults ?? adultsCount) || 1)
    const roomsNext = Math.max(1, Number(next.rooms ?? roomsCount) || 1)
    const childrenNext = Math.max(0, Number(next.children ?? childrenCount) || 0)
    setAdultsCount(adultsNext)
    setRoomsCount(roomsNext)
    setChildrenCount(childrenNext)
    applyStayChange({
      adults: adultsNext,
      rooms: roomsNext,
      children: childrenNext,
    })
  }

  const year = currentCalendarMonth.getFullYear()
  const month = currentCalendarMonth.getMonth()
  const firstDayIndex = new Date(year, month, 1).getDay()
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate()

  const handleSelectDay = (dayNum) => {
    const selected = new Date(year, month, dayNum)

    if (activeDateTab === 'checkIn') {
      setCheckInDate(selected)
      if (checkOutDate && selected >= checkOutDate) {
        setCheckOutDate(null)
      }
      setActiveDateTab('checkOut')
      return
    }

    if (!checkInDate || selected > checkInDate) {
      setCheckOutDate(selected)
      applyStayDates(checkInDate, selected)
      setShowDatePicker(false)
      return
    }

    setCheckInDate(selected)
    setCheckOutDate(null)
    setActiveDateTab('checkOut')
  }

  const isInRange = (d) => {
    if (!checkInDate || !checkOutDate) return false
    return d > checkInDate && d < checkOutDate
  }

  const isPast = (d) => {
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return d < startOfToday
  }

  const goToNext = (ferrySkipped) => {
    if (isRoomBooked) {
      toast.error(ROOM_BOOKED_MESSAGE)
      return
    }
    if (isFerryPage) {
      if (onConfirmBooking) {
        onConfirmBooking({ ferrySkipped })
        return
      }
      toast.info('Please fill out the passenger details and complete the booking below.')
      return
    }
    if (location.pathname.includes('/customize')) {
      navigate(`/home/search/${targetId}/book-ferry`, {
        state: {
          selectedRooms,
          selectedRoom: selectedRoomLegacy,
          title,
          extraPrice,
          stay,
          hotel,
          selectedAddOns,
          ferrySkipped,
        },
      })
      return
    }
    navigate(`/home/search/${targetId}/customize`, {
      state: {
        selectedRooms,
        selectedRoom: selectedRoomLegacy,
        title,
        stay,
        hotel,
      },
    })
  }

  // Sidebar stay summary is read-only — date/guest pickers live in Rooms available section.
  const stayDates = (
    <div className="mt-4 space-y-2">
      <div className="flex w-full items-center gap-2 rounded-xl px-0 py-1 text-left text-xs font-medium text-[#3ea5dc]">
        <IoCalendarOutline className="shrink-0 text-sm" />
        <span>
          {checkInLabel || 'Select check-in'}
          {` → ${checkOutLabel || 'Select check-out'}`}
        </span>
      </div>

      {nights > 0 ? (
        <p className="pl-6 text-[11px] text-gray-400">
          {nights} night{nights !== 1 ? 's' : ''}
        </p>
      ) : null}

      {isRoomBooked ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] font-semibold leading-relaxed text-rose-600">
          {ROOM_BOOKED_MESSAGE}
        </p>
      ) : null}

      <div className="mt-3 flex w-full items-center gap-2 rounded-xl px-0 py-1 text-left text-xs font-medium text-[#3ea5dc]">
        <IoPersonOutline className="shrink-0 text-sm" />
        <span>{guestSummaryLabel}</span>
      </div>
    </div>
  )
  if (selectedRooms.length === 0) {
    return (
      <aside className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5 text-xs shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        {(checkInTime || checkOutTime) ? (
          <p className="mt-2.5 flex items-center gap-2 text-gray-500">
            <span className="text-gray-400">🔗</span>
            <span>
              {checkInTime ? `Check-in ${checkInTime}` : ''}
              {checkInTime && checkOutTime ? ' | ' : ''}
              {checkOutTime ? `Check-out ${checkOutTime}` : ''}
            </span>
          </p>
        ) : null}
        {stayDates}
      </aside>
    )
  }

  const {
    hasPreview,
    roomSubtotal: displayRoomSubtotal,
    taxAmount: displayTaxAmount,
    totalPrice,
  } = pricing

  return (
    <aside className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5 text-xs shadow-sm">
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      {(checkInTime || checkOutTime) ? (
        <p className="mt-2 flex items-center gap-1.5 text-gray-500">
          <span className="text-gray-400">🔗</span>
          <span>
            {checkInTime ? `Check-in ${checkInTime}` : ''}
            {checkInTime && checkOutTime ? ' | ' : ''}
            {checkOutTime ? `Check-out ${checkOutTime}` : ''}
          </span>
        </p>
      ) : null}

      {stayDates}

      <div className="my-4 border-t border-gray-100" />

      <div className="space-y-3">
        {selectedRooms.map((roomData) => {
          const roomImage =
            roomData.image ||
            (typeof roomData.images?.[0] === 'string'
              ? roomData.images[0]
              : roomData.images?.[0]?.url) ||
            ''
          const preview = roomData.pricePreview || null
          const pricePerNight =
            Number(
              preview?.pricePerNight ??
                roomData.priceNum ??
                roomData.discountPrice ??
                roomData.basePrice,
            ) || 0
          const lineSubtotal =
            preview?.roomSubtotal != null
              ? Number(preview.roomSubtotal)
              : pricePerNight

          return (
            <div key={roomData.id} className="flex items-start gap-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f3f4f6]">
                <FallbackImage
                  src={roomImage}
                  alt={roomData.name}
                  className="h-16 w-16 object-cover"
                  dummyClassName="h-16 w-16 object-contain p-2"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold leading-snug text-slate-900 line-clamp-2">
                    {roomData.name}
                  </h4>
                  {lineSubtotal ? (
                    <span className="text-sm font-bold text-[#3ea5dc] shrink-0">
                      ${Number(lineSubtotal).toFixed(0)}
                    </span>
                  ) : null}
                </div>
                {roomData.capacity ? (
                  <p className="mt-1 text-[11px] text-gray-400">{roomData.capacity}</p>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          className="flex items-center gap-1 text-xs font-medium text-[#3ea5dc] hover:underline"
        >
          <span>{showDetails ? 'Hide details' : 'Show details'}</span>
          {showDetails ? <IoChevronUp className="text-sm" /> : <IoChevronDown className="text-sm" />}
        </button>
      </div>

      {showDetails ? (
        <div className="mt-3 rounded-xl bg-[#f8fbfe] p-3.5 space-y-3">
          {selectedRooms.map((roomData) => {
            const preview = roomData.pricePreview || null
            const lineSubtotal =
              preview?.roomSubtotal != null
                ? Number(preview.roomSubtotal)
                : Number(roomData.priceNum ?? roomData.discountPrice ?? roomData.basePrice) || 0

            return (
              <div key={`detail-${roomData.id}`} className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 leading-snug">
                  {roomData.name}
                  {roomData.quantity > 1 ? ` × ${roomData.quantity}` : ''}
                </span>
                <span className="text-xs font-bold text-slate-900 shrink-0">
                  ${Number(lineSubtotal || 0).toFixed(2)}
                </span>
              </div>
            )
          })}

          {extraPrice > 0 ? (
            <div className="border-t border-gray-200/60 pt-2 flex items-center justify-between text-xs font-bold text-slate-900">
              <span>Extras (Add-ons)</span>
              <span>${extraPrice.toFixed(2)}</span>
            </div>
          ) : null}

          <div className="border-t border-gray-200/60 pt-2 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span>Room subtotal</span>
              <span className="font-semibold">${Number(displayRoomSubtotal || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      ) : null}

      {hasPreview ? (
        <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
          <span>Taxes</span>
          <span className="font-semibold text-gray-800">${Number(displayTaxAmount).toFixed(2)}</span>
        </div>
      ) : null}

      <div className="mt-4 border-t border-gray-100 pt-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-sm font-bold text-slate-900">Total</span>
            <p className="text-[10px] text-gray-400">Fees and taxes included</p>
          </div>
          <div className="text-right">
            <span className="text-xl font-extrabold text-slate-900">
              ${Number(totalPrice || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        <button
          type="button"
          onClick={() => goToNext(false)}
          disabled={isSubmitting || isRoomBooked}
          className="w-full rounded-full bg-[#3ea5dc] py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#3296cc] active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"        >
          {isFerryPage
            ? isSubmitting
              ? 'Confirming...'
              : 'Confirm booking'
            : 'Continue to ferry booking'}
        </button>
        <button
          type="button"
          onClick={() => goToNext(true)}
          disabled={isSubmitting || isRoomBooked}
          className="w-full rounded-full border border-[#3ea5dc] py-3 text-xs font-bold text-[#3ea5dc] transition hover:bg-sky-50 active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"        >
          {isFerryPage
            ? isSubmitting
              ? 'Confirming...'
              : 'Confirm without ferry'
            : 'Skip ferry booking'}
        </button>
      </div>
    </aside>
  )
}

export default HotelSummarySidebar
