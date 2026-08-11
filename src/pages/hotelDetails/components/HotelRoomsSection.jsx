import { useState, useRef, useEffect } from 'react'
import {
  IoCalendarOutline,
  IoPersonOutline,
  IoCheckmarkOutline,
  IoChevronBack,
  IoChevronForward,
  IoAdd,
  IoRemove,
} from 'react-icons/io5'
import RoomCard from './RoomCard'
import { formatDateISO, getNightsBetween, parseLocalDate } from '../../../utils/hotelSearchParams'

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const formatDateDisplay = (dateObj) => {
  if (!dateObj) return ''
  const month = MONTH_NAMES[dateObj.getMonth()].slice(0, 3)
  const day = dateObj.getDate()
  return `${month} ${day}`
}

const HotelRoomsSection = ({
  rooms = [],
  initialCheckIn,
  initialCheckOut,
  initialRooms = 1,
  initialAdults = 1,
  initialChildren = 0,
  stay = null,
  onStaySearch,
  onSelectRoom,
  onOpenDetails,
}) => {
  const today = new Date()
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const [checkInDate, setCheckInDate] = useState(
    parseLocalDate(initialCheckIn) || startOfToday,
  )
  const [checkOutDate, setCheckOutDate] = useState(parseLocalDate(initialCheckOut))
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [activeDateTab, setActiveDateTab] = useState('checkIn')
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  )

  const [roomsCount, setRoomsCount] = useState(Number(initialRooms) || 1)
  const [adultsCount, setAdultsCount] = useState(Number(initialAdults) || 1)
  const [childrenCount, setChildrenCount] = useState(Number(initialChildren) || 0)
  const [showGuestsPicker, setShowGuestsPicker] = useState(false)
  const [hasSpecialRate, setHasSpecialRate] = useState(false)

  // Refs for click outside
  const datePickerRef = useRef(null)
  const guestsPickerRef = useRef(null)

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

  useEffect(() => {
    const nextIn = parseLocalDate(stay?.checkIn)
    const nextOut = parseLocalDate(stay?.checkOut)
    if (nextIn) setCheckInDate(nextIn)
    if (stay?.checkOut === '') {
      setCheckOutDate(null)
    } else if (nextOut) {
      setCheckOutDate(nextOut)
    }
    if (stay?.adults) setAdultsCount(Number(stay.adults) || 1)
    if (stay?.rooms) setRoomsCount(Number(stay.rooms) || 1)
    if (stay?.children !== undefined && stay?.children !== null) {
      setChildrenCount(Number(stay.children) || 0)
    }
  }, [stay?.checkIn, stay?.checkOut, stay?.adults, stay?.rooms, stay?.children])

  // Calendar math
  const year = currentCalendarMonth.getFullYear()
  const month = currentCalendarMonth.getMonth()
  const firstDayIndex = new Date(year, month, 1).getDay()
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => {
    setCurrentCalendarMonth(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentCalendarMonth(new Date(year, month + 1, 1))
  }

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
      setShowDatePicker(false)
      return
    }

    setCheckInDate(selected)
    setCheckOutDate(null)
    setActiveDateTab('checkOut')
  }

  const handleSearchStay = () => {
    if (!checkInDate || !checkOutDate) return
    if (onStaySearch) {
      onStaySearch({
        checkIn: formatDateISO(checkInDate),
        checkOut: formatDateISO(checkOutDate),
        adults: adultsCount,
        rooms: roomsCount,
        children: childrenCount,
      })
    }
  }

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    )
  }

  const isInRange = (d) => {
    if (!checkInDate || !checkOutDate) return false
    return d > checkInDate && d < checkOutDate
  }

  const isPast = (d) => {
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return d < startOfToday
  }

  return (
    <div id="rooms" className="mt-10">
      <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Rooms available</h2>

      {/* Quick Filter Bar */}
      <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm text-xs font-medium text-gray-700">
        
        {/* Date Selector Trigger Box */}
        <div ref={datePickerRef} className="relative">
          <div
            onClick={() => {
              setShowDatePicker((prev) => !prev)
              setShowGuestsPicker(false)
            }}
            className={`flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 border transition-all cursor-pointer ${
              showDatePicker ? 'border-primary bg-white ring-2 ring-primary/20' : 'border-gray-200'
            }`}
          >
            <IoCalendarOutline className="text-[#3ea5dc] text-base" />
            <span className="font-semibold text-gray-800">
              {formatDateDisplay(checkInDate) || 'Select'} → {formatDateDisplay(checkOutDate) || 'Select'}
            </span>
          </div>

          {/* Date Picker Popover */}
          {showDatePicker && (
            <div className="absolute left-0 top-full z-[100] mt-2 w-[320px] rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl md:w-[350px]">
              {/* Active Tab Toggle */}
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

              {/* Month Controls */}
              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
                >
                  <IoChevronBack className="text-sm" />
                </button>
                <span className="text-xs font-bold text-gray-800">
                  {MONTH_NAMES[month]} {year}
                </span>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
                >
                  <IoChevronForward className="text-sm" />
                </button>
              </div>

              {/* Days of Week */}
              <div className="mb-2 grid grid-cols-7 text-center">
                {DAYS_OF_WEEK.map((d) => (
                  <span key={d} className="text-[10px] font-semibold text-gray-400">
                    {d}
                  </span>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
                {Array.from({ length: firstDayIndex }).map((_, idx) => (
                  <div key={`empty-${idx}`} />
                ))}

                {Array.from({ length: totalDaysInMonth }).map((_, idx) => {
                  const dayNum = idx + 1
                  const currentDayDate = new Date(year, month, dayNum)
                  const isCheckIn = isSameDay(currentDayDate, checkInDate)
                  const isCheckOut = isSameDay(currentDayDate, checkOutDate)
                  const inRange = isInRange(currentDayDate)
                  const disabled = isPast(currentDayDate)

                  let dayStyle = 'hover:bg-gray-100 text-gray-700'
                  if (disabled) {
                    dayStyle = 'text-gray-300 pointer-events-none'
                  } else if (isCheckIn || isCheckOut) {
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

              {/* Done Button */}
              <div className="mt-3 text-right">
                <button
                  type="button"
                  onClick={() => setShowDatePicker(false)}
                  className="rounded-lg bg-primary px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-primary/90"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Guest Selector Trigger Box */}
        <div ref={guestsPickerRef} className="relative">
          <div
            onClick={() => {
              setShowGuestsPicker((prev) => !prev)
              setShowDatePicker(false)
            }}
            className={`flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 border transition-all cursor-pointer ${
              showGuestsPicker ? 'border-primary bg-white ring-2 ring-primary/20' : 'border-gray-200'
            }`}
          >
            <IoPersonOutline className="text-[#3ea5dc] text-base" />
            <span className="font-semibold text-gray-800">
              {roomsCount} Room{roomsCount > 1 ? 's' : ''} - {adultsCount + childrenCount} Guest{adultsCount + childrenCount > 1 ? 's' : ''}
            </span>
          </div>

          {/* Guest Picker Popover */}
          {showGuestsPicker && (
            <div className="absolute left-0 top-full z-[100] mt-2 w-[240px] rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl">
              <div className="space-y-4">
                
                {/* Rooms Counter */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-800">Rooms</p>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-gray-100 px-2 py-1">
                    <button
                      type="button"
                      onClick={() => setRoomsCount((r) => Math.max(1, r - 1))}
                      disabled={roomsCount <= 1}
                      className="text-gray-600 disabled:opacity-40"
                    >
                      <IoRemove className="text-xs" />
                    </button>
                    <span className="text-xs font-bold text-primary">{roomsCount}</span>
                    <button
                      type="button"
                      onClick={() => setRoomsCount((r) => r + 1)}
                      className="text-gray-600"
                    >
                      <IoAdd className="text-xs" />
                    </button>
                  </div>
                </div>

                {/* Adults Counter */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div>
                    <p className="text-xs font-bold text-gray-800">Adults</p>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-gray-100 px-2 py-1">
                    <button
                      type="button"
                      onClick={() => setAdultsCount((a) => Math.max(1, a - 1))}
                      disabled={adultsCount <= 1}
                      className="text-gray-600 disabled:opacity-40"
                    >
                      <IoRemove className="text-xs" />
                    </button>
                    <span className="text-xs font-bold text-primary">{adultsCount}</span>
                    <button
                      type="button"
                      onClick={() => setAdultsCount((a) => a + 1)}
                      className="text-gray-600"
                    >
                      <IoAdd className="text-xs" />
                    </button>
                  </div>
                </div>

                {/* Children Counter */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div>
                    <p className="text-xs font-bold text-gray-800">Children</p>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-gray-100 px-2 py-1">
                    <button
                      type="button"
                      onClick={() => setChildrenCount((c) => Math.max(0, c - 1))}
                      disabled={childrenCount <= 0}
                      className="text-gray-600 disabled:opacity-40"
                    >
                      <IoRemove className="text-xs" />
                    </button>
                    <span className="text-xs font-bold text-primary">{childrenCount}</span>
                    <button
                      type="button"
                      onClick={() => setChildrenCount((c) => c + 1)}
                      className="text-gray-600"
                    >
                      <IoAdd className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Done Button */}
              <div className="mt-4 border-t border-gray-100 pt-3 text-right">
                <button
                  type="button"
                  onClick={() => setShowGuestsPicker(false)}
                  className="w-full rounded-lg bg-primary py-1.5 text-[11px] font-semibold text-white transition hover:bg-primary/90"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Special Rates Toggle */}
        <button
          type="button"
          onClick={() => setHasSpecialRate(!hasSpecialRate)}
          className={`flex items-center gap-2 rounded-xl px-3 py-2 border transition-all cursor-pointer ${
            hasSpecialRate
              ? 'bg-sky-50 border-sky-200 text-sky-700 font-semibold'
              : 'bg-gray-50 border-gray-200 text-gray-500'
          }`}
        >
          <IoCheckmarkOutline className={hasSpecialRate ? 'text-[#3ea5dc] text-base font-bold' : 'text-gray-400 text-base'} />
          <span>Special rates</span>
        </button>

        {/* Search Button */}
        <button
          type="button"
          onClick={handleSearchStay}
          disabled={!checkInDate || !checkOutDate}
          className={`ml-auto rounded-full px-6 py-2 font-semibold text-white transition ${
            checkInDate && checkOutDate
              ? 'bg-[#3ea5dc] hover:bg-[#3296cc] cursor-pointer active:scale-95'
              : 'bg-[#A3A6C5] cursor-not-allowed'
          }`}
        >
          Search
        </button>
      </div>

      

      <div className="mt-6 space-y-5">
        {rooms.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
            <p className="text-sm font-semibold text-gray-700">No rooms available</p>
          </div>
        ) : (
          rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              stay={{
                nights: getNightsBetween(stay?.checkIn, stay?.checkOut),
                adults: stay?.adults || adultsCount,
              }}
              onSelectRoom={onSelectRoom}
              onOpenDetails={onOpenDetails}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default HotelRoomsSection
