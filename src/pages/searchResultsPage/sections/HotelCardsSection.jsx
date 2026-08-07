import HotelResultCard from '../components/HotelResultCard'

const hotels = [
  {
    id: 1,
    title: 'Holiday Inn Resort Batam',
    stars: '4 Hotels',
    image:
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1100&q=80',
    price: '$87',
  },
  {
    id: 2,
    title: 'Holiday Inn Resort Batam',
    stars: '4 Hotels',
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1100&q=80',
    price: '$87',
  },
  {
    id: 3,
    title: 'Holiday Inn Resort Batam',
    stars: '4 Hotels',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1100&q=80',
    price: '$87',
  },
  {
    id: 4,
    title: 'Holiday Inn Resort Batam',
    stars: '4 Hotels',
    image:
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1100&q=80',
    price: '$87',
  },
]

const HotelCardsSection = () => {
  return (
    <div>
      <p className="text-sm text-gray-500">36 hotels are available.</p>
      <p className="mb-3 text-xs text-gray-400">Sorted by recommended for you</p>
      <div className="space-y-3">
        {hotels.map((hotel) => (
          <HotelResultCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </div>
  )
}

export default HotelCardsSection

