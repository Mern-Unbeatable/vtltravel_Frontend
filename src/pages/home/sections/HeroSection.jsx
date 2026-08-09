import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoLocationOutline } from 'react-icons/io5'
import SearchCard from '../../../components/SearchCard'

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState('hotel')
  const navigate = useNavigate()

  return (
    <section className="bg-[#f7f8fa] py-14 md:py-16 lg:py-20">
      <div className="mx-auto container px-4">
        <h1 className="text-center text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-[2.75rem]">
          Welcome To Bintan Ferry, Book At The Best Price
        </h1>

        {/* Tabs */}
        <div className="mt-8 flex items-center justify-center gap-8 md:gap-10">
          <button
            type="button"
            onClick={() => setActiveTab('hotel')}
            className={`flex items-center gap-2 border-b-2 pb-2 text-sm font-medium transition ${
              activeTab === 'hotel'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <IoLocationOutline className="text-lg" />
            Which hotel are you looking
          </button>

         
        </div>

        <SearchCard
          destination="Destination, hotel name"
          checkIn="July 23"
          checkOut="July 24"
          guests="1 Room(s) - 1 Guest(s)"
          onSearch={() => navigate('/home/search')}
          wrapperClassName="max-w-7xl rounded-xl md:rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
        />
      </div>
    </section>
  )
}

export default HeroSection
