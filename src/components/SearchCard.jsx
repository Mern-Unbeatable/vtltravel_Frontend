import {
  IoCalendarOutline,
  IoPersonOutline,
  IoSearchOutline,
} from 'react-icons/io5'

export default function SearchCard({
  destination = 'Destination, hotel name',
  checkIn = 'July 23',
  checkOut = 'July 24',
  guests = '1 Room - 1 adult',
  onSearch,
  buttonLabel = 'Search',
  wrapperClassName = '',
  valueOnly = false,
  compact = false,
}) {
  return (
    <div
      className={`mx-auto mt-6 rounded-2xl border border-gray-100 bg-white shadow-sm ${
        compact ? 'p-2.5 md:p-3' : 'p-3 md:p-4'
      } ${wrapperClassName}`}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-0">
        <div
          className={`flex flex-1 items-start gap-3 rounded-xl hover:bg-gray-50 lg:rounded-none ${
            compact ? 'px-2.5 py-2.5' : 'px-3 py-3'
          }`}
        >
          <IoSearchOutline className="mt-1 text-xl text-gray-400" />
          <div className="min-w-0 flex-1">
            {valueOnly ? (
              <p className="mt-0.5 w-full text-sm font-medium text-gray-800">
                {destination}
              </p>
            ) : (
              <>
                <p className="text-xs text-gray-400">Which hotel are you looking</p>
                <input
                  type="text"
                  defaultValue={destination}
                  className="mt-0.5 w-full border-0 bg-transparent p-0 text-sm font-medium text-gray-800 outline-none placeholder:text-gray-500"
                />
              </>
            )}
          </div>
        </div>

        <div className="hidden h-12 w-px bg-gray-200 lg:block" />

        <div
          className={`flex flex-1 items-start gap-3 rounded-xl hover:bg-gray-50 lg:rounded-none ${
            compact ? 'px-2.5 py-2.5' : 'px-3 py-3'
          }`}
        >
          <IoCalendarOutline className="mt-1 text-xl text-gray-400" />
          <div className="min-w-0 flex-1">
            {!valueOnly && <p className="text-xs text-gray-400">What are your dates?</p>}
            <p className={`${valueOnly ? 'mt-1' : 'mt-0.5'} text-sm font-medium text-gray-800`}>
              {checkIn} <span className="text-gray-400">→</span> {checkOut}
            </p>
          </div>
        </div>

        <div className="hidden h-12 w-px bg-gray-200 lg:block" />

        <div
          className={`flex flex-1 items-center gap-3 rounded-xl hover:bg-gray-50 lg:rounded-none ${
            compact ? 'px-2.5 py-2.5' : 'px-3 py-3'
          }`}
        >
          <IoPersonOutline className="text-xl text-gray-400" />
          <div className="min-w-0 flex-1">
            {!valueOnly && <p className="text-xs text-gray-400">Rooms & Guests</p>}
            <p className={`${valueOnly ? 'mt-1' : 'mt-0.5'} text-sm font-medium text-gray-800`}>
              {guests}
            </p>
          </div>
          <button
            type="button"
            onClick={onSearch}
            className={`shrink-0 bg-primary text-sm font-semibold text-white transition hover:opacity-90 ${
              compact ? 'rounded-full px-8 py-2.5' : 'rounded-xl px-6 py-3'
            }`}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

