import { useEffect, useState } from 'react'
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom'
import { IoAdd, IoCheckmark } from 'react-icons/io5'
import HotelSummarySidebar from '../hotelDetails/components/HotelSummarySidebar'
import FallbackImage from '../../components/FallbackImage'
import Spinner from '../../components/Spinner'
import { useHotel } from '../../hooks/useHotels'
import { getStoredHotelSearch, saveHotelSearch } from '../../utils/hotelSearchStorage'

const PRICE_UNIT_LABELS = {
  per_room_per_stay: 'Per room/stay',
  per_person_per_stay: 'Per person/stay',
  per_room_per_night: 'Per room/night',
  per_person_per_night: 'Per person/night',
}

const formatPriceUnit = (unit) => {
  if (!unit) return ''
  return PRICE_UNIT_LABELS[unit] || unit.replace(/_/g, ' ')
}

const mapAddOn = (item) => {
  const addOn = item?.addOn || item
  const priceValue = Number(addOn?.price)
  return {
    id: item?.id || addOn?.id,
    addOnId: item?.addOnId || addOn?.id || item?.id,
    title: addOn?.name || '',
    description: addOn?.description || '',
    price: Number.isNaN(priceValue) ? 0 : priceValue,
    unit: formatPriceUnit(addOn?.priceUnit),
    image: addOn?.imageUrl || '',
    isActive: addOn?.isActive !== false,
  }
}

const buildStayParams = (stay) => {
  if (!stay?.checkIn || !stay?.checkOut) return {}
  return {
    checkIn: stay.checkIn,
    checkOut: stay.checkOut,
    adults: Number(stay.adults) || 1,
    rooms: Number(stay.rooms) || 1,
    children: Number(stay.children) || 0,
  }
}

