import { useState } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { IoAdd, IoCheckmark } from 'react-icons/io5'
import HotelSummarySidebar from '../hotelDetails/components/HotelSummarySidebar'

const mockExtras = [
  {
    id: 1,
    title: 'EARLY CHECK IN FROM 10AM',
    price: '$36.10',
    unit: 'Per room/stay',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    title: 'EARLY CHECK IN FROM 10AM',
    price: '$36.10',
    unit: 'Per room/stay',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    title: 'EARLY CHECK IN FROM 10AM',
    price: '$36.10',
    unit: 'Per room/stay',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 4,
    title: 'EARLY CHECK IN FROM 10AM',
    price: '$36.10',
    unit: 'Per room/stay',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 5,
    title: 'EARLY CHECK IN FROM 10AM',
    price: '$36.10',
    unit: 'Per room/stay',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80',
  },
]

const CustomizeStayPage = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const selectedRoom = state?.selectedRoom || {
    name: 'SUPERIOR ROOM, 2 Single Size Beds, City View',
    price: '$87',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=400&q=80',
    capacity: '1 adult',
    taxes: '$14.27',
    totalPrice: '$120.76',
  }
  const hotelTitle = state?.title || state?.hotel?.name || ''
  const stay = state?.stay || null
  const hotel = state?.hotel || null

  const [selectedExtras, setSelectedExtras] = useState([])

  const toggleExtra = (id) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-white pb-20 pt-6">
      <div className="mx-auto container px-4 md:px-6">
        {/* Breadcrumbs */}
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

        {/* Main Header */}
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900">
          Customise Your Stay
        </h1>

        {/* 2-Column Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          {/* Left Column - Extras List */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Extras</h2>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockExtras.map((extra) => {
                const isAdded = selectedExtras.includes(extra.id)
                return (
                  <div
                    key={extra.id}
                    className="flex overflow-hidden rounded-2xl border border-gray-100 bg-white p-3.5 shadow-2xs transition hover:shadow-md"
                  >
                    <img
                      src={extra.image}
                      alt={extra.title}
                      className="h-28 w-32 shrink-0 rounded-xl object-cover"
                    />

                    <div className="ml-4 flex flex-1 flex-col justify-between py-1">
                      <h3 className="text-xs font-bold uppercase leading-tight tracking-wide text-slate-900 line-clamp-2">
                        {extra.title}
                      </h3>

                      <div className="flex items-end justify-between">
                        <div>
                          <span className="text-xl font-bold text-slate-900">
                            {extra.price}
                          </span>
                          <span className="ml-1 text-[11px] text-gray-400 font-normal">
                            {extra.unit}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleExtra(extra.id)}
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-white transition cursor-pointer active:scale-95 ${
                            isAdded
                              ? 'bg-emerald-500 hover:bg-emerald-600'
                              : 'bg-[#3ea5dc] hover:bg-[#3296cc]'
                          }`}
                          aria-label="Add extra"
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

            {/* Disclaimer & Footer Terms */}
            <div className="mt-12 space-y-3.5 text-[11px] leading-relaxed text-gray-400">
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

          {/* Right Column - Summary Sidebar */}
          <div>
            {(() => {
              const extrasTotal = selectedExtras.reduce((sum, id) => {
                const extra = mockExtras.find((e) => e.id === id)
                if (extra) {
                  const priceNum = parseFloat(extra.price.replace('$', '')) || 0
                  return sum + priceNum
                }
                return sum
              }, 0)

              return (
                <HotelSummarySidebar
                  hotel={hotel}
                  title={hotelTitle}
                  stay={stay}
                  selectedRoom={selectedRoom}
                  extraPrice={extrasTotal}
                />
              )
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomizeStayPage
