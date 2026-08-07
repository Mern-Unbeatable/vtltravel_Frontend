const PromotionCard = ({ promo }) => {
  return (
    <article className="overflow-hidden rounded-2xl shadow-sm transition hover:shadow-md">
      <img
        src={promo.image}
        alt={promo.title || 'Promotion'}
        className="h-auto w-full object-cover"
      />
    </article>
  )
}

export default PromotionCard
