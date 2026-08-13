import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import HotelResultCard from "../components/HotelResultCard";
import { useHotels } from "../../../hooks/useHotels";
import Pagination from "../../../components/Pagination";
import {
  getNightsBetween,
  rankHotelsForResults,
} from "../../../utils/hotelSearchParams";

const SORT_LABELS = {
  recommended: "Sorted by recommended for you",
  price_asc: "Sorted by price (low to high)",
  price_desc: "Sorted by price (high to low)",
  rating: "Sorted by guest rating",
  stars: "Sorted by star rating",
};

const HotelCardsSection = ({ filters, searchQuery = "" }) => {
  const [, setSearchParams] = useSearchParams();
  const query = String(searchQuery || filters?.q || filters?.location || "").trim();
  const wantsRecommendations = Boolean(query);

  // When searching by name/place, fetch the full catalog (keep other filters)
  // so matched hotels can sit above the remaining recommendations.
  const apiFilters = useMemo(() => {
    if (!wantsRecommendations) return filters || {};

    const next = { ...(filters || {}) };
    delete next.q;
    delete next.location;
    next.page = 1;
    next.limit = 100;
    return next;
  }, [filters, wantsRecommendations]);

  const { data, isLoading, isError, isFetching } = useHotels(apiFilters);

  const pageSize = Number(filters?.limit) || 12;
  const requestedPage = Number(filters?.page) || 1;

  const rankedHotels = useMemo(() => {
    const items = data?.items || [];
    if (!wantsRecommendations) return items;
    return rankHotelsForResults(items, query);
  }, [data?.items, wantsRecommendations, query]);

  const totalHotels = wantsRecommendations
    ? rankedHotels.length
    : Number(data?.pagination?.total || rankedHotels.length);

  const totalPages = wantsRecommendations
    ? Math.max(1, Math.ceil(totalHotels / pageSize))
    : Number(data?.pagination?.totalPages || 0);

  const currentPage = wantsRecommendations
    ? Math.min(requestedPage, totalPages)
    : Number(filters?.page || data?.pagination?.page || 1);

  const hotels = wantsRecommendations
    ? rankedHotels.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : rankedHotels;

  const nights = getNightsBetween(filters?.checkIn, filters?.checkOut);
  const adults = Number(filters?.adults || 1);
  const rooms = Number(filters?.rooms || 1);
  const sortLabel = SORT_LABELS[filters?.sort] || SORT_LABELS.recommended;

  const handlePageChange = (page) => {
    const nextPage = Number(page);
    if (!Number.isFinite(nextPage) || nextPage < 1) return;
    if (totalPages > 0 && nextPage > totalPages) return;

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(nextPage));
      if (!next.get("limit")) next.set("limit", String(pageSize));
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading && hotels.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <svg
          className="animate-spin h-8 w-8 text-primary"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600 font-semibold">
        Failed to load hotels. Please try again.
      </div>
    );
  }

  return (
    <div>
      <p className="text-xl text-gray-500">
        {totalHotels} hotel{totalHotels !== 1 ? "s" : ""} available.
      </p>
      <p className="mb-3 text-base text-gray-400">{sortLabel}</p>

      {hotels.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
          <p className="text-base font-semibold text-gray-700">
            No hotels match your filters
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Try adjusting your destination, dates, or filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            className={`space-y-3 transition-opacity ${
              isFetching ? "opacity-60" : "opacity-100"
            }`}
          >
            {hotels.map((hotel) => (
              <HotelResultCard
                key={hotel.id}
                hotel={hotel}
                nights={nights}
                adults={adults}
                rooms={rooms}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default HotelCardsSection;
