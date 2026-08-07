const tours = [
  {
    id: 1,
    title: 'MEETING VENUE',
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'INCENTIVE',
    image:
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'WEDDINGS',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    title: 'EVENTS',
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
  },
]

const TourCard = ({ tour }) => {
  return (
    <article
      className="relative h-64 overflow-hidden bg-gray-800 shadow-md md:h-72"
      style={{
        clipPath: 'polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%)',
        borderRadius: '1rem 1rem 0 0',
      }}
    >
      <img
        src={tour.image}
        alt={tour.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />
      <h3 className="absolute inset-0 flex items-center justify-center px-4 text-center text-lg font-bold tracking-wide text-white uppercase md:text-xl">
        {tour.title}
      </h3>
    </article>
  )
}

const GroupToursSection = () => {
  return (
    <section className="mx-auto container px-4 py-12 md:py-16">
      <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 md:mb-10 md:text-4xl">
        Bintan Group Tours
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </section>
  )
}

export default GroupToursSection
