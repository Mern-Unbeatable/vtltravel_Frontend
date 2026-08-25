import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchCard from "../../components/SearchCard";
import FilterSection from "./sections/FilterSection";
import HotelCardsSection from "./sections/HotelCardsSection";
import {
  buildHotelApiParams,
  buildSearchUrlFromCard,
  mapUiFiltersToApi,
} from "../../utils/hotelSearchParams";
import { saveHotelSearch } from "../../utils/hotelSearchStorage";

const SearchResultsPage = () => {
  const [filters, setFilters] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const location = searchParams.get("location") || "";
  const q = searchParams.get("q") || "";
  const destination = location || q || searchParams.get("destination") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const rooms = searchParams.get("rooms") || "1";
  const adults = searchParams.get("adults") || "1";
  const children = searchParams.get("children") || "0";
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "12";
  const sort = searchParams.get("sort") || "recommended";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const starRating = searchParams.get("starRating") || "";
  const tags = searchParams.get("tags") || "";
  const facilities = searchParams.get("facilities") || "";
  const breakfastIncluded = searchParams.get("breakfastIncluded") || "";
  const freeCancellation = searchParams.get("freeCancellation") || "";
  const isFeatured = searchParams.get("isFeatured") || "";

  useEffect(() => {
    if (checkIn || checkOut) {
      saveHotelSearch({
        checkIn,
        checkOut,
        adults,
        rooms,
        children,
        location: destination,
      });
    }
  }, [checkIn, checkOut, adults, rooms, children, destination]);

  const handleSearch = (searchData) => {
    saveHotelSearch(searchData);
    setSearchParams({
      ...mapUiFiltersToApi(filters),
      ...buildSearchUrlFromCard(searchData),
    });
  };

  const handleResetAll = () => {
    setFilters(null);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      [
        "minPrice",
        "maxPrice",
        "starRating",
        "tags",
        "facilities",
        "breakfastIncluded",
        "freeCancellation",
        "isFeatured",
      ].forEach((key) => next.delete(key));
      next.set("page", "1");
      return next;
    });
  };

  const hotelFilters = useMemo(
    () =>
      buildHotelApiParams({
        location,
        q,
        checkIn,
        checkOut,
        adults,
        rooms,
        sort,
        page,
        limit,
        minPrice,
        maxPrice,
        starRating,
        tags,
        facilities,
        breakfastIncluded,
        freeCancellation,
        isFeatured,
        ...mapUiFiltersToApi(filters),
      }),
    [
      location,
      q,
      checkIn,
      checkOut,
      adults,
      rooms,
      sort,
      page,
      limit,
      minPrice,
      maxPrice,
      starRating,
      tags,
      facilities,
      breakfastIncluded,
      freeCancellation,
      isFeatured,
      filters,
    ],
  );

  return (
    <section className=" pt-4 md:pt-6 lg:pt-8">
      <div className="mx-auto container px-4">
        <div className="max-w-6xl mx-auto">
          <SearchCard
            destination={destination}
            initialSearchBy={q && !location ? "hotel" : "location"}
            initialCheckIn={checkIn}
            initialCheckOut={checkOut}
            initialRooms={rooms}
            initialAdults={adults}
            initialChildren={children}
            onSearch={handleSearch}
            compact
            autoSubmit
            wrapperClassName="max-w-none md:mt-1 md:rounded-2xl"
          />
        </div>

        <div className="mt-4 lg:mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[320px_minmax(0,1fr)]">
          <FilterSection
            onResetAll={handleResetAll}
            onFilterChange={(newFilters) => {
              setFilters(newFilters);
              setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                [
                  "minPrice",
                  "maxPrice",
                  "starRating",
                  "tags",
                  "facilities",
                  "breakfastIncluded",
                  "freeCancellation",
                  "isFeatured",
                ].forEach((key) => next.delete(key));
                Object.entries(mapUiFiltersToApi(newFilters)).forEach(
                  ([key, value]) => {
                    next.set(key, value);
                  },
                );
                next.set("page", "1");
                return next;
              });
            }}
          />
          <HotelCardsSection
            filters={hotelFilters}
            searchQuery={destination}
          />
        </div>
      </div>
    </section>
  );
};

export default SearchResultsPage;
