import { LuShip } from 'react-icons/lu'

const brands = [
  { id: 1, name: 'HORIZON', color: 'text-sky-700' },
  { id: 2, name: 'Brittany Ferries', color: 'text-blue-800' },
  { id: 3, name: 'Dolphin', color: 'text-blue-600' },
  { id: 4, name: 'OCEANJET', color: 'text-red-600' },
  { id: 5, name: 'FASTFERRY', color: 'text-blue-700' },
  { id: 6, name: 'Sindo Ferry', color: 'text-cyan-600' },
  { id: 7, name: 'MARINA SOUTH FERRIES', color: 'text-gray-800' },
  { id: 8, name: 'Penguin', color: 'text-blue-700' },
  { id: 9, name: 'CITRA INDOMAS', color: 'text-teal-600' },
]

export default function TrustedBySection() {
  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="mx-auto container px-4">
        <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 md:mb-10 md:text-3xl">
          Trusted By Leading Travel Brands
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex h-16 min-w-[120px] items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 shadow-sm sm:min-w-[140px]"
            >
              <LuShip className={`text-lg ${brand.color}`} />
              <span className={`text-xs font-bold tracking-wide ${brand.color}`}>
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
