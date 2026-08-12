import { useState, useRef, useEffect } from 'react'
import {
  IoCalendarOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoChevronBack,
  IoChevronForward,
  IoAdd,
  IoRemove,
  IoLocationOutline,
  IoBusinessOutline,
} from 'react-icons/io5'
import { useHotelSuggestions } from '../hooks/useHotels'

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
  const year = dateObj.getFullYear()
  return `${month} ${day}, ${year}`
}

const formatDateInput = (dateObj) => {
  if (!dateObj) return ''
  const yyyy = dateObj.getFullYear()
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0')
  const dd = String(dateObj.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const parseDateInput = (str) => {
  if (!str) return null
  const parts = str.split('-')
  if (parts.length === 3) {
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
  }
  const parsed = new Date(str)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const SearchCard = ({
  destination: initialDestination = '',
  initialSearchBy = 'location',
  initialCheckIn,
  initialCheckOut,
  initialRooms = 1,
  initialAdults = 1,
  initialChildren = 0,
  onSearch,
  buttonLabel = 'Search',
  wrapperClassName = '',
  compact = false,
  hideDestination = false,
}) => {
  // Helper to parse dates securely
  const parseDateProp = (dateVal) => {
    if (!dateVal) return null
    try {
      const d = new Date(dateVal)
      if (!Number.isNaN(d.getTime())) return d
    } catch (e) {}
    return null
  }

  // 1. Destination Input State
  const [destValue, setDestValue] = useState(initialDestination)
  const [searchBy, setSearchBy] = useState(initialSearchBy)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState('')

  // 2. Dates State
  const today = new Date()

  const [checkInDate, setCheckInDate] = useState(() => parseDateProp(initialCheckIn))
  const [checkOutDate, setCheckOutDate] = useState(() => parseDateProp(initialCheckOut))

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [activeDateTab, setActiveDateTab] = useState('checkIn')
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  )

  // 3. Guests State
  const [rooms, setRooms] = useState(Number(initialRooms))
  const [adults, setAdults] = useState(Number(initialAdults))
  const [childrenCount, setChildrenCount] = useState(Number(initialChildren))
  const [showGuestsPicker, setShowGuestsPicker] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(destValue.trim()), 300)
    return () => clearTimeout(timer)
  }, [destValue])

  const { data: suggestions, isFetching } = useHotelSuggestions(
    debouncedQuery,
    showSuggestions,
  )
  const isSuggestionsLoading = isFetching || destValue.trim() !== debouncedQuery
  const locationSuggestions = suggestions?.locations || []
  const hotelSuggestions = suggestions?.hotels || []
  const hasSuggestions = locationSuggestions.length > 0 || hotelSuggestions.length > 0

  // Sync state if props change (e.g. from routing)
  useEffect(() => {
    setDestValue(initialDestination || '');
  }, [initialDestination]);

  useEffect(() => {
    setSearchBy(initialSearchBy);
  }, [initialSearchBy]);

  useEffect(() => {
    setCheckInDate(parseDateProp(initialCheckIn))
  }, [initialCheckIn])

  useEffect(() => {
    setCheckOutDate(parseDateProp(initialCheckOut))
  }, [initialCheckOut])

  useEffect(() => {
    if (initialRooms) setRooms(Number(initialRooms));
  }, [initialRooms]);

  useEffect(() => {
    if (initialAdults) setAdults(Number(initialAdults));
  }, [initialAdults]);

  useEffect(() => {
    if (initialChildren !== undefined) setChildrenCount(Number(initialChildren));
  }, [initialChildren]);

  // Refs for click outside
  const datePickerRef = useRef(null)
  const guestsPickerRef = useRef(null)
  const destPickerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false)
      }
      if (guestsPickerRef.current && !guestsPickerRef.current.contains(event.target)) {
        setShowGuestsPicker(false)
      }
      if (destPickerRef.current && !destPickerRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  const handleSelectSuggestion = (suggestion) => {
    setDestValue(suggestion.value)
    setSearchBy(suggestion.type === 'hotel' ? 'hotel' : 'location')
    setShowSuggestions(false)
  }

  const handleSearchSubmit = () => {
    if (onSearch) {
      onSearch({
        destination: destValue.trim(),
        searchBy,
        checkIn: formatDateInput(checkInDate),
        checkOut: formatDateInput(checkOutDate),
        rooms,
        adults,
        children: childrenCount,
      })
    }
  }

  const formattedGuestsSummary = `${rooms} Room(s) - ${adults + childrenCount} Guest(s)`

  return (
    <div
      className={`relative mx-auto mt-6 rounded-2xl border border-gray-100 bg-white shadow-lg ${
        compact ? 'p-2.5 md:p-3' : 'p-3 md:p-4'
      } ${wrapperClassName}`}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-0">
        <div
          className={`flex flex-1 flex-col gap-3 sm:flex-row sm:items-center ${
            compact ? 'sm:gap-2' : 'sm:gap-4'
          }`}
        >
          {/* 1. Destination Input */}
          {!hideDestination && (
            <div ref={destPickerRef} className="relative flex-1">
              <div
                className={`flex items-center gap-3 rounded-xl border border-gray-200 bg-white transition hover:border-primary/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 ${
                  compact ? 'px-3 py-2' : 'px-4 py-2.5'
                }`}
              >
                <IoLocationOutline className="text-xl text-primary shrink-0" />
                <div className="min-w-0 flex-1">
                  <label htmlFor="destination-input" className="block text-[11px] font-medium text-gray-400">
                    Destination
                  </label>
                  <input
                    id="destination-input"
                    type="text"
                    autoComplete="off"
                    value={destValue}
                    onChange={(e) => {
                      setDestValue(e.target.value)
                      setSearchBy('location')
                      setShowSuggestions(true)
                      setShowDatePicker(false)
                      setShowGuestsPicker(false)
                    }}
                    onFocus={() => {
                      setShowSuggestions(true)
                      setShowDatePicker(false)
                      setShowGuestsPicker(false)
                    }}
                    onClick={() => {
                      setShowSuggestions(true)
                      setShowDatePicker(false)
                      setShowGuestsPicker(false)
                    }}
                    placeholder="Destination, hotel name"
                    className="w-full border-0 bg-transparent p-0 text-xs font-semibold text-gray-800 outline-none placeholder:font-normal placeholder:text-gray-400 md:text-sm"
                  />
                </div>
              </div>

              {showSuggestions && (
                <div className="absolute left-0 top-full z-[100] mt-2 max-h-[320px] w-full min-w-[260px] overflow-y-auto rounded-2xl border border-gray-100 bg-white py-2 shadow-2xl">
                  {isSuggestionsLoading && (
                    <p className="px-4 py-2 text-xs text-gray-400">
                      {destValue.trim() ? 'Searching destinations...' : 'Loading hotels...'}
                    </p>
                  )}

                  {!isSuggestionsLoading && !hasSuggestions && (
                    <p className="px-4 py-2 text-xs text-gray-400">No matching destinations found</p>
                  )}

                  {locationSuggestions.length > 0 && (
                    <div>
                      <p className="px-4 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Locations
                      </p>
                      {locationSuggestions.map((item) => (
                        <button
                          key={`loc-${item.label}`}
                          type="button"
                          onClick={() => handleSelectSuggestion(item)}
                          className="flex w-full items-start gap-3 px-4 py-2 text-left hover:bg-sky-50"
                        >
                          <IoLocationOutline className="mt-0.5 text-base text-primary shrink-0" />
                          <span className="min-w-0">
                            <span className="block text-xs font-semibold text-gray-800">{item.label}</span>
                            {item.subtitle && (
                              <span className="mt-0.5 block truncate text-[11px] text-gray-400">{item.subtitle}</span>
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {hotelSuggestions.length > 0 && (
                    <div>
                      <p className="px-4 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Hotels
                      </p>
                      {hotelSuggestions.map((item) => (
                        <button
                          key={`hotel-${item.label}`}
                          type="button"
                          onClick={() => handleSelectSuggestion(item)}
                          className="flex w-full items-start gap-3 px-4 py-2 text-left hover:bg-sky-50"
                        >
                          <IoBusinessOutline className="mt-0.5 text-base text-primary shrink-0" />
                          <span className="min-w-0">
                            <span className="block text-xs font-semibold text-gray-800">{item.label}</span>
                            {item.subtitle && (
                              <span className="mt-0.5 block truncate text-[11px] text-gray-400">{item.subtitle}</span>
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 2. Check in & Check out Date Picker Trigger */}
          <div ref={datePickerRef} className="relative flex-1">
            <div
              onClick={() => {
                setShowDatePicker((prev) => !prev)
                setShowGuestsPicker(false)
              }}
              className={`flex flex-1 cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white transition hover:border-primary/50 ${
                showDatePicker ? 'border-primary ring-2 ring-primary/20' : ''
              } ${compact ? 'px-3 py-2' : 'px-4 py-2.5'}`}
            >
              <div className="flex items-center gap-3">
                <IoCalendarOutline className="text-xl text-primary shrink-0" />
                <div>
                  <p className="text-[11px] font-medium text-gray-400">Check in</p>
                  <p className={`mt-0.5 text-xs font-semibold md:text-sm ${checkInDate ? 'text-gray-800' : 'text-gray-400'}`}>
                    {formatDateDisplay(checkInDate) || 'Add date'}
                  </p>
                </div>
              </div>

              <div className="h-6 w-px bg-gray-200" />

              <div className="text-right">
                <p className="text-[11px] font-medium text-gray-400">Check out</p>
                <p className={`mt-0.5 text-xs font-semibold md:text-sm ${checkOutDate ? 'text-gray-800' : 'text-gray-400'}`}>
                  {formatDateDisplay(checkOutDate) || 'Add date'}
                </p>
              </div>
            </div>

            {/* Date Picker Popover */}
            {showDatePicker && (
              <div className="absolute left-0 top-full z-[100] mt-2 w-full min-w-[320px] max-w-sm rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl md:min-w-[360px]">
                {/* Active Tab Toggle */}
                <div className="mb-3 flex items-center justify-between rounded-xl bg-gray-100 p-1">
                  <button
                    type="button"
                    onClick={() => setActiveDateTab('checkIn')}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                      activeDateTab === 'checkIn'
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Check-in: {formatDateDisplay(checkInDate) || 'Select'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveDateTab('checkOut')}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                      activeDateTab === 'checkOut'
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Check-out: {formatDateDisplay(checkOutDate) || 'Select'}
                  </button>
                </div>

                {/* Direct Manual Date Input */}
                <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <div className="flex-1">
                    <span className="block text-[10px] font-medium text-gray-400">Select Date Directly</span>
                    <input
                      type="date"
                      value={formatDateInput(activeDateTab === 'checkIn' ? checkInDate : checkOutDate)}
                      onChange={(e) => {
                        const parsed = parseDateInput(e.target.value)
                        if (activeDateTab === 'checkIn') {
                          setCheckInDate(parsed)
                        } else {
                          setCheckOutDate(parsed)
                        }
                      }}
                      className="mt-0.5 w-full rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-700 outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Month Controls */}
                <div className="mb-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={prevMonth}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
                  >
                    <IoChevronBack className="text-base" />
                  </button>
                  <span className="text-sm font-bold text-gray-800">
                    {MONTH_NAMES[month]} {year}
                  </span>
                  <button
                    type="button"
                    onClick={nextMonth}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
                  >
                    <IoChevronForward className="text-base" />
                  </button>
                </div>

                {/* Days of Week */}
                <div className="mb-2 grid grid-cols-7 text-center">
                  {DAYS_OF_WEEK.map((d) => (
                    <span key={d} className="text-[11px] font-semibold text-gray-400">
                      {d}
                    </span>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
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
                      dayStyle = 'bg-primary text-white font-bold rounded-lg shadow-sm'
                    } else if (inRange) {
                      dayStyle = 'bg-sky-100 text-primary font-semibold'
                    }

                    return (
                      <button
                        key={`day-${dayNum}`}
                        type="button"
                        disabled={disabled}
                        onClick={() => handleSelectDay(dayNum)}
                        className={`flex h-8 w-full items-center justify-center rounded-md text-xs font-medium transition ${dayStyle}`}
                      >
                        {dayNum}
                      </button>
                    )
                  })}
                </div>

                {/* Presets */}
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      const t1 = new Date()
                      t1.setDate(t1.getDate() + 1)
                      const t2 = new Date()
                      t2.setDate(t2.getDate() + 2)
                      setCheckInDate(t1)
                      setCheckOutDate(t2)
                      setShowDatePicker(false)
                    }}
                    className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-200"
                  >
                    Tomorrow
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const t1 = new Date()
                      t1.setDate(t1.getDate() + 7)
                      const t2 = new Date()
                      t2.setDate(t2.getDate() + 14)
                      setCheckInDate(t1)
                      setCheckOutDate(t2)
                      setShowDatePicker(false)
                    }}
                    className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-200"
                  >
                    Next Week
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowDatePicker(false)}
                    className="rounded-full bg-primary px-4 py-1 text-[11px] font-semibold text-white hover:bg-primary/90"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. Rooms and Guests Picker Trigger */}
          <div ref={guestsPickerRef} className="relative flex-1">
            <div
              onClick={() => {
                setShowGuestsPicker((prev) => !prev)
                setShowDatePicker(false)
              }}
              className={`flex flex-1 cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white transition hover:border-primary/50 ${
                showGuestsPicker ? 'border-primary ring-2 ring-primary/20' : ''
              } ${compact ? 'px-3 py-2' : 'px-4 py-2.5'}`}
            >
              <IoPersonOutline className="text-xl text-primary shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-gray-400">Rooms and Guests</p>
                <p className="mt-0.5 truncate text-xs font-semibold text-gray-800 md:text-sm">
                  {formattedGuestsSummary}
                </p>
              </div>
            </div>

            {/* Guests Popover */}
            {showGuestsPicker && (
              <div className="absolute right-0 top-full z-[100] mt-2 w-full min-w-[280px] max-w-xs rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl">
                <div className="space-y-4">
                  {/* Rooms Counter */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-800">Rooms</p>
                      <p className="text-[10px] text-gray-400">Number of rooms</p>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-gray-100 px-3 py-1.5">
                      <button
                        type="button"
                        onClick={() => setRooms((r) => Math.max(1, r - 1))}
                        disabled={rooms <= 1}
                        className="text-gray-600 disabled:opacity-40"
                      >
                        <IoRemove className="text-sm" />
                      </button>
                      <span className="text-xs font-bold text-primary">{rooms}</span>
                      <button
                        type="button"
                        onClick={() => setRooms((r) => r + 1)}
                        className="text-gray-600"
                      >
                        <IoAdd className="text-sm" />
                      </button>
                    </div>
                  </div>

                  {/* Adults Counter */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <div>
                      <p className="text-xs font-bold text-gray-800">Adults</p>
                      <p className="text-[10px] text-gray-400">12+ years</p>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-gray-100 px-3 py-1.5">
                      <button
                        type="button"
                        onClick={() => setAdults((a) => Math.max(1, a - 1))}
                        disabled={adults <= 1}
                        className="text-gray-600 disabled:opacity-40"
                      >
                        <IoRemove className="text-sm" />
                      </button>
                      <span className="text-xs font-bold text-primary">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults((a) => a + 1)}
                        className="text-gray-600"
                      >
                        <IoAdd className="text-sm" />
                      </button>
                    </div>
                  </div>

                  {/* Children Counter */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <div>
                      <p className="text-xs font-bold text-gray-800">Children</p>
                      <p className="text-[10px] text-gray-400">0 - 12 years</p>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-gray-100 px-3 py-1.5">
                      <button
                        type="button"
                        onClick={() => setChildrenCount((c) => Math.max(0, c - 1))}
                        disabled={childrenCount <= 0}
                        className="text-gray-600 disabled:opacity-40"
                      >
                        <IoRemove className="text-sm" />
                      </button>
                      <span className="text-xs font-bold text-primary">{childrenCount}</span>
                      <button
                        type="button"
                        onClick={() => setChildrenCount((c) => c + 1)}
                        className="text-gray-600"
                      >
                        <IoAdd className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-gray-100 pt-3 text-right">
                  <button
                    type="button"
                    onClick={() => setShowGuestsPicker(false)}
                    className="w-full rounded-xl bg-primary py-2 text-xs font-semibold text-white transition hover:bg-primary/90"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. Search Button */}
        <div
          className={`flex justify-end lg:ml-3 ${
            compact ? 'mt-2 lg:mt-0' : 'mt-3 lg:mt-0'
          }`}
        >
          <button
            type="button"
            onClick={handleSearchSubmit}
            className={`flex shrink-0 items-center justify-center gap-2 bg-primary font-semibold text-white shadow-md transition hover:bg-primary/90 active:scale-95 ${
              compact ? 'rounded-full px-8 py-2.5 text-xs' : 'rounded-xl px-7 py-3 text-sm'
            }`}
          >
            <IoSearchOutline className="text-lg" />
            <span>{buttonLabel}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchCard
