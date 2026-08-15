import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { IoFilterOutline, IoCloseOutline } from "react-icons/io5";
import { useHotelFilterFacets } from "../../../hooks/useHotels";
import { compactParams } from "../../../utils/hotelSearchParams";
import { FilterFacetSkeleton } from "../../../components/skeletons/Skeleton";

const starsList = ["5 ★", "4 ★", "3 ★", "1 ★", "Unclassified ★"];
const MIN_PRICE = 0;
const MAX_PRICE = 1000;

const FilterCheckboxRow = ({ label, count, checked, onChange }) => {
  const safeCount = Number(count);
  const displayCount = Number.isFinite(safeCount) ? safeCount : 0;

  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-gray-600 hover:text-gray-900">
      <span className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(label, e.target.checked)}
          className="h-3.5 w-3.5 cursor-pointer rounded border-[#05588E29] accent-primary"
        />
        <span>{label}</span>
      </span>
      <span className="font-medium text-gray-400">{displayCount}</span>
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
  const featuredPackages = facets?.featuredPackages || [];

  const [minBudget, setMinBudget] = useState(MIN_PRICE);
  const [maxBudget, setMaxBudget] = useState(MAX_PRICE);
  const [selectedStars, setSelectedStars] = useState([]);
  const [isFeatured, setIsFeatured] = useState(
    searchParams.get("isFeatured") === "true",
  );
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const clampBudget = (value) =>
    Math.min(MAX_PRICE, Math.max(MIN_PRICE, Number(value) || 0));

  const handleMinBudgetChange = (raw) => {
    const next = clampBudget(raw);
    setMinBudget(Math.min(next, maxBudget));
  };

  const handleMaxBudgetChange = (raw) => {
    const next = clampBudget(raw);
    setMaxBudget(Math.max(next, minBudget));
  };

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

  const handleApplyFilter = () => {
    if (onFilterChange) {
      onFilterChange({
        minBudget,
        maxBudget,
        selectedStars,
        isFeatured,
        selectedTags,
        selectedFacilities,
        selectedStyles,
        onlyAvailable,
      });
    }
    setIsOpen(false);
  };

  const hasCreatedFilter =
    minBudget !== MIN_PRICE ||
    maxBudget !== MAX_PRICE ||
    selectedStars.length > 0 ||
    isFeatured ||
    selectedTags.length > 0 ||
    selectedFacilities.length > 0 ||
    selectedStyles.length > 0 ||
    onlyAvailable;

  const handleClearFilters = () => {
    setMinBudget(MIN_PRICE);
    setMaxBudget(MAX_PRICE);
    setSelectedStars([]);
    setIsFeatured(false);
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

  const minPercent = ((minBudget - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
  const maxPercent = ((maxBudget - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

  return (
    <div className="lg:sticky lg:top-24 lg:flex lg:h-[calc(100vh-240px)] lg:flex-col lg:self-start lg:overflow-hidden">
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-[#05588E29] bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-95"
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
          fixed bottom-0 top-0 left-0 z-[101] flex w-[300px] flex-col overflow-hidden bg-white p-6 shadow-2xl transition-transform duration-300
          lg:static lg:z-auto lg:h-full lg:w-full lg:translate-x-0 lg:bg-transparent lg:p-0 lg:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="mb-4 flex shrink-0 items-center justify-between border-b border-[#05588E29] pb-3 lg:hidden">
          <h3 className="text-xl font-bold text-slate-900">Filters</h3>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="cursor-pointer rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <IoCloseOutline className="text-2xl" />
          </button>
        </div>

        <div className="mb-4 hidden shrink-0 items-center justify-between border-b border-[#05588E29] pb-3 lg:flex">
          <h3 className="text-xl font-semibold text-slate-900">Filter</h3>
          <button
            type="button"
            onClick={handleClearFilters}
            className="cursor-pointer text-sm font-semibold text-primary hover:underline"
          >
            Reset All
          </button>
        </div>

        <div className="mb-3 flex shrink-0 items-center justify-between lg:hidden">
          <button
            type="button"
            onClick={handleClearFilters}
            className="cursor-pointer text-sm font-semibold text-primary hover:underline"
          >
            Reset All Filters
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto pb-6 pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-800">Budget</p>
              <span className="text-sm font-bold text-primary">
                ${minBudget} - ${maxBudget}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-gray-400">
              Price for 1 night - 1 room, 1 adult.
            </p>

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
                    onChange={(e) => handleMinBudgetChange(e.target.value)}
                    className="w-full rounded-lg border border-[#05588E29] bg-white py-1.5 pl-6 pr-2 text-xs font-semibold text-[#262626] outline-none focus:border-primary"
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
                    onChange={(e) => handleMaxBudgetChange(e.target.value)}
                    className="w-full rounded-lg border border-[#05588E29] bg-white py-1.5 pl-6 pr-2 text-xs font-semibold text-[#262626] outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Dual range slider: drag min/max between $0 – $1000 */}
            <div className="relative mt-5 h-6">
              <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-gray-200" />
              <div
                className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary"
                style={{
                  left: `${minPercent}%`,
                  width: `${Math.max(0, maxPercent - minPercent)}%`,
                }}
              />
              <input
                type="range"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={1}
                value={minBudget}
                onChange={(e) => handleMinBudgetChange(e.target.value)}
                className="pointer-events-none absolute inset-0 z-10 m-0 h-6 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-20 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary active:[&::-webkit-slider-thumb]:cursor-grabbing"
              />
              <input
                type="range"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={1}
                value={maxBudget}
                onChange={(e) => handleMaxBudgetChange(e.target.value)}
                className="pointer-events-none absolute inset-0 z-20 m-0 h-6 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-30 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary active:[&::-webkit-slider-thumb]:cursor-grabbing"
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-gray-400">
              <span>$0</span>
              <span>$1000</span>
            </div>
          </div>

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
                    className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs transition-all ${
                      isSelected
                        ? "border-primary bg-primary font-semibold text-white shadow-xs"
                        : "border-[#05588E29] bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <FilterGroup title="Featured Packages">
            {isFacetsLoading ? (
              <FilterFacetSkeleton rows={1} />
            ) : (
              featuredPackages.map((item) => (
                <FilterCheckboxRow
                  key={item.slug}
                  label={item.name}
                  count={item.count}
                  checked={isFeatured}
                  onChange={(_, checked) => setIsFeatured(checked)}
                />
              ))
            )}
          </FilterGroup>

          <FilterGroup title="Best For">
            {isFacetsLoading ? (
              <FilterFacetSkeleton rows={4} />
            ) : bestFor.length > 0 ? (
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
            ) : (
              <p className="text-xs text-gray-400">No options available yet.</p>
            )}
          </FilterGroup>

          <FilterGroup title="Accommodation Style">
            {isFacetsLoading ? (
              <FilterFacetSkeleton rows={4} />
            ) : accommodationStyles.length > 0 ? (
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
            ) : (
              <p className="text-xs text-gray-400">No options available yet.</p>
            )}
          </FilterGroup>

          <FilterGroup title="Resort Features">
            {isFacetsLoading ? (
              <FilterFacetSkeleton rows={4} />
            ) : resortFeatures.length > 0 ? (
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
            ) : (
              <p className="text-xs text-gray-400">No options available yet.</p>
            )}
          </FilterGroup>

          <div className="border-t border-[#05588E29] pt-4">
            <p className="text-xs font-bold text-gray-800">Availability</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-600 md:text-sm">
                Show only available hotels
              </span>
              <button
                type="button"
                onClick={() => setOnlyAvailable((prev) => !prev)}
                className={`relative flex h-6 w-11 cursor-pointer items-center rounded-full p-0.5 transition-colors ${
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

        <div className="mt-auto flex shrink-0 items-center justify-between border-t border-[#05588E29] bg-white pb-2 pt-4 lg:bg-transparent">
          <button
            type="button"
            onClick={handleApplyFilter}
            disabled={!hasCreatedFilter}
            className={`rounded-full px-8 py-2.5 text-sm font-semibold shadow-sm transition-all ${
              hasCreatedFilter
                ? "cursor-pointer bg-primary text-white hover:bg-primary/90 active:scale-95"
                : "cursor-not-allowed bg-[#A3A6C5] text-white opacity-80"
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
