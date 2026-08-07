import { useState } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { IoArrowBackOutline, IoArrowForwardOutline, IoPersonOutline } from 'react-icons/io5'
import HotelSummarySidebar from '../hotelDetails/components/HotelSummarySidebar'

const FerryBookingPage = () => {
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
  const hotelTitle = state?.title || 'Pullman Hanoi'

  // Form State
  const [gender, setGender] = useState('Male')
  const [agreed, setAgreed] = useState(true)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryCode: 'SG +65',
    phone: '',
    passportNo: '',
    nationality: '',
    passportName: '',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    issuanceCountry: '',
    issueDay: '',
    issueMonth: '',
    issueYear: '',
    expDay: '',
    expMonth: '',
    expYear: '',
  })

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const years = Array.from({ length: 50 }, (_, i) => String(2026 - i))
  const expYears = Array.from({ length: 20 }, (_, i) => String(2026 + i))

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24 pt-6 text-slate-800">
      <div className="mx-auto container px-4 md:px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-medium text-gray-400">
          <Link to="/" className="hover:text-slate-900 transition">
            Home
          </Link>
          <span>/</span>
          <span>Select Trip</span>
          <span>/</span>
          <span className="font-semibold text-[#3ea5dc]">Book Ferry</span>
        </nav>

        {/* Step Badge & Page Title */}
        <div className="mt-6">
          <span className="inline-block rounded-full border border-gray-300 bg-white px-4 py-1 text-xs font-medium text-gray-600 shadow-2xs">
            Ferry Booking Steps
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Complete Your Ferry Booking
          </h1>
          <p className="mt-2 text-xs text-gray-500 max-w-2xl">
            Follow the steps below to review your trip, enter passenger details, and confirm your ferry tickets.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            {/* 1. Booking Details Card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-2xs space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Booking Details</h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-xs outline-none transition focus:border-[#3ea5dc] focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-xs outline-none transition focus:border-[#3ea5dc] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                    <div className="flex gap-2">
                      <select
                        value={formData.countryCode}
                        onChange={(e) => handleChange('countryCode', e.target.value)}
                        className="rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-3 text-xs font-medium text-gray-700 outline-none cursor-pointer focus:border-[#3ea5dc]"
                      >
                        <option value="SG +65">SG +65</option>
                        <option value="ID +62">ID +62</option>
                        <option value="MY +60">MY +60</option>
                        <option value="US +1">US +1</option>
                      </select>
                      <input
                        type="tel"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full flex-1 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-xs outline-none transition focus:border-[#3ea5dc] focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Booking Passengers Details Card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-2xs space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Booking Passengers Details</h2>
                <p className="mt-1 text-[11px] text-gray-400">
                  Enter all passenger information as it appears on official travel documents. Incorrect or incomplete details may cause check-in or boarding issues.
                </p>
              </div>

              {/* Passenger Badge Header */}
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Passenger 1</h3>
                <span className="rounded-full bg-[#3ea5dc] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">
                  Adult
                </span>
              </div>

              <div className="space-y-4 text-xs">
                {/* Passport No & Nationality */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Passport No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter number"
                      value={formData.passportNo}
                      onChange={(e) => handleChange('passportNo', e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-xs outline-none transition focus:border-[#3ea5dc] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Nationality <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.nationality}
                      onChange={(e) => handleChange('nationality', e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-xs text-gray-600 outline-none cursor-pointer focus:border-[#3ea5dc]"
                    >
                      <option value="">Select Nationality</option>
                      <option value="Singaporean">Singaporean</option>
                      <option value="Indonesian">Indonesian</option>
                      <option value="Malaysian">Malaysian</option>
                      <option value="Vietnamese">Vietnamese</option>
                      <option value="American">American</option>
                    </select>
                  </div>
                </div>

                {/* Name as in passport */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Name (As in Passport) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={formData.passportName}
                    onChange={(e) => handleChange('passportName', e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-xs outline-none transition focus:border-[#3ea5dc] focus:bg-white"
                  />
                </div>

                {/* Date of birth & Gender */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        value={formData.dobDay}
                        onChange={(e) => handleChange('dobDay', e.target.value)}
                        className="rounded-xl border border-gray-200 bg-gray-50/50 px-2 py-3 text-xs text-gray-600 outline-none cursor-pointer"
                      >
                        <option value="">Day</option>
                        {days.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <select
                        value={formData.dobMonth}
                        onChange={(e) => handleChange('dobMonth', e.target.value)}
                        className="rounded-xl border border-gray-200 bg-gray-50/50 px-2 py-3 text-xs text-gray-600 outline-none cursor-pointer"
                      >
                        <option value="">Month</option>
                        {months.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                      <select
                        value={formData.dobYear}
                        onChange={(e) => handleChange('dobYear', e.target.value)}
                        className="rounded-xl border border-gray-200 bg-gray-50/50 px-2 py-3 text-xs text-gray-600 outline-none cursor-pointer"
                      >
                        <option value="">Year</option>
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setGender('Male')}
                        className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-semibold transition cursor-pointer ${
                          gender === 'Male'
                            ? 'bg-[#3ea5dc] text-white shadow-sm'
                            : 'border border-gray-200 bg-gray-50/50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <IoPersonOutline className="text-sm" />
                        <span>Male</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setGender('Female')}
                        className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-semibold transition cursor-pointer ${
                          gender === 'Female'
                            ? 'bg-[#3ea5dc] text-white shadow-sm'
                            : 'border border-gray-200 bg-gray-50/50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <IoPersonOutline className="text-sm" />
                        <span>Female</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Issuance Country */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Issuance Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.issuanceCountry}
                    onChange={(e) => handleChange('issuanceCountry', e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-xs text-gray-600 outline-none cursor-pointer focus:border-[#3ea5dc]"
                  >
                    <option value="">Select Country</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="United States">United States</option>
                  </select>
                </div>

                {/* Passport Issuance & Expiry Dates */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Issuance Date */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Passport Issuance Date <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        value={formData.issueDay}
                        onChange={(e) => handleChange('issueDay', e.target.value)}
                        className="rounded-xl border border-gray-200 bg-gray-50/50 px-2 py-3 text-xs text-gray-600 outline-none cursor-pointer"
                      >
                        <option value="">Day</option>
                        {days.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <select
                        value={formData.issueMonth}
                        onChange={(e) => handleChange('issueMonth', e.target.value)}
                        className="rounded-xl border border-gray-200 bg-gray-50/50 px-2 py-3 text-xs text-gray-600 outline-none cursor-pointer"
                      >
                        <option value="">Month</option>
                        {months.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                      <select
                        value={formData.issueYear}
                        onChange={(e) => handleChange('issueYear', e.target.value)}
                        className="rounded-xl border border-gray-200 bg-gray-50/50 px-2 py-3 text-xs text-gray-600 outline-none cursor-pointer"
                      >
                        <option value="">Year</option>
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Passport Expiry Date <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        value={formData.expDay}
                        onChange={(e) => handleChange('expDay', e.target.value)}
                        className="rounded-xl border border-gray-200 bg-gray-50/50 px-2 py-3 text-xs text-gray-600 outline-none cursor-pointer"
                      >
                        <option value="">Day</option>
                        {days.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <select
                        value={formData.expMonth}
                        onChange={(e) => handleChange('expMonth', e.target.value)}
                        className="rounded-xl border border-gray-200 bg-gray-50/50 px-2 py-3 text-xs text-gray-600 outline-none cursor-pointer"
                      >
                        <option value="">Month</option>
                        {months.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                      <select
                        value={formData.expYear}
                        onChange={(e) => handleChange('expYear', e.target.value)}
                        className="rounded-xl border border-gray-200 bg-gray-50/50 px-2 py-3 text-xs text-gray-600 outline-none cursor-pointer"
                      >
                        <option value="">Year</option>
                        {expYears.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation Checkbox */}
            <div className="flex items-start gap-3 text-[11px] leading-relaxed text-gray-500 pt-2">
              <input
                type="checkbox"
                id="confirm"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded accent-[#3ea5dc] cursor-pointer"
              />
              <label htmlFor="confirm" className="cursor-pointer">
                I confirm that all passenger data entered here is accurate and every passenger holds a valid travelling document (min 6 months from travel date), entry, exit visa(s) and other required documents. I have checked and verified the data of every passenger and understand and accept the consequences for failing to comply with the requirements. We will not seek compensation or refund from Batam Fast in these cases.
              </label>
            </div>

            {/* Bottom Action Navigation Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-800 px-7 py-3 text-xs font-bold text-slate-800 transition hover:bg-slate-800 hover:text-white cursor-pointer active:scale-95"
              >
                <IoArrowBackOutline className="text-base" />
                <span>Back to Previous Step</span>
              </button>

              <button
                type="button"
                onClick={() => alert('Booking submission successful!')}
                className="inline-flex items-center gap-2 rounded-full bg-[#3ea5dc] px-8 py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-[#3296cc] cursor-pointer active:scale-95"
              >
                <span>Continue to Next Step</span>
                <IoArrowForwardOutline className="text-base" />
              </button>
            </div>
          </div>

          {/* Right Column - Summary Sidebar */}
          <div>
            <HotelSummarySidebar title={hotelTitle} selectedRoom={selectedRoom} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FerryBookingPage
