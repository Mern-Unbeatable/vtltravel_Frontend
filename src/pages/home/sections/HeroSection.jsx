import { IoSearchOutline } from 'react-icons/io5'
import { LuCalendarDays, LuShip, LuUser, LuTrash2, LuPlus } from 'react-icons/lu'
import { TbBabyCarriage } from 'react-icons/tb'

export default function HeroSection() {
  return (
    <section className="relative mx-auto container px-4 pb-20 pt-6">
      {/* Hero Banner Area */}
      <div
        className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-cover bg-center px-6 pt-10 pb-24 text-white md:px-12 md:pt-14 md:pb-32"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.35)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80')",
        }}
      >
        {/* Trusted Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium backdrop-blur-md md:text-sm">
          <div className="flex -space-x-2 overflow-hidden">
            <img
              className="inline-block h-6 w-6 rounded-full ring-2 ring-white/50 object-cover"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
              alt="User"
            />
            <img
              className="inline-block h-6 w-6 rounded-full ring-2 ring-white/50 object-cover"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
              alt="User"
            />
            <img
              className="inline-block h-6 w-6 rounded-full ring-2 ring-white/50 object-cover"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
              alt="User"
            />
          </div>
          <span>Trusted by 100,000+ Travellers</span>
        </div>

        {/* Heading */}
        <h1 className="mt-6 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
          Book Batam Ferry Tickets <br className="hidden md:inline" />
          Online &amp; Skip the Queue
        </h1>
      </div>

      {/* Floating Search Card */}
      <div className="relative -mt-16 mx-auto max-w-6xl rounded-3xl border border-gray-100 bg-white p-5 shadow-2xl md:-mt-24 md:p-8">
        
        {/* Radio & Quick Links Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5 text-sm font-medium text-gray-700">
          <div className="flex items-center gap-6">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="tripType"
                defaultChecked
                className="h-4 w-4 accent-sky-500"
              />
              <span>Round trip</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-gray-500 hover:text-gray-800">
              <input type="radio" name="tripType" className="h-4 w-4 accent-sky-500" />
              <span>One way</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-gray-500 hover:text-gray-800">
              <input type="radio" name="tripType" className="h-4 w-4 accent-sky-500" />
              <span>Open trip</span>
            </label>
          </div>

          <div className="flex items-center gap-6 text-sky-500">
            <button className="flex items-center gap-1.5 hover:underline">
              <LuCalendarDays className="text-base" />
              <span>View Schedule</span>
            </button>
            <button className="hover:underline">Group Booking</button>
          </div>
        </div>

        {/* Search Inputs Layout */}
        <div className="mt-6 space-y-4">
          {/* Row 1: From & To */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3.5 transition focus-within:border-sky-500">
              <LuShip className="text-2xl text-gray-700" />
              <input
                type="text"
                placeholder="From"
                className="w-full text-base font-medium text-gray-800 placeholder-gray-400 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3.5 transition focus-within:border-sky-500">
              <LuShip className="text-2xl text-gray-700" />
              <input
                type="text"
                placeholder="To"
                className="w-full text-base font-medium text-gray-800 placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Dates & Passengers */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Journey Date */}
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3">
              <LuCalendarDays className="text-2xl text-gray-700" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">Date of Journey</span>
                <span className="text-sm font-semibold text-gray-800">11 Mar, 2026</span>
              </div>
            </div>

            {/* Return Date */}
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3">
              <LuCalendarDays className="text-2xl text-gray-400" />
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Date of return (Optional)</span>
              </div>
            </div>

            {/* Adult Counter */}
            <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-2 pl-4">
              <div className="flex items-center gap-2.5">
                <LuUser className="text-xl text-gray-700" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-800">Adult</span>
                  <span className="text-[10px] text-gray-400">12+ years</span>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-gray-100 px-3 py-1.5">
                <button className="text-gray-400 hover:text-red-500">
                  <LuTrash2 className="text-sm" />
                </button>
                <span className="text-sm font-semibold text-sky-500">01</span>
                <button className="text-gray-600 hover:text-black">
                  <LuPlus className="text-sm" />
                </button>
              </div>
            </div>

            {/* Child Counter / Add */}
            <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-2 pl-4">
              <div className="flex items-center gap-2.5">
                <TbBabyCarriage className="text-xl text-gray-700" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-800">Child</span>
                  <span className="text-[10px] text-gray-400">Up to 12 years</span>
                </div>
              </div>
              <button className="flex items-center gap-1 rounded-xl bg-gray-100 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-200">
                <LuPlus className="text-sm" /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Search Button (Floating Overlap Effect) */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 transform">
          <button className="flex items-center gap-2 rounded-full bg-sky-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition duration-200 hover:bg-sky-600 focus:ring-4 focus:ring-sky-200">
            <IoSearchOutline className="text-lg" />
            <span>Search Ferries</span>
          </button>
        </div>
      </div>
    </section>
  )
}