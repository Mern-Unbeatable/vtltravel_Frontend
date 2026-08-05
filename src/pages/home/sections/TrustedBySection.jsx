const brands = [
  { id: 1, name: 'Horizon', image: '/brand1.png' },
  { id: 2, name: 'Penguin', image: '/brand2.png' },
  { id: 3, name: 'Fast Ferry', image: '/brand4.png' },
  { id: 4, name: 'Sindo Ferry', image: '/brand5.png' },
  { id: 5, name: 'Marina South Ferries', image: '/brand6.png' },
  { id: 6, name: 'Citra Indomas', image: '/brand8.png' },
  { id: 7, name: 'Oceanjet', image: '/brand9.png' },
]

// Repeat so one rail group is always wider than the screen
const railGroup = [...brands, ...brands, ...brands]

function BrandCard({ brand, itemKey }) {
  return (
    <div
      key={itemKey}
      className="flex h-16 w-[130px] shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 shadow-sm sm:h-[72px] sm:w-[140px]"
    >
      <img
        src={brand.image}
        alt={brand.name}
        className="max-h-12 w-auto max-w-full object-contain"
      />
    </div>
  )
}

export default function TrustedBySection() {
  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="mx-auto px-4">
        <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 md:mb-10 md:text-3xl">
          Trusted By Leading Travel Brands
        </h2>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-gray-50 to-transparent md:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-gray-50 to-transparent md:w-20" />

          <div className="brand-rail-track flex items-center gap-3 md:gap-4">
            {railGroup.map((brand, index) => (
              <BrandCard
                key={`a-${brand.id}-${index}`}
                brand={brand}
                itemKey={`a-${brand.id}-${index}`}
              />
            ))}
            {railGroup.map((brand, index) => (
              <BrandCard
                key={`b-${brand.id}-${index}`}
                brand={brand}
                itemKey={`b-${brand.id}-${index}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
