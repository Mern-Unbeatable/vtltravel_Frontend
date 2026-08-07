import { Link } from 'react-router-dom'

const glances = [
  {
    id: 1,
    title: 'Spa & Relax',
    image:
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    className: 'md:col-start-1 md:row-start-1',
  },
  {
    id: 2,
    title: 'Nature & Wildlife.',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    className: 'md:col-start-1 md:row-start-2',
  },
  {
    id: 3,
    title: 'Golf',
    image:
      'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=700&q=80',
    className: 'md:col-start-2 md:row-span-2 md:row-start-1 min-h-[280px] md:min-h-full',
  },
  {
    id: 4,
    title: 'Culture & Heritage',
    image:
      'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=800&q=80',
    className: 'md:col-start-3 md:row-start-1',
  },
  {
    id: 5,
    title: 'Food Drink',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
    className: 'md:col-start-3 md:row-start-2',
  },
]

function GlanceCard({ item }) {
  return (
    <article
      className={`relative min-h-45 overflow-hidden rounded-2xl ${item.className}`}
    >
      <img
        src={item.image}
        alt={item.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/35" />
      <h3 className="absolute inset-0 flex items-center justify-center px-4 text-center text-xl font-bold text-white md:text-2xl">
        {item.title}
      </h3>
    </article>
  )
}

export default function BintanGlanceSection() {
  return (
    <section className="mx-auto container px-4 py-12 md:py-16">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
          Bintan at a glance
        </h2>
        <Link
          to="/travel-info"
          className="mt-2 inline-block text-sm text-gray-500 underline underline-offset-4 hover:text-primary"
        >
          Things To Do In Bintan
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2 md:gap-5">
        {glances.map((item) => (
          <GlanceCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
