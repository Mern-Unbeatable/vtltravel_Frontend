import {
  IoCalendarOutline,
  IoPersonOutline,
  IoSearchOutline,
} from 'react-icons/io5'

const SearchCard = ({
  destination = 'Destination, hotel name',
  checkIn = 'July 23',
  checkOut = 'July 24',
  guests = '1 Room - 1 adult',
  onSearch,
  buttonLabel = 'Search',
  wrapperClassName = '',
  valueOnly = false,
  compact = false,
}) => {
  return (
    <div
      className={`mx-auto mt-6 rounded-2xl border border-gray-100 bg-white shadow-sm ${
        compact ? 'p-2.5 md:p-3' : 'p-3 md:p-4'
      } ${wrapperClassName}`}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-0">
        <div
          className={`flex flex-1 flex-col gap-3 sm:flex-row sm:items-center ${
            compact ? 'sm:gap-2' : 'sm:gap-4'
          }`}
        >
          {/* Destination */}
          <div
            className={`flex-1 rounded-xl border border-gray-200 bg-white hover:border-gray-300 ${
              compact ? 'px-3 py-2' : 'px-4 py-2.5'
            }`}
          >
            <p className="text-[11px] font-medium text-gray-400">Destination</p>
            <p className="mt-0.5 truncate text-xs font-semibold text-gray-800 md:text-sm">
              {destination}
            </p>
          </div>

          {/* Dates */}
          <div
            className={`flex flex-1 items-center justify-between rounded-xl border border-gray-200 bg-white hover:border-gray-300 ${
              compact ? 'px-3 py-2' : 'px-4 py-2.5'
            }`}
          >
            <div>
              <p className="text-[11px] font-medium text-gray-400">Check in</p>
              <p className="mt-0.5 text-xs font-semibold text-gray-800 md:text-sm">
                {checkIn}
              </p>
            </div>

            <div className="h-6 w-px bg-gray-200" />

            <div className="text-right">
              <p className="text-[11px] font-medium text-gray-400">Check out</p>
              <p className="mt-0.5 text-xs font-semibold text-gray-800 md:text-sm">
                {checkOut}
              </p>
            </div>
          </div>

          {/* Guests */}
          <div
            className={`flex-1 rounded-xl border border-gray-200 bg-white hover:border-gray-300 ${
              compact ? 'px-3 py-2' : 'px-4 py-2.5'
            }`}
          >
            <p className="text-[11px] font-medium text-gray-400">
              Rooms and Guests
            </p>
            <p className="mt-0.5 truncate text-xs font-semibold text-gray-800 md:text-sm">
              {guests}
            </p>
          </div>
        </div>

        {/* Button */}
        <div
          className={`flex justify-end lg:ml-3 ${
            compact ? 'mt-2 lg:mt-0' : 'mt-3 lg:mt-0'
          }`}
        >
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

export default SearchCard
