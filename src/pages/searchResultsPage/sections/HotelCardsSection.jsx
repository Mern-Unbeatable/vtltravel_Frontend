import React from "react";
import HotelResultCard from "../components/HotelResultCard";
import { useHotels } from "../../../hooks/useHotels";

const HotelCardsSection = ({ filters }) => {
  const { data: hotels = [], isLoading, isError } = useHotels();

  if (isLoading) {
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

  const filteredHotels = hotels.filter((hotel) => {
    if (filters) {
      const { minBudget, maxBudget, selectedStars, onlyAvailable } = filters;

      if (minBudget !== undefined && hotel.priceNum < minBudget) return false;
      if (maxBudget !== undefined && hotel.priceNum > maxBudget) return false;

      if (selectedStars && selectedStars.length > 0) {
        const starMatches = selectedStars.some((s) =>
          s.includes(String(hotel.starNum)),
        );
        if (!starMatches) return false;
      }

      if (onlyAvailable && !hotel.available) return false;
    }

    return true;
  });

  return (
    <div>
      <p className="text-sm text-gray-500">
        {filteredHotels.length} hotels available.
      </p>
      <p className="mb-3 text-xs text-gray-400">
        Sorted by recommended for you
      </p>

      {filteredHotels.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
          <p className="text-base font-semibold text-gray-700">
            No hotels match your filters
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Try adjusting your budget range or star rating filters.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHotels.map((hotel) => (
            <HotelResultCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelCardsSection;
