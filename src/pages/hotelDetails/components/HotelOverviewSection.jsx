import { useState } from 'react'

const HotelOverviewSection = ({ title = 'Pullman Hanoi' }) => {
  const [readMore, setReadMore] = useState(false)

  return (
    <div>
      {/* Header Title & CTA */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">{title}</h1>
          <p className="mt-2 text-xs text-gray-500">
            Hotels 5 <span className="text-gray-400">👥</span> • 4.4/5{' '}
            <a href="#reviews" className="text-[#3ea5dc] underline hover:text-[#3296cc]">
              990 reviews
            </a>
          </p>
        </div>

        <a
          href="#rooms"
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#3ea5dc] px-7 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#3296cc] active:scale-95"
        >
          See the rooms
        </a>
      </div>

      {/* Description */}
      <p className="mt-4 text-xs leading-relaxed text-gray-500 max-w-2xl">
        The {title} stands as one of the city&apos;s premier business hotels, strategically
        located close to corporate headquarters and government offices. It offers convenient
        access, just an easy 10-minute drive.
        {readMore && (
          <span>
            {' '}
            Enjoy high-speed Wi-Fi, world-class dining options, spa facilities, and
            unmatched customer service tailored for both leisure and business travelers.
          </span>
        )}
      </p>
      <button
        type="button"
        onClick={() => setReadMore((v) => !v)}
        className="mt-3 block text-xs font-medium text-[#3ea5dc] hover:underline"
      >
        {readMore ? 'Read Less' : 'Read More'}
      </button>
    </div>
  )
}

export default HotelOverviewSection
