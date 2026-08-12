import { Link, useParams, useSearchParams } from 'react-router-dom'
import { IoCheckmarkCircle, IoCloseCircleOutline } from 'react-icons/io5'
import Spinner from '../../components/Spinner'
import { useConfirmPayment } from '../../hooks/useBookings'
import { formatStayDate } from '../../utils/hotelSearchParams'

const FAILED_STATUSES = ['failed', 'cancelled', 'canceled', 'error']

const formatCurrency = (amount, currency) => {
  const value = parseFloat(amount)
  if (Number.isNaN(value)) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(value)
}

const BookingSuccessPage = () => {
  const { bookingRef: paramRef } = useParams()
  const [searchParams] = useSearchParams()

  const rawRef =
    paramRef ||
    searchParams.get('bookingRef') ||
    searchParams.get('reference') ||
    searchParams.get('ref') ||
    ''
  let bookingRef = String(rawRef).trim()
  try {
    bookingRef = decodeURIComponent(bookingRef).trim()
  } catch {
    // keep raw ref if it is not encoded
  }

  const paymentStatus = (searchParams.get('status') || '').toLowerCase()
  const isPaymentFailed = FAILED_STATUSES.includes(paymentStatus)

  const { data, isLoading, isError, error } = useConfirmPayment(
    isPaymentFailed ? null : bookingRef,
  )

  const booking = data?.data || data?.booking || data || null
  const confirmedRef = booking?.bookingRef || booking?.bookingReference || bookingRef
  const hotelName = booking?.hotel?.name || booking?.hotelName || ''
  const roomName =
    booking?.rooms?.[0]?.roomType?.name ||
    booking?.rooms?.[0]?.roomLabel ||
    booking?.roomType ||
    ''
  const guestName = booking?.guestName || booking?.customerName || ''
  const guestEmail = booking?.guestEmail || booking?.customerEmail || ''
  const totalLabel = formatCurrency(booking?.totalPrice ?? booking?.amountPaid, booking?.currency)
  const statusLabel = booking?.status || 'Confirmed'

  if (!bookingRef) {
    return (
      <ResultShell>
        <IoCloseCircleOutline className="text-5xl text-rose-500" />
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900 md:text-3xl">
          Booking reference missing
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          We could not find a booking reference in this link.
        </p>
        <HomeActions />
      </ResultShell>
    )
  }

  if (isPaymentFailed) {
    return (
      <ResultShell>
        <IoCloseCircleOutline className="text-5xl text-rose-500" />
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900 md:text-3xl">
          Payment was not completed
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Your payment did not go through. Reference{' '}
          <span className="font-mono font-semibold text-slate-700">{bookingRef}</span>
        </p>
        <HomeActions />
      </ResultShell>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] bg-[#fafafa]">
        <Spinner />
      </div>
    )
  }

  if (isError) {
    const message =
      typeof error === 'string' ? error : error?.message || 'Could not confirm this payment.'
    return (
      <ResultShell>
        <IoCloseCircleOutline className="text-5xl text-rose-500" />
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900 md:text-3xl">
          Payment confirmation failed
        </h1>
        <p className="mt-2 text-sm text-gray-500">{message}</p>
        <p className="mt-1 text-xs text-gray-400">
          Reference <span className="font-mono font-semibold text-slate-600">{bookingRef}</span>
        </p>
        <HomeActions />
      </ResultShell>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24 pt-6 text-slate-800">
      <div className="mx-auto container max-w-2xl px-4 md:px-6">
        <span className="inline-block rounded-full border border-gray-300 bg-white px-4 py-1 text-xs font-medium text-gray-600 shadow-2xs">
          Booking Confirmed
        </span>

        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-2xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <IoCheckmarkCircle className="text-4xl text-emerald-500" />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Payment successful
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Thank you. Your booking has been confirmed and a confirmation will be sent to your email.
          </p>

          <div className="mt-6 rounded-xl border border-[#3ea5dc]/20 bg-[#3ea5dc]/5 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
              Booking reference
            </p>
            <p className="mt-1 font-mono text-lg font-bold text-[#3ea5dc]">{confirmedRef}</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-2xs space-y-4 text-sm">
          <h2 className="text-lg font-bold text-slate-900">Booking details</h2>

          {guestName ? <Detail label="Guest" value={guestName} /> : null}
          {guestEmail ? <Detail label="Email" value={guestEmail} /> : null}
          {hotelName ? <Detail label="Hotel" value={hotelName} /> : null}
          {roomName ? <Detail label="Room" value={roomName} /> : null}

          {(booking?.checkIn || booking?.checkOut) ? (
            <div className="grid grid-cols-2 gap-4">
              <Detail label="Check-in" value={formatStayDate(booking.checkIn) || booking.checkIn} />
              <Detail label="Check-out" value={formatStayDate(booking.checkOut) || booking.checkOut} />
            </div>
          ) : null}

          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Status</p>
              <p className="mt-1 text-sm font-semibold text-emerald-600">{statusLabel}</p>
            </div>
          </div>

          {(booking?.roomSubtotal || booking?.taxAmount || booking?.totalPrice) ? (
            <div className="space-y-2 border-t border-gray-100 pt-4 text-sm">
              {booking?.roomSubtotal !== undefined && booking?.roomSubtotal !== null ? (
                <div className="flex items-center justify-between text-slate-700">
                  <span>Room subtotal</span>
                  <span className="font-semibold">
                    {formatCurrency(booking.roomSubtotal, booking.currency)}
                  </span>
                </div>
              ) : null}
              {booking?.taxAmount !== undefined && booking?.taxAmount !== null ? (
                <div className="flex items-center justify-between text-slate-700">
                  <span>Taxes</span>
                  <span className="font-semibold">
                    {formatCurrency(booking.taxAmount, booking.currency)}
                  </span>
                </div>
              ) : null}
              {totalLabel ? (
                <div className="flex items-center justify-between text-slate-900">
                  <span className="font-bold">Total</span>
                  <span className="text-lg font-extrabold">{totalLabel}</span>
                </div>
              ) : null}
            </div>
          ) : totalLabel ? (
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Total</p>
              <p className="text-lg font-extrabold text-slate-900">{totalLabel}</p>
            </div>
          ) : null}
        </div>

        <HomeActions />
      </div>
    </div>
  )
}

const Detail = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{label}</p>
    <p className="mt-1 font-semibold text-slate-800">{value}</p>
  </div>
)

const ResultShell = ({ children }) => (
  <div className="min-h-screen bg-[#fafafa] pb-24 pt-16 text-slate-800">
    <div className="mx-auto container max-w-xl px-4 text-center md:px-6">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-2xs">
        {children}
      </div>
    </div>
  </div>
)

const HomeActions = () => (
  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
    <Link
      to="/"
      className="rounded-full bg-[#3ea5dc] px-8 py-3 text-center text-xs font-bold text-white shadow-md transition hover:bg-[#3296cc]"
    >
      Back to Home
    </Link>
    <Link
      to="/home/search"
      className="rounded-full border border-[#3ea5dc] px-8 py-3 text-center text-xs font-bold text-[#3ea5dc] transition hover:bg-sky-50"
    >
      Browse Hotels
    </Link>
  </div>
)

export default BookingSuccessPage
