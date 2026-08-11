import { useSearchParams } from "react-router-dom";
import HotelResultCard from "../components/HotelResultCard";
import { useHotels } from "../../../hooks/useHotels";
import Pagination from "../../../components/Pagination";
import { getNightsBetween } from "../../../utils/hotelSearchParams";

const SORT_LABELS = {
  recommended: "Sorted by recommended for you",
  price_asc: "Sorted by price (low to high)",
  price_desc: "Sorted by price (high to low)",
  rating: "Sorted by guest rating",
  stars: "Sorted by star rating",
};

const HotelCardsSection = ({ filters }) => {
  const [, setSearchParams] = useSearchParams();
  const { data, isLoading, isError } = useHotels(filters || {});

  const hotels = data?.items || [];
  const pagination = data?.pagination || {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  };
  const currentPage = Number(pagination.page || filters?.page || 1);
  const totalPages = Number(pagination.totalPages || 0);
  const totalHotels = Number(pagination.total || hotels.length);
  const nights = getNightsBetween(filters?.checkIn, filters?.checkOut);
  const adults = Number(filters?.adults || 1);
  const rooms = Number(filters?.rooms || 1);
  const sortLabel = SORT_LABELS[filters?.sort] || SORT_LABELS.recommended;

  const handlePageChange = (page) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(page));
      return next;
    });
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
          <div className="space-y-3">
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
