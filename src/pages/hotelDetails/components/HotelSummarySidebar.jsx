import { useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { IoCalendarOutline, IoPersonOutline, IoChevronUp, IoChevronDown } from 'react-icons/io5'
import { toast } from 'react-toastify'
import FallbackImage from '../../../components/FallbackImage'
import {
  formatStayDate,
  formatClockTime,
  getNightsBetween,
} from '../../../utils/hotelSearchParams'

const HotelSummarySidebar = ({
  hotel,
  title: titleProp = '',
  stay = null,
  selectedRoom = null,
  extraPrice = 0,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { hotelId } = useParams()
  const [showDetails, setShowDetails] = useState(true)

  const title = hotel?.name || titleProp || ''
  const checkInTime = formatClockTime(hotel?.checkInTime)
  const checkOutTime = formatClockTime(hotel?.checkOutTime)
  const checkInLabel = formatStayDate(stay?.checkIn)
  const checkOutLabel = formatStayDate(stay?.checkOut)
  const nights = getNightsBetween(stay?.checkIn, stay?.checkOut)
  const adults = Number(stay?.adults) || 1
  const rooms = Number(stay?.rooms) || 1
  const children = Number(stay?.children) || 0
  const targetId = hotel?.id || hotel?.slug || hotelId

  const handleNext = () => {
    if (location.pathname.includes('/book-ferry')) {
      toast.info('Please fill out the passenger details and complete the booking below.')
      return
    }
    if (location.pathname.includes('/customize')) {
      navigate(`/home/search/${targetId}/book-ferry`, {
        state: { selectedRoom, title, extraPrice, stay, hotel },
      })
    } else {
      navigate(`/home/search/${targetId}/customize`, {
        state: { selectedRoom, title, stay, hotel },
      })
    }
  }

  const stayDates = (
    <div className="mt-4 space-y-2">
      {(checkInLabel || checkOutLabel) ? (
        <>
          <div className="flex items-center gap-2 text-[#3ea5dc] font-medium text-xs">
            <IoCalendarOutline className="text-sm shrink-0" />
            <span>
              {checkInLabel || 'Select check-in'}
              {checkOutLabel ? ` → ${checkOutLabel}` : ''}
            </span>
          </div>
          {nights > 0 ? (
            <p className="pl-6 text-[11px] text-gray-400">
              {nights} night{nights !== 1 ? 's' : ''}
            </p>
          ) : null}
        </>
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
  const stayNights = nights > 0 ? nights : 1
  const finalTotal = basePriceNum * stayNights + taxesNum * stayNights + extraPrice

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
              <span>${(basePriceNum * stayNights + extraPrice).toFixed(2)}</span>
            </div>
          </div>
        </div>
      ) : null}

      {taxesNum > 0 ? (
        <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
          <span>Taxes</span>
          <span className="font-semibold text-gray-800">
            ${(taxesNum * stayNights).toFixed(2)}
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
          onClick={handleNext}
          className="w-full rounded-full bg-[#3ea5dc] py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#3296cc] active:scale-95 cursor-pointer"
        >
          Continue to ferry booking
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="w-full rounded-full border border-[#3ea5dc] py-3 text-xs font-bold text-[#3ea5dc] transition hover:bg-sky-50 active:scale-95 cursor-pointer"
        >
          Skip ferry booking
        </button>
      </div>
    </aside>
  )
}

export default HotelSummarySidebar
