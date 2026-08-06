import { Link } from 'react-router-dom'

const resorts = [
  {
    id: 1,
    name: 'Four Points by Sheraton Bintan',
    price: '$99',
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Four Points by Sheraton Bintan',
    price: '$99',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'Four Points by Sheraton Bintan',
    price: '$99',
    image:
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    name: 'Four Points by Sheraton Bintan',
    price: '$99',
    image:
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    name: 'Four Points by Sheraton Bintan',
    price: '$99',
    image:
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    name: 'Four Points by Sheraton Bintan',
    price: '$99',
    image:
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 7,
    name: 'Four Points by Sheraton Bintan',
    price: '$99',
    image:
      'https://images.unsplash.com/photo-1610641818989-c2051b5e2fcb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 8,
    name: 'Four Points by Sheraton Bintan',
    price: '$99',
    image:
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
  },
]

function ResortCard({ resort }) {
  return (
    <article className="rounded-xl border border-[#05588E29] bg-white p-3 shadow-sm transition hover:shadow-md">
      <img
        src={resort.image}
        alt={resort.name}
        className="aspect-[16/10] w-full rounded-xl object-cover"
      />

      <div className="px-1 pt-4 pb-1">
        <h3 className="min-h-[48px] text-base font-bold leading-snug text-gray-900">
          {resort.name}
        </h3>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm text-gray-400">From</p>
            <p className="text-xl font-bold text-primary">{resort.price}</p>
          </div>

          <button
            type="button"
            className="rounded-full bg-[#eef7fc] px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15"
          >
            Check Availability
          </button>
        </div>
      </div>
    </article>
  )
}

export default function ResortsSection() {
  return (
    <section className="mx-auto container px-4 py-10 md:py-14">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Resorts</h2>

        <Link
          to="/destinations"
          className="rounded-full bg-primary px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition hover:opacity-90"
        >
          All Resorts
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {resorts.map((resort) => (
          <ResortCard key={resort.id} resort={resort} />
        ))}
      </div>
    </section>
  )
}
