import { useState, useRef, useEffect } from 'react'
import RoomCard from './RoomCard'
import HotelRoomsFilters from './HotelRoomsFilters'
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
  selectedRooms = [],
  onStaySearch,
  onSelectRoom,
  onCancelRoom,
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
    // Special rates is optional — search must work with or without it
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

  // Optional display filter only: when off, show every room; when on, prefer member deals
  const visibleRooms = hasSpecialRate
    ? rooms.filter((room) => room?.memberRate)
    : rooms

  // If "Special rates" is on but none exist, still fall back to all rooms so search results stay visible
  const roomsToShow =
    hasSpecialRate && visibleRooms.length === 0 ? rooms : visibleRooms

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

  const getDayState = (dayNum) => {
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

    return { disabled, dayStyle }
  }

  return (
    <div id="rooms" className="mt-10">
      <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Rooms available</h2>

      <HotelRoomsFilters
        datePickerRef={datePickerRef}
        guestsPickerRef={guestsPickerRef}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        showGuestsPicker={showGuestsPicker}
        setShowGuestsPicker={setShowGuestsPicker}
        checkInDateLabel={formatDateDisplay(checkInDate)}
        checkOutDateLabel={formatDateDisplay(checkOutDate)}
        activeDateTab={activeDateTab}
        setActiveDateTab={setActiveDateTab}
        monthLabel={`${MONTH_NAMES[month]} ${year}`}
        daysOfWeek={DAYS_OF_WEEK}
        firstDayIndex={firstDayIndex}
        totalDaysInMonth={totalDaysInMonth}
        getDayStyle={(dayNum) => getDayState(dayNum).dayStyle}
        isDayDisabled={(dayNum) => getDayState(dayNum).disabled}
        onSelectDay={handleSelectDay}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
        roomsCount={roomsCount}
        setRoomsCount={setRoomsCount}
        adultsCount={adultsCount}
        setAdultsCount={setAdultsCount}
        childrenCount={childrenCount}
        setChildrenCount={setChildrenCount}
        onSearchStay={handleSearchStay}
        canSearch={Boolean(checkInDate && checkOutDate)}
      />

      

      <div className="mt-6 space-y-5">
        {roomsToShow.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
            <p className="text-sm font-semibold text-gray-700">No rooms available</p>
          </div>
        ) : (
          roomsToShow.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              stay={{
                nights: getNightsBetween(stay?.checkIn, stay?.checkOut),
                adults: stay?.adults || adultsCount,
              }}
              selectedQuantity={
                selectedRooms.find((item) => item.id === room.id)?.quantity || 0
              }
              onSelectRoom={onSelectRoom}
              onCancelRoom={onCancelRoom}
              onOpenDetails={onOpenDetails}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default HotelRoomsSection
