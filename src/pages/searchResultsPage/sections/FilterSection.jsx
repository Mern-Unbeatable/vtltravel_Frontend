const stars = ['5 ★', '4 ★', '3 ★', '1 ★', 'Unclassified ★']
const featuredPackages = [{ name: 'Packages of the Month', count: 1 }]
const bestFor = [
  { name: 'Family-Friendly Getaway', count: 1 },
  { name: "Couple's Getaway", count: 11 },
  { name: 'Honeymoon or Anniversary', count: 2 },
  { name: 'Romantic Escape', count: 5 },
  { name: 'Corporate Retreat', count: 5 },
  { name: 'Friends & Group Getaway', count: 5 },
  { name: 'Luxury Getaway', count: 5 },
  { name: 'Peaceful Nature Retreat', count: 5 },
]
const accommodationStyle = [
  { name: 'Luxury Hotel Room', count: 1 },
  { name: 'Glamping Tent', count: 11 },
  { name: 'Private Pool Villa', count: 2 },
  { name: 'Apartment with In-Room Kitchen', count: 2 },
  { name: 'Connecting Rooms Available', count: 2 },
]
const resortFeatures = [
  { name: 'Beachfront Resort', count: 1 },
  { name: 'Private Beach Access', count: 11 },
  { name: 'Swimming Pool', count: 5 },
  { name: "Kids' Club", count: 5 },
  { name: 'Spa & Wellness Facilities', count: 5 },
  { name: 'Watersport or Lagoon Access', count: 5 },
  { name: 'Complimentary Resort Activities', count: 5 },
  { name: 'Walking Distance to Lagoi Bay & Plaza', count: 5 },
]

const FilterCheckboxRow = ({ label, count }) => {
  return (
    <label className="flex items-center justify-between gap-3 text-xs text-gray-500">
      <span className="flex items-center gap-2">
        <input type="checkbox" className="h-3.5 w-3.5 rounded border-gray-300" />
        {label}
      </span>
      <span>{count}</span>
    </label>
  )
}

const FilterGroup = ({ title, children }) => {
  return (
    <div className="mt-5 border-t border-gray-100 pt-4">
      <p className="text-sm font-semibold text-gray-700">{title}</p>
      <div className="mt-3 space-y-2.5">{children}</div>
    </div>
  )
}

const FilterSection = () => {
  return (
    <aside className="">
      <h3 className="text-3xl font-semibold text-slate-900">Filter</h3>

      <div className="mt-4 border-t border-gray-100 pt-4">
        <p className="text-sm font-semibold text-gray-700">Budget</p>
        <p className="mt-1 text-xs text-gray-400">Price for 1 night - 1 room, 1 adult.</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <p className="mb-1 text-[10px] font-semibold text-gray-400 uppercase">Minimum</p>
            <input
              type="text"
              value="$48"
              readOnly
              className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs text-gray-600"
            />
          </div>
          <div>
            <p className="mb-1 text-[10px] font-semibold text-gray-400 uppercase">Maximum</p>
            <input
              type="text"
              value="$466"
              readOnly
              className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs text-gray-600"
            />
          </div>
        </div>
        <div className="mt-3">
          <input type="range" min="48" max="466" value="180" readOnly className="w-full accent-primary" />
        </div>
      </div>

      <div className="mt-5 border-t border-gray-100 pt-4">
        <p className="text-sm font-semibold text-gray-700">Stars</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {stars.map((item) => (
            <button
              key={item}
              type="button"
              className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <FilterGroup title="Featured Packages">
        {featuredPackages.map((item) => (
          <FilterCheckboxRow key={item.name} label={item.name} count={item.count} />
        ))}
      </FilterGroup>

      <FilterGroup title="Best For">
        {bestFor.map((item) => (
          <FilterCheckboxRow key={item.name} label={item.name} count={item.count} />
        ))}
      </FilterGroup>

      <FilterGroup title="Accommodation Style">
        {accommodationStyle.map((item) => (
          <FilterCheckboxRow key={item.name} label={item.name} count={item.count} />
        ))}
      </FilterGroup>

      <FilterGroup title="Resort Features">
        {resortFeatures.map((item) => (
          <FilterCheckboxRow key={item.name} label={item.name} count={item.count} />
        ))}
      </FilterGroup>

      <div className="mt-5 border-t border-gray-100 pt-4">
        <p className="text-sm font-semibold text-gray-700">Availability</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-500">Show only available hotels</span>
          <button type="button" className="h-5 w-9 rounded-full bg-gray-200 p-0.5">
            <span className="block h-4 w-4 rounded-full bg-slate-700" />
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button type="button" className="text-sm text-gray-500 hover:text-gray-700">
          Clear
        </button>
        <button
          type="button"
          className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white hover:opacity-90"
        >
          Filter
        </button>
      </div>
    </aside>
  )
}

export default FilterSection

