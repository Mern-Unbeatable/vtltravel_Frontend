import { useState } from 'react'
import { IoFilterOutline, IoCloseOutline } from 'react-icons/io5'

const starsList = ['5 ★', '4 ★', '3 ★', '1 ★', 'Unclassified ★']

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

const FilterCheckboxRow = ({ label, count, checked, onChange }) => {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-gray-600 hover:text-gray-900">
      <span className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(label, e.target.checked)}
          className="h-3.5 w-3.5 rounded border-[#05588E29] accent-primary cursor-pointer"
        />
        <span>{label}</span>
      </span>
      <span className="text-gray-400 font-medium">{count}</span>
    </label>
  )
}

const FilterGroup = ({ title, children }) => {
  return (
    <div className="mt-5 border-t border-[#05588E29] pt-4">
      <p className="text-sm font-semibold text-gray-700">{title}</p>
      <div className="mt-3 space-y-2.5">{children}</div>
    </div>
  )
}

const FilterSection = ({ onFilterChange }) => {
  // Drawer Open/Close State (Mobile/Tablet)
  const [isOpen, setIsOpen] = useState(false)

  // 1. Budget State
  const MIN_PRICE = 48
  const MAX_PRICE = 466

  const [minBudget, setMinBudget] = useState(MIN_PRICE)
  const [maxBudget, setMaxBudget] = useState(MAX_PRICE)

  // 2. Stars State
  const [selectedStars, setSelectedStars] = useState([])

  // 3. Options Checkbox State
  const [selectedOptions, setSelectedOptions] = useState({})

  // 4. Availability Toggle State
  const [onlyAvailable, setOnlyAvailable] = useState(false)

  const toggleStar = (star) => {
    setSelectedStars((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    )
  }

  const handleCheckboxChange = (name, isChecked) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: isChecked,
    }))
  }

  const handleApplyFilter = () => {
    if (onFilterChange) {
      onFilterChange({
        minBudget,
        maxBudget,
        selectedStars,
        selectedOptions,
        onlyAvailable,
      })
    }
    setIsOpen(false)
  }

  const handleClearFilters = () => {
    setMinBudget(MIN_PRICE)
    setMaxBudget(MAX_PRICE)
    setSelectedStars([])
    setSelectedOptions({})
    setOnlyAvailable(false)
    if (onFilterChange) {
      onFilterChange({
        minBudget: MIN_PRICE,
        maxBudget: MAX_PRICE,
        selectedStars: [],
        selectedOptions: {},
        onlyAvailable: false,
      })
    }
  }

  return (
    <>
      {/* Mobile & Tablet Filter Toggle Button */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-[#05588E29] bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
        >
          <IoFilterOutline className="text-lg text-primary" />
          <span>Filters</span>
        </button>
      </div>

      {/* Dim Overlay backdrop (Mobile/Tablet) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Filter Sidebar / Sliding Drawer */}
      <aside
        className={`
          fixed bottom-0 top-0 left-0 z-[101] w-[300px] bg-white p-6 shadow-2xl transition-transform duration-300 overflow-y-auto flex flex-col justify-between
          lg:static lg:z-auto lg:w-auto lg:p-0 lg:shadow-none lg:translate-x-0 lg:overflow-y-visible lg:flex lg:flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div>
          {/* Mobile/Tablet Header with Close Button */}
          <div className="flex items-center justify-between lg:hidden mb-4 pb-3 border-b border-[#05588E29]">
            <h3 className="text-xl font-bold text-slate-900">Filters</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
              <IoCloseOutline className="text-2xl" />
            </button>
          </div>

          {/* Desktop Title Header */}
          <div className="hidden lg:flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-slate-900">Filter</h3>
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Mobile Reset Action */}
          <div className="flex items-center justify-between lg:hidden mb-3">
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Reset All Filters
            </button>
          </div>

          {/* Budget Filter */}
          <div className="mt-4 border-t border-[#05588E29] pt-4">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold text-gray-800">Budget</p>
              <span className="text-sm font-bold text-primary">
                ${minBudget} - ${maxBudget}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-gray-400">Price for 1 night - 1 room, 1 adult.</p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <p className="mb-1 text-sm font-medium text-[#262626]">Minimum</p>
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-sm text-gray-400">$</span>
                  <input
                    type="number"
                    min={MIN_PRICE}
                    max={maxBudget}
                    value={minBudget}
                    onChange={(e) => setMinBudget(Number(e.target.value))}
                    className="w-full rounded-lg border border-[#05588E29] pl-6 pr-2 py-1.5 text-sm font-medium text-[#262626] outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-[#262626]">Maximum</p>
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-sm text-gray-400">$</span>
                  <input
                    type="number"
                    min={minBudget}
                    max={MAX_PRICE}
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                    className="w-full rounded-lg border border-[#05588E29] pl-6 pr-2 py-1.5 text-sm font-medium text-[#262626] outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="mt-3">
              <input
                type="range"
                min={MIN_PRICE}
                max={MAX_PRICE}
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full cursor-pointer accent-primary"
              />
            </div>
          </div>

          {/* Stars Filter */}
          <div className="mt-5 border-t border-[#05588E29] pt-4">
            <p className="text-sm font-semibold text-gray-800">Stars</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {starsList.map((item) => {
                const isSelected = selectedStars.includes(item)
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleStar(item)}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition-all ${
                      isSelected
                        ? 'border-primary bg-primary text-white shadow-xs font-semibold'
                        : 'border-[#05588E29] bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Checkbox Groups */}
          <FilterGroup title="Featured Packages">
            {featuredPackages.map((item) => (
              <FilterCheckboxRow
                key={item.name}
                label={item.name}
                count={item.count}
                checked={!!selectedOptions[item.name]}
                onChange={handleCheckboxChange}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Best For">
            {bestFor.map((item) => (
              <FilterCheckboxRow
                key={item.name}
                label={item.name}
                count={item.count}
                checked={!!selectedOptions[item.name]}
                onChange={handleCheckboxChange}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Accommodation Style">
            {accommodationStyle.map((item) => (
              <FilterCheckboxRow
                key={item.name}
                label={item.name}
                count={item.count}
                checked={!!selectedOptions[item.name]}
                onChange={handleCheckboxChange}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Resort Features">
            {resortFeatures.map((item) => (
              <FilterCheckboxRow
                key={item.name}
                label={item.name}
                count={item.count}
                checked={!!selectedOptions[item.name]}
                onChange={handleCheckboxChange}
              />
            ))}
          </FilterGroup>

          {/* Availability Toggle */}
          <div className="mt-5 border-t border-[#05588E29] pt-4">
            <p className="text-sm font-semibold text-gray-800">Availability</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">Show only available hotels</span>
              <button
                type="button"
                onClick={() => setOnlyAvailable((prev) => !prev)}
                className={`relative flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${
                  onlyAvailable ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                    onlyAvailable ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center gap-3 border-t border-[#05588E29] pt-4 lg:border-t-0 lg:pt-0">
          <button
            type="button"
            onClick={handleClearFilters}
            className="flex-1 rounded-xl border border-[#05588E29] py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleApplyFilter}
            className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary/90 active:scale-95"
          >
            Apply Filter
          </button>
        </div>
      </aside>
    </>
  )
}

export default FilterSection
