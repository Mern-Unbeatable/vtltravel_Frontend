import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import {
  IoCalendarOutline,
  IoPersonOutline,
  IoChevronUp,
  IoChevronDown,
  IoChevronBack,
  IoChevronForward,
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
import { isRoomBookedForStay, ROOM_BOOKED_MESSAGE } from '../../../utils/roomAvailability'

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
  extraPrice = 0,
  selectedAddOns = [],
  onConfirmBooking = null,
  onStayChange = null,
  isSubmitting = false,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { hotelId } = useParams()
  const [showDetails, setShowDetails] = useState(true)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [activeDateTab, setActiveDateTab] = useState('checkIn')
  const [checkInDate, setCheckInDate] = useState(() => parseLocalDate(stay?.checkIn))
  const [checkOutDate, setCheckOutDate] = useState(() => parseLocalDate(stay?.checkOut))
  const today = new Date()
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  )
  const datePickerRef = useRef(null)

  useEffect(() => {
    setCheckInDate(parseLocalDate(stay?.checkIn))
    setCheckOutDate(parseLocalDate(stay?.checkOut))
  }, [stay?.checkIn, stay?.checkOut])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const title = hotel?.name || titleProp || ''
  const checkInTime = formatClockTime(hotel?.checkInTime)
  const checkOutTime = formatClockTime(hotel?.checkOutTime)
  const checkInLabel = formatStayDate(stay?.checkIn) || formatStayDate(checkInDate)
  const checkOutLabel = formatStayDate(stay?.checkOut) || formatStayDate(checkOutDate)
  const nights = getNightsBetween(
    stay?.checkIn || formatDateISO(checkInDate),
    stay?.checkOut || formatDateISO(checkOutDate),
  )
  const adults = Number(stay?.adults) || 1
  const rooms = Number(stay?.rooms) || 1
  const children = Number(stay?.children) || 0
  const targetId = hotel?.id || hotel?.slug || hotelId
  const isFerryPage = location.pathname.includes('/book-ferry')
  const isRoomBooked = isRoomBookedForStay(selectedRoom, stay)

  const applyStayDates = (nextCheckIn, nextCheckOut) => {
    if (!onStayChange || !nextCheckIn || !nextCheckOut) return
    onStayChange({
      checkIn: formatDateISO(nextCheckIn),
      checkOut: formatDateISO(nextCheckOut),
      adults,
      rooms,
      children,
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
          selectedRoom,
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
      state: { selectedRoom, title, stay, hotel },
    })
  }

  const stayDates = (
    <div className="mt-4 space-y-2">
      <div ref={datePickerRef} className="relative">
        <button
          type="button"
          onClick={() => {
            setShowDatePicker((prev) => !prev)
            setActiveDateTab(checkInDate ? 'checkOut' : 'checkIn')
          }}
          className={`flex w-full items-center gap-2 rounded-xl px-0 py-1 text-left text-[#3ea5dc] font-medium text-xs cursor-pointer transition ${
            showDatePicker ? 'text-[#3296cc]' : 'hover:opacity-80'
          }`}
        >
          <IoCalendarOutline className="text-sm shrink-0" />
          <span>
            {checkInLabel || 'Select check-in'}
            {` → ${checkOutLabel || 'Select check-out'}`}
          </span>
        </button>

        {showDatePicker ? (
          <div className="absolute left-0 top-full z-[120] mt-2 w-full min-w-[260px] rounded-2xl border border-gray-100 bg-white p-3 shadow-2xl">
            <div className="mb-3 flex items-center justify-between rounded-xl bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setActiveDateTab('checkIn')}
                className={`flex-1 rounded-lg py-1 text-[11px] font-semibold transition ${
                  activeDateTab === 'checkIn'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                In: {formatDateDisplay(checkInDate) || 'Select'}
              </button>
              <button
                type="button"
                onClick={() => setActiveDateTab('checkOut')}
                className={`flex-1 rounded-lg py-1 text-[11px] font-semibold transition ${
                  activeDateTab === 'checkOut'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Out: {formatDateDisplay(checkOutDate) || 'Select'}
              </button>
            </div>

            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentCalendarMonth(new Date(year, month - 1, 1))}
                className="flex h-7 w-7 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
              >
                <IoChevronBack className="text-sm" />
              </button>
              <span className="text-xs font-bold text-gray-800">
                {MONTH_NAMES[month]} {year}
              </span>
              <button
                type="button"
                onClick={() => setCurrentCalendarMonth(new Date(year, month + 1, 1))}
                className="flex h-7 w-7 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
              >
                <IoChevronForward className="text-sm" />
              </button>
            </div>

            <div className="mb-2 grid grid-cols-7 text-center">
              {DAYS_OF_WEEK.map((d) => (
                <span key={d} className="text-[10px] font-semibold text-gray-400">
                  {d}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
              {Array.from({ length: firstDayIndex }).map((_, idx) => (
                <div key={`empty-${idx}`} />
              ))}
              {Array.from({ length: totalDaysInMonth }).map((_, idx) => {
                const dayNum = idx + 1
                const currentDayDate = new Date(year, month, dayNum)
                const selectedIn = isSameDay(currentDayDate, checkInDate)
                const selectedOut = isSameDay(currentDayDate, checkOutDate)
                const inRange = isInRange(currentDayDate)
                const disabled = isPast(currentDayDate)

                let dayStyle = 'hover:bg-gray-100 text-gray-700'
                if (disabled) {
                  dayStyle = 'text-gray-300 pointer-events-none'
                } else if (selectedIn || selectedOut) {
                  dayStyle = 'bg-primary text-white font-bold rounded-md'
                } else if (inRange) {
                  dayStyle = 'bg-sky-100 text-primary font-semibold'
                }

                return (
                  <button
                    key={`day-${dayNum}`}
                    type="button"
                    disabled={disabled}
                    onClick={() => handleSelectDay(dayNum)}
                    className={`flex h-7 w-full items-center justify-center rounded-sm font-medium transition ${dayStyle}`}
                  >
                    {dayNum}
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>

      {nights > 0 ? (
        <p className="pl-6 text-[11px] text-gray-400">
          {nights} night{nights !== 1 ? 's' : ''}
        </p>
      ) : null}

      {isRoomBooked ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] font-semibold leading-relaxed text-rose-600">
          {ROOM_BOOKED_MESSAGE} Please choose different dates.
        </p>
      ) : null}

      <div className="mt-3 flex items-center gap-2 text-[#3ea5dc] font-medium text-xs">
        <IoPersonOutline className="text-sm shrink-0" />
        <span>
          {adults} adult{adults !== 1 ? 's' : ''}
          {children > 0 ? ` - ${children} child${children !== 1 ? 'ren' : ''}` : ''}
          {` - ${rooms} room${rooms !== 1 ? 's' : ''}`}
        </span>
      </div>
    </div>
  )
  if (!selectedRoom) {
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

  const roomData = selectedRoom
  const roomImage =
    roomData.image ||
    (typeof roomData.images?.[0] === 'string' ? roomData.images[0] : roomData.images?.[0]?.url) ||
    ''
  const basePriceNum = Number(roomData.priceNum ?? roomData.discountPrice ?? roomData.basePrice) || 0
  const taxesNum = Number(roomData.taxNum ?? roomData.taxPerNight) || 0
  const publicRateNum = Number(roomData.basePrice) || 0
  const savings = publicRateNum > basePriceNum ? publicRateNum - basePriceNum : 0
  const finalTotal = basePriceNum + taxesNum + extraPrice

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

      <div className="flex items-start gap-3">
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
            {basePriceNum ? (
              <span className="text-base font-bold text-[#3ea5dc] shrink-0">${basePriceNum}</span>
            ) : null}
          </div>
          {roomData.capacity ? (
            <p className="mt-1 text-[11px] text-gray-400">{roomData.capacity}</p>
          ) : null}
        </div>
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
          <div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-bold text-slate-900 leading-snug">{roomData.name}</span>
              {basePriceNum ? (
                <span className="text-xs font-bold text-slate-900 shrink-0">${basePriceNum}</span>
              ) : null}
            </div>
            {savings > 0 ? (
              <p className="mt-0.5 text-[11px] text-[#3ea5dc]">
                Included: ${savings.toFixed(2)} savings
              </p>
            ) : null}
          </div>

          {extraPrice > 0 ? (
            <div className="border-t border-gray-200/60 pt-2 flex items-center justify-between text-xs font-bold text-slate-900">
              <span>Extras (Add-ons)</span>
              <span>${extraPrice.toFixed(2)}</span>
            </div>
          ) : null}

          <div className="border-t border-gray-200/60 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900">
              <span>Total room</span>
              <span>${(basePriceNum + extraPrice).toFixed(2)}</span>
            </div>
          </div>
        </div>
      ) : null}

      {taxesNum > 0 ? (
        <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
          <span>Taxes</span>
          <span className="font-semibold text-gray-800">
            ${taxesNum.toFixed(2)}
          </span>
        </div>
      ) : null}

      <div className="mt-4 border-t border-gray-100 pt-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-sm font-bold text-slate-900">Total</span>
            <p className="text-[10px] text-gray-400">Fees and taxes included</p>
          </div>
          <div className="text-right">
            <span className="text-xl font-extrabold text-slate-900">${finalTotal.toFixed(2)}</span>
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
