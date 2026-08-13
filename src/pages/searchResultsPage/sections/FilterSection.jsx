import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { IoFilterOutline, IoCloseOutline } from "react-icons/io5";
import { useHotelFilterFacets } from "../../../hooks/useHotels";
import { compactParams } from "../../../utils/hotelSearchParams";

const starsList = ["5 ★", "4 ★", "3 ★", "1 ★", "Unclassified ★"];

const featuredPackages = [{ name: "Packages of the Month", count: 1 }];

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
  );
};

const FilterGroup = ({ title, children }) => {
  return (
    <div className="mt-5 border-t border-[#05588E29] pt-4">
      <p className="text-sm font-semibold text-gray-700">{title}</p>
      <div className="mt-3 space-y-2.5">{children}</div>
    </div>
  );
};

const FilterSection = ({ onFilterChange, onResetAll }) => {
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const facetParams = useMemo(
    () =>
      compactParams({
        location: searchParams.get("location") || undefined,
        q: searchParams.get("q") || undefined,
        checkIn: searchParams.get("checkIn") || undefined,
        checkOut: searchParams.get("checkOut") || undefined,
        adults: searchParams.get("adults") || undefined,
        rooms: searchParams.get("rooms") || undefined,
      }),
    [searchParams],
  );

  const { data: facets, isLoading: isFacetsLoading } =
    useHotelFilterFacets(facetParams);
  const bestFor = facets?.bestFor || [];
  const accommodationStyles = facets?.accommodationStyles || [];
  const resortFeatures = facets?.resortFeatures || [];

  const MIN_PRICE = 48;
  const MAX_PRICE = 466;

  const [minBudget, setMinBudget] = useState(MIN_PRICE);
  const [maxBudget, setMaxBudget] = useState(MAX_PRICE);
  const [selectedStars, setSelectedStars] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const toggleStar = (star) => {
    setSelectedStars((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star],
    );
  };

  const toggleSlug = (setter) => (slug, isChecked) => {
    setter((prev) => {
      if (isChecked) {
        return prev.includes(slug) ? prev : [...prev, slug];
      }
      return prev.filter((item) => item !== slug);
    });
  };

  const handleCheckboxChange = (name, isChecked) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: isChecked,
    }));
  };

  const handleApplyFilter = () => {
    if (onFilterChange) {
      onFilterChange({
        minBudget,
        maxBudget,
        selectedStars,
        selectedOptions,
        selectedTags,
        selectedFacilities,
        selectedStyles,
        onlyAvailable,
      });
    }
    setIsOpen(false);
  };

  const hasSelectedOptions = Object.values(selectedOptions).some(Boolean);
  const hasCreatedFilter =
    minBudget !== MIN_PRICE ||
    maxBudget !== MAX_PRICE ||
    selectedStars.length > 0 ||
    hasSelectedOptions ||
    selectedTags.length > 0 ||
    selectedFacilities.length > 0 ||
    selectedStyles.length > 0 ||
    onlyAvailable;

  const handleClearFilters = () => {
    setMinBudget(MIN_PRICE);
    setMaxBudget(MAX_PRICE);
    setSelectedStars([]);
    setSelectedOptions({});
    setSelectedTags([]);
    setSelectedFacilities([]);
    setSelectedStyles([]);
    setOnlyAvailable(false);
    setIsOpen(false);

    if (onResetAll) {
      onResetAll();
      return;
    }

    if (onFilterChange) {
      onFilterChange(null);
    }
  };

  return (
    <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-240px)] lg:flex lg:flex-col lg:overflow-hidden lg:self-start">
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

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed bottom-0 top-0 left-0 z-[101] w-[300px] bg-white p-6 shadow-2xl transition-transform duration-300 flex flex-col overflow-hidden
          lg:static lg:z-auto lg:w-auto lg:p-0 lg:shadow-none lg:translate-x-0 lg:bg-transparent lg:flex lg:flex-col lg:overflow-hidden lg:h-full lg:w-full
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between lg:hidden mb-4 pb-3 border-b border-[#05588E29] shrink-0">
          <h3 className="text-xl font-bold text-slate-900">Filters</h3>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
          >
            <IoCloseOutline className="text-2xl" />
          </button>
        </div>

     
        <div className="hidden lg:flex items-center justify-between mb-4 pb-3 border-b border-[#05588E29] shrink-0">
          <h3 className="text-xl font-semibold text-slate-900">Filter</h3>
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-sm font-semibold text-primary hover:underline cursor-pointer"
          >
            Reset All
          </button>
        </div>

        {/* Mobile Reset Action */}
        <div className="flex items-center justify-between lg:hidden mb-3 shrink-0">
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-sm font-semibold text-primary hover:underline cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>

        {/* Scrollable Filters Content Area (No Scrollbar) */}
        <div className="flex-1 overflow-y-auto pr-1 pb-6 space-y-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Budget Filter */}
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-800">Budget</p>
              <span className="text-sm font-bold text-primary">
                ${minBudget} - ${maxBudget}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-gray-400">Price for 1 night - 1 room, 1 adult.</p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <p className="mb-1 text-xs font-medium text-[#262626]">Minimum</p>
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-xs text-gray-400">$</span>
                  <input
                    type="number"
                    min={MIN_PRICE}
                    max={maxBudget}
                    value={minBudget}
                    onChange={(e) => setMinBudget(Number(e.target.value))}
                    className="w-full rounded-lg border border-[#05588E29] pl-6 pr-2 py-1.5 text-xs font-semibold text-[#262626] outline-none focus:border-primary bg-white"
                  />
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-[#262626]">Maximum</p>
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-xs text-gray-400">$</span>
                  <input
                    type="number"
                    min={minBudget}
                    max={MAX_PRICE}
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                    className="w-full rounded-lg border border-[#05588E29] pl-6 pr-2 py-1.5 text-xs font-semibold text-[#262626] outline-none focus:border-primary bg-white"
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
          <div className="border-t border-[#05588E29] pt-4">
            <p className="text-xs font-bold text-gray-800">Stars</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {starsList.map((item) => {
                const isSelected = selectedStars.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleStar(item)}
                    className={`rounded-lg border px-3 py-1.5 text-xs transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary text-white shadow-xs font-semibold"
                        : "border-[#05588E29] bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item}
                  </button>
                );
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

          {isFacetsLoading || bestFor.length > 0 ? (
            <FilterGroup title="Best For">
              {isFacetsLoading ? (
                <p className="text-xs text-gray-400">Loading...</p>
              ) : (
                bestFor.map((item) => (
                  <FilterCheckboxRow
                    key={item.slug}
                    label={item.name}
                    count={item.count}
                    checked={selectedTags.includes(item.slug)}
                    onChange={(_, isChecked) =>
                      toggleSlug(setSelectedTags)(item.slug, isChecked)
                    }
                  />
                ))
              )}
            </FilterGroup>
          ) : null}

          {isFacetsLoading || accommodationStyles.length > 0 ? (
            <FilterGroup title="Accommodation Style">
              {isFacetsLoading ? (
                <p className="text-xs text-gray-400">Loading...</p>
              ) : (
                accommodationStyles.map((item) => (
                  <FilterCheckboxRow
                    key={item.slug}
                    label={item.name}
                    count={item.count}
                    checked={selectedStyles.includes(item.slug)}
                    onChange={(_, isChecked) =>
                      toggleSlug(setSelectedStyles)(item.slug, isChecked)
                    }
                  />
                ))
              )}
            </FilterGroup>
          ) : null}

          {isFacetsLoading || resortFeatures.length > 0 ? (
            <FilterGroup title="Resort Features">
              {isFacetsLoading ? (
                <p className="text-xs text-gray-400">Loading...</p>
              ) : (
                resortFeatures.map((item) => (
                  <FilterCheckboxRow
                    key={item.slug}
                    label={item.name}
                    count={item.count}
                    checked={selectedFacilities.includes(item.slug)}
                    onChange={(_, isChecked) =>
                      toggleSlug(setSelectedFacilities)(item.slug, isChecked)
                    }
                  />
                ))
              )}
            </FilterGroup>
          ) : null}

          {/* Availability Toggle */}
          <div className="border-t border-[#05588E29] pt-4">
            <p className="text-xs font-bold text-gray-800">Availability</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs md:text-sm text-gray-600">Show only available hotels</span>
              <button
                type="button"
                onClick={() => setOnlyAvailable((prev) => !prev)}
                className={`relative flex h-6 w-11 items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                  onlyAvailable ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <span
                  className={`h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                    onlyAvailable ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Sticky Actions Footer (Transparent on Desktop) */}
        <div className="mt-auto pt-4 pb-2 border-t border-[#05588E29] flex items-center justify-between bg-white lg:bg-transparent shrink-0">
          {/* <button
            type="button"
            onClick={handleClearFilters}
            className="text-sky-500 hover:text-sky-600 hover:underline text-sm font-semibold cursor-pointer transition-all bg-transparent border-0"
          >
            Clear all
          </button> */}
          <button
            type="button"
            onClick={handleApplyFilter}
            disabled={!hasCreatedFilter}
            className={`rounded-full px-8 py-2.5 text-sm font-semibold shadow-sm transition-all ${
              hasCreatedFilter
                ? "bg-primary text-white hover:bg-primary/90 cursor-pointer active:scale-95"
                : "bg-[#A3A6C5] text-white cursor-not-allowed opacity-80"
            }`}
          >
            Filter
          </button>
        </div>
      </aside>
    </div>
  );
};

export default FilterSection;