const CustomizeStayPage = () => {
  const { hotelId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const [selectedExtras, setSelectedExtras] = useState([])
  const [stay, setStay] = useState(() => state?.stay || getStoredHotelSearch())
  const [selectedRoom, setSelectedRoom] = useState(() => state?.selectedRoom || null)
  const stayParams = buildStayParams(stay)
  const { data: hotelData, isLoading, isError } = useHotel(hotelId, stayParams)

  const hotel = hotelData || state?.hotel || null
  const hotelTitle = hotel?.name || state?.title || ''

  useEffect(() => {
    if (!hotelData || !selectedRoom?.id) return
    const updated = (hotelData.roomTypes || []).find((room) => room.id === selectedRoom.id)
    if (!updated) return
    setSelectedRoom((prev) => ({
      ...prev,
      ...updated,
      pricePreview: updated.pricePreview || null,
      priceNum: Number(updated.discountPrice || updated.basePrice) || prev.priceNum,
      taxNum: Number(updated.taxPerNight) || 0,
    }))
  }, [hotelData, selectedRoom?.id])

  const handleStayChange = (nextStay) => {
    const saved = saveHotelSearch(nextStay)
    setStay(saved)
  }

  const extras = (hotel?.addOns || [])
    .map(mapAddOn)
    .filter((item) => item.isActive && item.title)

  const extrasTotal = selectedExtras.reduce((sum, id) => {
    const extra = extras.find((item) => item.id === id)
    return extra ? sum + extra.price : sum
  }, 0)

  const selectedAddOns = selectedExtras
    .map((id) => extras.find((item) => item.id === id))
    .filter(Boolean)
    .map((item) => ({ addOnId: item.addOnId, quantity: 1 }))

  const toggleExtra = (id) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  if (isLoading && !hotel) {
    return <Spinner />
  }

  if (isError && !hotel) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 border border-red-200 bg-red-50 text-red-600 rounded-2xl text-center font-bold">
        Failed to load add-ons. Please try again.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-20 pt-6">
      <div className="mx-auto container px-4 md:px-6">
        <nav className="flex items-center gap-2 text-xs font-medium text-gray-400">
          <Link to="/" className="hover:text-slate-900 transition">
            Home
          </Link>
          <span>/</span>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="hover:text-slate-900 transition"
          >
            Rates
          </button>
          <span>/</span>
          <span className="font-semibold text-[#3ea5dc]">Add-on</span>
        </nav>

        <h1 className="mt-6 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
          Customise Your Stay
        </h1>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">Extras</h2>

            {extras.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
                No add-ons available for this hotel.
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {extras.map((extra) => {
                  const isAdded = selectedExtras.includes(extra.id)
                  return (
                    <div
                      key={extra.id}
                      className="flex overflow-hidden rounded-2xl border border-gray-100 bg-white p-3.5 shadow-2xs transition hover:shadow-md"
                    >
                      <div className="h-28 w-32 shrink-0 overflow-hidden rounded-xl bg-[#f3f4f6]">
                        <FallbackImage
                          src={extra.image}
                          alt={extra.title}
                          className="h-28 w-32 object-cover"
                          dummyClassName="h-28 w-32 object-contain p-4"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col justify-between py-1 min-w-0">
                        <div>
                          <h3 className="text-xs font-bold uppercase leading-tight tracking-wide text-slate-900 line-clamp-2">
                            {extra.title}
                          </h3>
                          {extra.description ? (
                            <p className="mt-1 text-[11px] text-gray-400 line-clamp-2">
                              {extra.description}
                            </p>
                          ) : null}
                        </div>

                        <div className="flex items-end justify-between gap-2">
                          <div>
                            <span className="text-xl font-bold text-slate-900">
                              ${extra.price}
                            </span>
                            {extra.unit ? (
                              <span className="ml-1 text-[11px] text-gray-400 font-normal">
                                {extra.unit}
                              </span>
                            ) : null}
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleExtra(extra.id)}
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-white transition cursor-pointer active:scale-95 ${
                              isAdded
                                ? 'bg-emerald-500 hover:bg-emerald-600'
                                : 'bg-[#3ea5dc] hover:bg-[#3296cc]'
                            }`}
                            aria-label={isAdded ? 'Remove extra' : 'Add extra'}
                          >
                            {isAdded ? (
                              <IoCheckmark className="text-lg" />
                            ) : (
                              <IoAdd className="text-lg" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="mt-12 space-y-3.5 text-sm md:text-base leading-relaxed text-gray-400">
              <p>These prices are the &quot;starting from&quot; prices.</p>
              <p>
                They correspond to the lowest total price available on the dates requested, based on
                one accommodation (room, bed, etc.) or other services.
              </p>
              <p>
                These prices may apply to types of rooms, apartments, or different characteristics.
                Depending on the country of the hotel, these prices may be either: pre-tax,
                including VAT only, or inclusive of all taxes (VAT and tourist tax included). When
                it is not stipulated that all taxes are included on a price, taxes (VAT and/or
                tourist tax) shall be indicated in the following steps of the booking process.
              </p>
              <p>
                All bookings, wherever they are made, are payable in the hotel&apos;s currency. Only
                the amount confirmed during the booking in the currency of the hotel is guaranteed.
                Conversion to the customer&apos;s currency is given for reference only and is not
                part of the contract. Costs linked to conversions between the hotel&apos;s currency and
                that of the customer (exchange rates, bank fees) shall be paid by the customer.
              </p>
              <p>
                The amount is converted according to the exchange rate of the day provided by our
                partner DEVISEA, with the Euro as reference currency.
              </p>
              <p>
                The promotion displayed applies to the standard rate of the day offered by the
                hotel. The standard rate may vary depending on the reservation period and the dates
                of stay.
              </p>

              <div className="pt-4 space-y-2">
                <a href="#conditions" className="block text-[#3ea5dc] hover:underline font-medium">
                  General Conditions of Sale
                </a>
                <a href="#terms" className="block text-[#3ea5dc] hover:underline font-medium">
                  ALL - Accor Live Limitless terms and conditions
                </a>
              </div>
            </div>
          </div>

          <div>
            <HotelSummarySidebar
              hotel={hotel}
              title={hotelTitle}
              stay={stay}
              selectedRoom={selectedRoom}
              extraPrice={extrasTotal}
              selectedAddOns={selectedAddOns}
              onStayChange={handleStayChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomizeStayPage
