import { useEffect, useState } from 'react'
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom'
import { IoAdd, IoCheckmark } from 'react-icons/io5'
import HotelSummarySidebar from '../hotelDetails/components/HotelSummarySidebar'
import FallbackImage from '../../components/FallbackImage'
import Spinner from '../../components/Spinner'
import { useHotel } from '../../hooks/useHotels'
import { getStoredHotelSearch, saveHotelSearch } from '../../utils/hotelSearchStorage'
import {
  normalizeSelectedRooms,
  updateSelectedRoomQuantity,
  getSelectedRoomsQuantity,
} from '../../utils/selectedRooms'
import { toast } from 'react-toastify'

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
  const minPaxValue = Number(addOn?.minPax ?? addOn?.minimumPax ?? addOn?.minGuests)
  return {
    id: item?.id || addOn?.id,
    addOnId: item?.addOnId || addOn?.id || item?.id,
    title: addOn?.name || '',
    description: addOn?.description || '',
    price: Number.isNaN(priceValue) ? 0 : priceValue,
    unit: formatPriceUnit(addOn?.priceUnit),
    image:
      addOn?.imageUrl ||
      addOn?.coverImageUrl ||
      addOn?.thumbnailUrl ||
      (Array.isArray(addOn?.images) ? addOn.images[0]?.url || addOn.images[0] : '') ||
      '',
    minPax:
      Number.isFinite(minPaxValue) && minPaxValue > 0 ? Math.floor(minPaxValue) : 1,
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
  const [selectedRooms, setSelectedRooms] = useState(() =>
    normalizeSelectedRooms(state?.selectedRooms, state?.selectedRoom),
  )
  const stayParams = buildStayParams(stay)
  const { data: hotelData, isLoading, isFetching, isError } = useHotel(hotelId, stayParams)
  const maxRooms = Number(stay?.rooms) || 1
  const totalGuests = Math.max(
    1,
    (Number(stay?.adults) || 0) + (Number(stay?.children) || 0),
  )

  const hotel = hotelData || state?.hotel || null
  const hotelTitle = hotel?.name || state?.title || ''

  useEffect(() => {
    if (!hotelData) return
    setSelectedRooms((prev) => {
      const normalized = normalizeSelectedRooms(prev)
      if (normalized.length === 0) return prev
      return normalized.map((selected) => {
        const updated = (hotelData.roomTypes || []).find((room) => room.id === selected.id)
        if (!updated) return selected
        return {
          ...selected,
          ...updated,
          quantity: selected.quantity,
          pricePreview: updated.pricePreview || null,
          priceNum: Number(updated.discountPrice || updated.basePrice) || selected.priceNum,
          taxNum: Number(updated.taxPerNight) || 0,
        }
      })
    })
  }, [hotelData])

  const handleStayChange = (nextStay) => {
    const saved = saveHotelSearch(nextStay)
    setStay(saved)
  }

  const handleRoomQuantityChange = (roomId, quantity) => {
    setSelectedRooms((prev) => {
      const currentTotal = getSelectedRoomsQuantity(prev)
      const currentRoom = prev.find((room) => room.id === roomId)
      const currentQty = Number(currentRoom?.quantity) || 0
      if (quantity > currentQty && currentTotal >= maxRooms) {
        toast.info(`You can select up to ${maxRooms} room${maxRooms !== 1 ? 's' : ''}.`)
        return prev
      }
      return updateSelectedRoomQuantity(prev, roomId, quantity)
    })
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
    const target = extras.find((item) => item.id === id)
    if (!target) return

    if (totalGuests < target.minPax) {
      toast.info(
        `${target.title} requires minimum ${target.minPax} pax. Your current selection has ${totalGuests} guest${totalGuests > 1 ? 's' : ''}.`,
      )
      return
    }

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
    <div className="min-h-screen w-full overflow-x-hidden bg-white pb-20 pt-6">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-5 lg:px-6 xl:px-8">
        <nav className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-400">
          <Link to="/" className="transition hover:text-slate-900">
            Home
          </Link>
          <span>/</span>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="transition hover:text-slate-900"
          >
            Rates
          </button>
          <span>/</span>
          <span className="font-semibold text-[#3ea5dc]">Add-on</span>
        </nav>

        <h1 className="mt-6 break-words text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          Customise Your Stay
        </h1>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,300px)] lg:gap-5 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-8">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Extras</h2>

            {extras.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
                No add-ons available for this hotel.
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
                {extras.map((extra) => {
                  const isAdded = selectedExtras.includes(extra.id)
                  return (
                    <div
                      key={extra.id}
                      className="flex w-full min-w-0 items-stretch overflow-hidden rounded-2xl border border-gray-100 bg-white p-3.5 shadow-2xs transition hover:shadow-md"
                    >
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#f3f4f6] sm:h-28 sm:w-32">
                        <FallbackImage
                          src={extra.image}
                          alt={extra.title}
                          className="h-full w-full object-cover"
                          dummyClassName="h-full w-full object-contain p-4"
                        />
                      </div>

                      <div className="ml-3 flex min-w-0 flex-1 flex-col justify-between py-0.5 sm:ml-4 sm:py-1">
                        <div className="min-w-0">
                          <h3 className="line-clamp-2 text-xs font-bold uppercase leading-tight tracking-wide break-words text-slate-900">
                            {extra.title}
                          </h3>
                          {extra.minPax > 1 ? (
                            <p className="mt-1 text-[11px] font-semibold text-[#3ea5dc]">
                              Minimum {extra.minPax} pax
                            </p>
                          ) : null}
                          {extra.description ? (
                            <p className="mt-1 line-clamp-2 text-[11px] text-gray-400">
                              {extra.description}
                            </p>
                          ) : null}
                        </div>

                        <div className="mt-3 flex items-end justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-lg font-bold text-slate-900 sm:text-xl">
                              ${extra.price}
                            </span>
                            {extra.unit ? (
                              <span className="ml-1 text-[11px] font-normal text-gray-400">
                                {extra.unit}
                              </span>
                            ) : null}
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleExtra(extra.id)}
                            className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition active:scale-95 ${
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

            <div className="mt-12 rounded-2xl border border-sky-100 bg-[#f8fbfe] p-5 md:p-6">
              <h3 className="text-lg font-bold text-slate-900">
                Bintan Tour Packages - Good to Know
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 md:text-base">
                Make your Bintan getaway even more memorable by adding tours, dining and local
                experiences to your booking.
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600 md:text-base">
                <li>Add-on prices are based on your selected travel date and number of guests.</li>
                <li>All tours and activities are subject to availability.</li>
                <li>
                  Selected add-ons will be included in your final booking summary and total price.
                </li>
                <li>
                  Confirmed tour timings will be shared with you by email once the booking is
                  completed.
                </li>
                <li>
                  Inclusions vary by activity. Please check each add-on for details such as meals,
                  entrance tickets and transportation.
                </li>
                <li>
                  If your selected activity is unavailable, our team will contact you with an
                  alternative option.
                </li>
                <li>
                  Cancellations or changes close to the travel date may not be accepted once
                  arrangements have been confirmed.
                </li>
              </ul>
            </div>
          </div>

          <div className="min-w-0">
            <HotelSummarySidebar
              hotel={hotel}
              title={hotelTitle}
              stay={stay}
              selectedRooms={selectedRooms}
              onRoomQuantityChange={handleRoomQuantityChange}
              extraPrice={extrasTotal}
              selectedAddOns={selectedAddOns}
              onStayChange={handleStayChange}
              isLoading={isFetching}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomizeStayPage
