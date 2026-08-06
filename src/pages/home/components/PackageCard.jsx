import { IoCalendarOutline } from 'react-icons/io5'

export default function PackageCard({ item }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
      <img
        src={item.image}
        alt={item.title}
        className="h-44 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="text-base font-bold text-gray-900">{item.title}</h3>

        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
          <IoCalendarOutline className="text-sm" />
          <span>{item.validTill}</span>
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
          {item.description}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-gray-400">From</p>
            <p className="text-xl font-bold text-primary">{item.price}</p>
          </div>

          <button
            type="button"
            className="rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/15"
          >
            Explore Package
          </button>
        </div>
      </div>
    </article>
  )
}
