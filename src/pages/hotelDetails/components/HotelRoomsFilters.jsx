import {
  IoCalendarOutline,
  IoPersonOutline,
  IoChevronBack,
  IoChevronForward,
  IoAdd,
  IoRemove,
} from 'react-icons/io5'

const HotelRoomsFilters = ({
  datePickerRef,
  guestsPickerRef,
  showDatePicker,
  setShowDatePicker,
  showGuestsPicker,
  setShowGuestsPicker,
  checkInDateLabel,
  checkOutDateLabel,
  activeDateTab,
  setActiveDateTab,
  monthLabel,
  daysOfWeek,
  firstDayIndex,
  totalDaysInMonth,
  getDayStyle,
  isDayDisabled,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
  roomsCount,
  setRoomsCount,
  adultsCount,
  setAdultsCount,
  childrenCount,
  setChildrenCount,
  onSearchStay,
  canSearch,
}) => {
  return (
    <div className="relative z-40 mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 text-xs font-medium text-gray-700 shadow-sm">
      <div ref={datePickerRef} className="relative">
        <div
          onClick={() => {
            setShowDatePicker((prev) => !prev)
            setShowGuestsPicker(false)
          }}
          className={`flex cursor-pointer items-center gap-2 rounded-xl border bg-gray-50 px-3 py-2 transition-all ${
            showDatePicker ? 'border-primary bg-white ring-2 ring-primary/20' : 'border-gray-200'
          }`}
        >
          <IoCalendarOutline className="text-base text-[#3ea5dc]" />
          <span className="font-semibold text-gray-800">
            {checkInDateLabel || 'Select'} → {checkOutDateLabel || 'Select'}
          </span>
        </div>

        {showDatePicker && (
          <div className="absolute left-0 top-full z-[200] mt-2 w-[min(100vw-2rem,22rem)] max-w-[calc(100vw-2rem)] rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl sm:w-80 md:w-88">
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
                In: {checkInDateLabel || 'Select'}
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
                Out: {checkOutDateLabel || 'Select'}
              </button>
            </div>

            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={onPrevMonth}
                className="flex h-7 w-7 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
              >
                <IoChevronBack className="text-sm" />
              </button>
              <span className="text-xs font-bold text-gray-800">{monthLabel}</span>
              <button
                type="button"
                onClick={onNextMonth}
                className="flex h-7 w-7 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
              >
                <IoChevronForward className="text-sm" />
              </button>
            </div>

            <div className="mb-2 grid grid-cols-7 text-center">
              {daysOfWeek.map((d) => (
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
                return (
                  <button
                    key={`day-${dayNum}`}
                    type="button"
                    disabled={isDayDisabled(dayNum)}
                    onClick={() => onSelectDay(dayNum)}
                    className={`flex h-7 w-full items-center justify-center rounded-sm font-medium transition ${getDayStyle(
                      dayNum,
                    )}`}
                  >
                    {dayNum}
                  </button>
                )
              })}
            </div>

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

      <div ref={guestsPickerRef} className="relative">
        <div
          onClick={() => {
            setShowGuestsPicker((prev) => !prev)
            setShowDatePicker(false)
          }}
          className={`flex cursor-pointer items-center gap-2 rounded-xl border bg-gray-50 px-3 py-2 transition-all ${
            showGuestsPicker ? 'border-primary bg-white ring-2 ring-primary/20' : 'border-gray-200'
          }`}
        >
          <IoPersonOutline className="text-base text-[#3ea5dc]" />
          <span className="font-semibold text-gray-800">
            {roomsCount} Room{roomsCount > 1 ? 's' : ''} - {adultsCount + childrenCount} Guest
            {adultsCount + childrenCount > 1 ? 's' : ''}
          </span>
        </div>

        {showGuestsPicker && (
          <div className="absolute left-0 top-full z-[200] mt-2 w-60 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-gray-800">Rooms</p>
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

              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <p className="text-xs font-bold text-gray-800">Adults</p>
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

              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <p className="text-xs font-bold text-gray-800">Children</p>
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

      <button
        type="button"
        onClick={onSearchStay}
        disabled={!canSearch}
        className={`ml-auto rounded-full px-6 py-2 font-semibold text-white transition ${
          canSearch
            ? 'cursor-pointer bg-[#3ea5dc] hover:bg-[#3296cc] active:scale-95'
            : 'cursor-not-allowed bg-[#A3A6C5]'
        }`}
      >
        Search
      </button>
    </div>
  )
}

export default HotelRoomsFilters
