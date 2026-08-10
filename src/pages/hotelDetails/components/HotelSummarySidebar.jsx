import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { IoCalendarOutline, IoPersonOutline, IoChevronUp, IoChevronDown } from 'react-icons/io5'

const HotelSummarySidebar = ({ title = 'Pullman Hanoi', selectedRoom = null, extraPrice = 0 }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showDetails, setShowDetails] = useState(true)

  const handleNext = () => {
    if (location.pathname.includes('/customize')) {
      navigate('/home/search/1/book-ferry', { state: { selectedRoom, title, extraPrice } })
    } else {
      navigate('/home/search/1/customize', { state: { selectedRoom, title } })
    }
  }

  // 1. DEFAULT STATE: When no room is selected yet
  if (!selectedRoom) {
    return (
      <aside className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5 text-xs shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        <p className="mt-2.5 flex items-center gap-2 text-gray-500">
          <span className="text-gray-400">🔗</span>
          <span>Check-in 2:00 PM | Check-out 12:00 PM</span>
        </p>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-[#3ea5dc] font-medium text-xs">
            <IoCalendarOutline className="text-sm shrink-0" />
            <span>July 27, 2026 → July 29, 2026</span>
          </div>
          <p className="pl-6 text-[11px] text-gray-400">2 nights</p>

          <div className="mt-3 flex items-center gap-2 text-[#3ea5dc] font-medium text-xs">
            <IoPersonOutline className="text-sm shrink-0" />
            <span>1 adult - 1 room</span>
          </div>
        </div>
      </aside>
    )
  }

  // 2. SELECTED ROOM STATE: When user clicks "Choose this room"
  const roomData = selectedRoom
  const roomImage = roomData.image || roomData.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'

  return (
    <aside className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5 text-xs shadow-sm">
      {/* Header Info */}
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      <p className="mt-2 flex items-center gap-1.5 text-gray-500">
        <span className="text-gray-400">🔗</span>
        <span>Check-in 2:00 PM | Check-out 12:00 PM</span>
      </p>
 
      <div className="mt-3 flex items-center gap-2 text-[#3ea5dc] font-medium text-xs">
        <IoCalendarOutline className="text-sm shrink-0" />
        <span>July 27, 2026 → July 29, 2026</span>
      </div>
 
      <div className="my-4 border-t border-gray-100" />
 
      {/* Selected Room Preview */}
      <div className="flex items-start gap-3">
        <img
          src={roomImage}
          alt={roomData.name}
          className="h-16 w-16 shrink-0 rounded-xl object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-xs font-bold leading-snug text-slate-900 line-clamp-2">
              {roomData.name}
            </h4>
            <span className="text-base font-bold text-[#3ea5dc] shrink-0">
              {typeof roomData.price === 'number' ? `$${roomData.price}` : roomData.price}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-gray-400">{roomData.capacity || '1 adult'}</p>
        </div>
      </div>
 
      {/* Hide / Show Details Button */}
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
 
      {/* Expanded Breakdown Box */}
      {(() => {
        const rawPrice = typeof roomData.price === 'number' 
          ? roomData.price 
          : parseFloat((roomData.price || '').replace(/[$,]/g, '')) || 0;
        const basePriceNum = isNaN(rawPrice) ? 0 : rawPrice;

        const rawTaxes = typeof roomData.taxes === 'number'
          ? roomData.taxes
          : parseFloat((roomData.taxes || '').replace(/[$,]/g, '')) || 0;
        const taxesNum = isNaN(rawTaxes) ? 0 : rawTaxes;

        const finalTotal = basePriceNum + taxesNum + extraPrice
        const finalTotalStr = '$' + finalTotal.toFixed(2)
        const vndPrice = Math.round(finalTotal * 26317)
        const vndPriceStr = 'i.e. ₫' + vndPrice.toLocaleString()

        return (
          <>
            {showDetails && (
              <div className="mt-3 rounded-xl bg-[#f8fbfe] p-3.5 space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 leading-snug">{roomData.name}</span>
                    <span className="text-xs font-bold text-slate-900 shrink-0">
                      {typeof roomData.price === 'number' ? `$${roomData.price}` : roomData.price}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                    Flexible Rate
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#3ea5dc]">
                    Included: $6.36 savings thanks to the member rate.
                  </p>
                </div>

                {extraPrice > 0 && (
                  <div className="border-t border-gray-200/60 pt-2 flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>Extras (Add-ons)</span>
                    <span>${extraPrice.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-gray-200/60 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>Total room</span>
                    <span>${(basePriceNum + extraPrice).toFixed(2)}</span>
                  </div>
                  <button type="button" className="mt-0.5 text-[11px] text-[#3ea5dc] hover:underline">
                    Pricing conditions
                  </button>
                </div>
              </div>
            )}

            {/* Taxes */}
            <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
              <span>Taxes</span>
              <span className="font-semibold text-gray-800">{roomData.taxes || '$14.27'}</span>
            </div>

            {/* Total */}
            <div className="mt-4 border-t border-gray-100 pt-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-sm font-bold text-slate-900">Total</span>
                  <p className="text-[10px] text-gray-400">Fees and taxes included</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-slate-900">{finalTotalStr}</span>
                  <p className="text-[10px] text-gray-400">{vndPriceStr}</p>
                </div>
              </div>
            </div>
          </>
        )
      })()}

      {/* Action Buttons */}
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
