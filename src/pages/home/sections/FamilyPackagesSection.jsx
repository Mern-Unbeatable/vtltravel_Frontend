import { Link, useNavigate } from 'react-router-dom'
import PackageCard, { PackageCardSkeleton } from '../components/PackageCard'
import { useHotels } from '../../../hooks/useHotels'

const isSingaporeHotel = (hotel) => {
  const haystack = [hotel.country, hotel.city, hotel.location, hotel.address]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return haystack.includes('singapore')
}

const formatValidTill = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return `Valid Till ${date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`
}

const mapHotelToCard = (hotel) => {
  const priceValue = hotel.fromPrice ?? hotel.startingPrice
  const image =
    hotel.primaryImage ||
    hotel.coverImageUrl ||
    hotel.images?.[0]?.url ||
    ''

  return {
    id: hotel.id || hotel.slug,
    slug: hotel.slug,
    title: hotel.name || '',
    validTill: formatValidTill(hotel.validUntil),
    description: hotel.shortDescription || hotel.description || '',
    price: priceValue !== null && priceValue !== undefined && priceValue !== '' ? `$${priceValue}` : '',
    image,
  }
}

const FamilyPackagesSection = () => {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useHotels({ limit: 12, page: 1 })
  const hotels = data?.items || []

  const packages = [...hotels]
    .sort((a, b) => Number(isSingaporeHotel(b)) - Number(isSingaporeHotel(a)))
    .map(mapHotelToCard)
    .slice(0, 4)

  return (
    <section className="mx-auto container px-4  pb-14 md:pb-16 lg:pb-20">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
          Top Family-Friendly Bintan Packages
        </h2>
        <Link
          to="/home/search"
          className="inline-flex items-center justify-center rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white self-start sm:self-auto"
        >
          View All
        </Link>
      </div>

      {isLoading ? (
        <PackageCardSkeleton count={4} />
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm font-semibold text-red-600">
          Failed to load hotels. Please try again.
        </div>
      ) : packages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          No hotels available right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((item) => (
            <PackageCard
              key={item.id}
              item={item}
              onExplore={() => navigate(`/home/search/${item.slug || item.id}`)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default FamilyPackagesSection
