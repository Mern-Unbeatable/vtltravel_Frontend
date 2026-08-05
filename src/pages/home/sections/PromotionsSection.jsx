const promotions = [
  {
    id: 1,
    bg: 'bg-[#1e5bb8]',
    title: 'Get $2 Off For One Way Ticket',
    details: [
      'Get $2 Off Per Person.',
      'Valid For One Way Ticket.',
      'Promo code - ONEWAY',
    ],
    image:
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    bg: 'bg-[#c62828]',
    title: 'Get $2 Off For One Way Ticket',
    details: [
      'Get $2 Off Per Person.',
      'Valid For One Way Ticket.',
      'Promo code - ONEWAY',
    ],
    image:
      'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    bg: 'bg-[#1e5bb8]',
    title: 'Get $2 Off For One Way Ticket',
    details: [
      'Get $2 Off Per Person.',
      'Valid For One Way Ticket.',
      'Promo code - ONEWAY',
    ],
    image:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
  },
]

function PromotionCard({ promo }) {
  return (
    <article
      className={`relative flex min-h-[180px] overflow-hidden rounded-2xl ${promo.bg} text-white shadow-sm`}
    >
      <div className="relative z-10 flex w-[55%] flex-col justify-center p-5 md:p-6">
        <h3 className="text-lg font-bold leading-snug md:text-xl">{promo.title}</h3>
        <ul className="mt-3 space-y-0.5 text-xs text-white/90 md:text-sm">
          {promo.details.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>

      <div className="relative w-[45%] overflow-hidden bg-sky-200">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.9) 0 12%, transparent 13%), radial-gradient(circle at 70% 20%, rgba(255,255,255,0.8) 0 10%, transparent 11%), radial-gradient(circle at 50% 70%, rgba(255,255,255,0.7) 0 14%, transparent 15%)',
            backgroundColor: '#7ec8e8',
          }}
        />

        <div className="absolute right-3 top-4 w-[78%] rotate-3 overflow-hidden rounded-md border-[3px] border-white bg-white shadow-md">
          <p className="bg-white px-2 py-1 text-center text-[9px] font-bold tracking-wide text-sky-400 uppercase md:text-[10px]">
            Limited Time Only!
          </p>
          <img
            src={promo.image}
            alt="Promotion"
            className="h-24 w-full object-cover md:h-28"
          />
        </div>

        <img
          src="https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=300&q=80"
          alt="Ferry"
          className="absolute bottom-1 left-0 z-10 h-12 w-auto object-contain drop-shadow-md md:h-14"
        />
      </div>
    </article>
  )
}

export default function PromotionsSection() {
  return (
    <section className="mx-auto container px-4 py-8 md:py-12">
      <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
        Ongoing Promotions
      </h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {promotions.map((promo) => (
          <PromotionCard key={promo.id} promo={promo} />
        ))}
      </div>
    </section>
  )
}
