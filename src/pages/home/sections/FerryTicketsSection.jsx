import PackageCard from '../components/PackageCard'

const packages = [
  {
    id: 1,
    title: 'Holiday Inn Resort Batam',
    validTill: 'Valid Till Jun 30, 2026',
    description:
      'Holiday Inn Resort Batam is a family-friendly resort in Sekupang with pools, dining, and easy ferry access.',
    price: '$99',
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Holiday Inn Resort Batam',
    validTill: 'Valid Till Jun 30, 2026',
    description:
      'Holiday Inn Resort Batam is a family-friendly resort in Sekupang with pools, dining, and easy ferry access.',
    price: '$99',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Holiday Inn Resort Batam',
    validTill: 'Valid Till Jun 30, 2026',
    description:
      'Holiday Inn Resort Batam is a family-friendly resort in Sekupang with pools, dining, and easy ferry access.',
    price: '$99',
    image:
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    title: 'Holiday Inn Resort Batam',
    validTill: 'Valid Till Jun 30, 2026',
    description:
      'Holiday Inn Resort Batam is a family-friendly resort in Sekupang with pools, dining, and easy ferry access.',
    price: '$99',
    image:
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
  },
]

export default function FerryTicketsSection() {
  return (
    <section className="mx-auto container px-4 py-10 md:py-14">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
        Ferry Tickets From Singapore To Batam
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {packages.map((item) => (
          <PackageCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
