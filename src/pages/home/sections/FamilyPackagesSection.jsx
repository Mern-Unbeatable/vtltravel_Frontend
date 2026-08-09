import { Link } from 'react-router-dom'
import PackageCard from '../components/PackageCard'

const packages = [
  // ... (keep packages unchanged)
  {
    id: 1,
    title: 'Holiday Inn Resort Batam',
    validTill: 'Valid Till Jun 30, 2026',
    description:
      'Holiday Inn Resort Batam is a family-friendly resort in Sekupang with pools, dining, and easy ferry access.',
    price: '$99',
    image:
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Holiday Inn Resort Batam',
    validTill: 'Valid Till Jun 30, 2026',
    description:
      'Holiday Inn Resort Batam is a family-friendly resort in Sekupang with pools, dining, and easy ferry access.',
    price: '$99',
    image:
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Holiday Inn Resort Batam',
    validTill: 'Valid Till Jun 30, 2026',
    description:
      'Holiday Inn Resort Batam is a family-friendly resort in Sekupang with pools, dining, and easy ferry access.',
    price: '$99',
    image:
      'https://images.unsplash.com/photo-1610641818989-c2051b5e2fcb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    title: 'Holiday Inn Resort Batam',
    validTill: 'Valid Till Jun 30, 2026',
    description:
      'Holiday Inn Resort Batam is a family-friendly resort in Sekupang with pools, dining, and easy ferry access.',
    price: '$99',
    image:
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
  },
]

const FamilyPackagesSection = () => {
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {packages.map((item) => (
          <PackageCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}

export default FamilyPackagesSection
