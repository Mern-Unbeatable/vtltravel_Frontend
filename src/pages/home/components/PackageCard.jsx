import { IoCalendarOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import FallbackImage from '../../../components/FallbackImage'

const PackageCard = ({ item, onExplore }) => {
  const navigate = useNavigate()
  const hotelPath =
    item?.slug || (typeof item?.id === 'string' && item.id.length > 8)
      ? `/home/search/${item.slug || item.id}`
      : ''

  const handleExplore = () => {
    if (onExplore) {
      onExplore()
      return
    }
    if (hotelPath) navigate(hotelPath)
  }

  return (
    <article
      onClick={handleExplore}
      className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm hover:cursor-pointer"
    >
      <div className="h-44 w-full overflow-hidden bg-[#f3f4f6]">
        <FallbackImage
          src={item.image}
          alt={item.title || 'Hotel'}
          className="h-44 w-full object-cover"
          dummyClassName="h-44 w-full object-contain p-8"
        />
      </div>

      <div className="p-4">
        {item.title ? (
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
        ) : null}

        {item.validTill ? (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
            <IoCalendarOutline className="text-sm shrink-0" />
            <span>{item.validTill}</span>
          </div>
        ) : null}

        {item.description ? (
          <p className="mt-2 line-clamp-2 text-base leading-relaxed text-gray-500">
            {item.description}
          </p>
        ) : null}

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            {item.price ? (
              <>
                <p className="text-sm text-gray-400">From</p>
                <p className="text-xl font-bold text-primary">{item.price}</p>
              </>
            ) : null}
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              handleExplore()
            }}
            className="rounded-full bg-[#EAF8FF] px-4 py-2 text-sm font-semibold text-primary transition hover:bg-[#d7f1ff]"
          >
            Explore Package
          </button>
        </div>
      </div>
    </article>
  )
}

export default PackageCard
