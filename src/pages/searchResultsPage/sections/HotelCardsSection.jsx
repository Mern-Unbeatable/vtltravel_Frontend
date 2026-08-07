import HotelResultCard from '../components/HotelResultCard'

const initialHotels = [
  {
    id: 1,
    title: 'Holiday Inn Resort Batam',
    stars: '4 ★',
    starNum: 4,
    image:
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1100&q=80',
    price: '$87',
    priceNum: 87,
    available: true,
  },
  {
    id: 2,
    title: 'Montigo Resorts Nongsa',
    stars: '5 ★',
    starNum: 5,
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1100&q=80',
    price: '$165',
    priceNum: 165,
    available: true,
  },
  {
    id: 3,
    title: 'Harris Resort Barelang Batam',
    stars: '4 ★',
    starNum: 4,
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1100&q=80',
    price: '$110',
    priceNum: 110,
    available: true,
  },
  {
    id: 4,
    title: 'Batam View Beach Resort',
    stars: '3 ★',
    starNum: 3,
    image:
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1100&q=80',
    price: '$65',
    priceNum: 65,
    available: false,
  },
  {
    id: 5,
    title: 'Radisson Golf & Convention Center Batam',
    stars: '5 ★',
    starNum: 5,
    image:
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1100&q=80',
    price: '$210',
    priceNum: 210,
    available: true,
  },
]

const HotelCardsSection = ({ filters }) => {
  const filteredHotels = initialHotels.filter((hotel) => {
    if (filters) {
      const { minBudget, maxBudget, selectedStars, onlyAvailable } = filters

      if (minBudget !== undefined && hotel.priceNum < minBudget) return false
      if (maxBudget !== undefined && hotel.priceNum > maxBudget) return false

      if (selectedStars && selectedStars.length > 0) {
        const starMatches = selectedStars.some((s) => s.includes(String(hotel.starNum)))
        if (!starMatches) return false
      }

      if (onlyAvailable && !hotel.available) return false
    }

    return true
  })

  return (
    <div>
      <p className="text-sm text-gray-500">{filteredHotels.length} hotels available.</p>
      <p className="mb-3 text-xs text-gray-400">Sorted by recommended for you</p>

      {filteredHotels.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
          <p className="text-base font-semibold text-gray-700">No hotels match your filters</p>
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
  )
}

export default HotelCardsSection
