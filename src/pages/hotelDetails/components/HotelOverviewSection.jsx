import { useState } from 'react'

const HotelOverviewSection = ({ hotel }) => {
  const [readMore, setReadMore] = useState(false)
  const title = hotel?.name || ''
  const description = hotel?.description || hotel?.shortDescription || ''
  const isLong = description.length > 220
  const visibleDescription =
    !isLong || readMore ? description : `${description.slice(0, 220).trim()}...`
  const starRating = hotel?.starRating
  const reviewScore = hotel?.reviewScore
  const reviewCount = hotel?.reviewCount

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {title ? (
            <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">{title}</h1>
          ) : null}
          <p className="mt-2 text-xs text-gray-500">
            {starRating ? `${starRating} Star Hotel` : 'Hotel'}
            {reviewScore ? ` • ${reviewScore}/10` : ''}
            {reviewCount ? ` • ${reviewCount} reviews` : ''}
          </p>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            const element = document.getElementById('rooms')
            if (element) {
              const offset = 90
              const bodyRect = document.body.getBoundingClientRect().top
              const elementRect = element.getBoundingClientRect().top
              const elementPosition = elementRect - bodyRect
              const offsetPosition = elementPosition - offset
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
              })
            }
          }}
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#3ea5dc] px-7 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#3296cc] active:scale-95 cursor-pointer"
        >
          See the rooms
        </button>
      </div>

      {description ? (
        <>
          <p className="mt-4 text-xs md:text-sm leading-relaxed text-gray-500 max-w-2xl">
            {visibleDescription}
          </p>
          {isLong ? (
            <button
              type="button"
              onClick={() => setReadMore((v) => !v)}
              className="mt-3 block text-xs font-medium text-[#3ea5dc] hover:underline"
            >
              {readMore ? 'Read Less' : 'Read More'}
            </button>
          ) : null}
        </>
      ) : null}
    </div>
  )
}

export default HotelOverviewSection
