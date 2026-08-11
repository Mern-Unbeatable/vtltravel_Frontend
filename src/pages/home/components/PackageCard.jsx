import { IoCalendarOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

const PackageCard = ({ item }) => {
  const navigate = useNavigate()

  return (
    <article
      // onClick={() => navigate(`/home/search/${item.id}`)}
      className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm  hover:cursor-pointer"
    >
      <img
        src={item.image}
        alt={item.title}
        className="h-44 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>

        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
          <IoCalendarOutline className="text-sm" />
          <span>{item.validTill}</span>
        </div>

        <p className="mt-2 line-clamp-2 text-base leading-relaxed text-gray-500">
          {item.description}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm text-gray-400">From</p>
            <p className="text-xl font-bold text-primary">{item.price}</p>
          </div>

          <button
            type="button"
            className="rounded-full bg-[#EAF8FF] px-4 py-2 text-sm font-semibold text-primary transition hover:bg-[#EAF8FF]"
          >
            Explore Package
          </button>
        </div>
      </div>
    </article>
  )
}

export default PackageCard
