import PromotionCard from '../components/PromotionCard'

const promotions = [
  {
    id: 1,
    title: 'Get $2 Off For One Way Ticket',
    image: '/promo1.png',
  },
  {
    id: 2,
    title: 'Get $2 Off For One Way Ticket',
    image: '/promo2.png',
  },
  {
    id: 3,
    title: 'Get $2 Off For One Way Ticket',
    image: '/promo1.png',
  },
]

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
