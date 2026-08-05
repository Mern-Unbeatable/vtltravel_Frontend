import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { IoChevronForward } from 'react-icons/io5'

const events = [
  {
    id: 1,
    title: 'Refresh & Recharge with the Wet & Sweet Promo at Mövenpick Bintan',
    image:
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    title: 'Refresh & Recharge with the Wet & Sweet Promo at Mövenpick Bintan',
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    title: 'Refresh & Recharge with the Wet & Sweet Promo at Mövenpick Bintan',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    title: 'Refresh & Recharge with the Wet & Sweet Promo at Mövenpick Bintan',
    image:
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    title: 'Refresh & Recharge with the Wet & Sweet Promo at Mövenpick Bintan',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
  },
]

export default function PromotionEventSection() {
  const scrollerRef = useRef(null)

  const scrollNext = () => {
    if (!scrollerRef.current) return
    scrollerRef.current.scrollBy({ left: 360, behavior: 'smooth' })
  }

  return (
    <section className="mx-auto container px-4 py-12 md:py-16">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
          Promotion & Event
        </h2>
        <Link
          to="/about"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          View ALL
        </Link>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {events.map((event) => (
            <article
              key={event.id}
              className="w-[280px] shrink-0 sm:w-[320px] md:w-[340px]"
            >
              <img
                src={event.image}
                alt={event.title}
                className="h-52 w-full rounded-2xl object-cover sm:h-56"
              />
              <p className="mt-4 text-center text-sm font-semibold leading-snug text-gray-900 md:text-base">
                {event.title}
              </p>
            </article>
          ))}
        </div>

        <button
          type="button"
          onClick={scrollNext}
          aria-label="Next promotions"
          className="absolute top-1/3 right-0 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:opacity-90 md:right-2"
        >
          <IoChevronForward className="text-xl" />
        </button>
      </div>
    </section>
  )
}
