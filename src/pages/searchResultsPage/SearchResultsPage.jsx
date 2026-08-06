import SearchCard from '../../components/SearchCard'
import FilterSection from './sections/FilterSection'
import HotelCardsSection from './sections/HotelCardsSection'

export default function SearchResultsPage() {
  return (
    <section className="pb-10 pt-6">
      <div className="mx-auto container px-4">
        <div className="max-w-6xl mx-auto">
          <SearchCard
            destination="Kaohsiung City, Taiwan"
            checkIn="July 23"
            checkOut="July 24"
            guests="1 Room - 1 adult"
            valueOnly
            compact
            wrapperClassName="max-w-none md:mt-1 md:rounded-2xl"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
          <FilterSection />
          <HotelCardsSection />
        </div>
      </div>
    </section>
  )
}
