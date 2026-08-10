import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchCard from "../../components/SearchCard";
import FilterSection from "./sections/FilterSection";
import HotelCardsSection from "./sections/HotelCardsSection";

const SearchResultsPage = () => {
  const [filters, setFilters] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract query parameters from URL
  const destination = searchParams.get("destination") || "Batam, Indonesia";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const rooms = searchParams.get("rooms") || "1";
  const adults = searchParams.get("adults") || "1";
  const children = searchParams.get("children") || "0";

  const handleSearch = (searchData) => {
    setSearchParams({
      destination: searchData.destination,
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut,
      rooms: searchData.rooms,
      adults: searchData.adults,
      children: searchData.children,
    });
  };

  return (
    <section className=" pt-4 md:pt-6 lg:pt-8">
      <div className="mx-auto container px-4">
        <div className="max-w-6xl mx-auto">
          <SearchCard
            destination={destination}
            initialCheckIn={checkIn}
            initialCheckOut={checkOut}
            initialRooms={rooms}
            initialAdults={adults}
            initialChildren={children}
            onSearch={handleSearch}
            compact
            wrapperClassName="max-w-none md:mt-1 md:rounded-2xl"
          />
        </div>

        <div className="mt-4 lg:mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[320px_minmax(0,1fr)]">
          <FilterSection
            onFilterChange={(newFilters) => setFilters(newFilters)}
          />
          <HotelCardsSection filters={filters} />
        </div>
      </div>
    </section>
  );
};

export default SearchResultsPage;
