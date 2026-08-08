const initialHotels = [
  {
    id: 1,
    title: 'Holiday Inn Resort Batam',
    stars: '4 ★',
    starNum: 4,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1100&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Holiday Inn Resort Batam is a premier business and leisure resort, offering spacious accommodations, water sports, relaxing spas, and fantastic dining options. Located near the waterfront, it provides the perfect getaway with easy access to major terminals.',
    price: '$87',
    priceNum: 87,
    available: true,
    facilities: ['Free Wi-Fi', 'Swimming Pool', 'Fitness Center', 'Spa', 'Restaurant', 'Bar', 'Room Service'],
    rooms: [
      {
        id: 1,
        name: 'SUPERIOR ROOM, 1 King Size Bed, City View',
        bedInfo: '1 King size bed(s)',
        capacity: '3 pers. max',
        size: '32m²',
        tags: ['City View', 'Bathtub/shower combination', 'Rainfall shower experience'],
        memberRate: true,
        price: '$87.00',
        publicRate: '$95.00',
        taxes: '$12.00',
        roomsLeft: 'Only 1 room left',
        image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 2,
        name: 'DELUXE SUITE, 1 King Size Bed, Ocean View',
        bedInfo: '1 King size bed(s)',
        capacity: '3 pers. max',
        size: '48m²',
        tags: ['Ocean View', 'Private Balcony', 'Executive Lounge Access'],
        memberRate: true,
        price: '$125.00',
        publicRate: '$140.00',
        taxes: '$18.00',
        roomsLeft: '2 rooms left',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      }
    ]
  },
  {
    id: 2,
    title: 'Montigo Resorts Nongsa',
    stars: '5 ★',
    starNum: 5,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1100&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Offering upscale seafront villas, Montigo Resorts Nongsa provides luxurious accommodation with private pools, gorgeous sunset views, and award-winning dining options.',
    price: '$165',
    priceNum: 165,
    available: true,
    facilities: ['Free Wi-Fi', 'Swimming Pool', 'Private Pool', 'Fitness Center', 'Spa', 'Beach Access', 'Kids Club'],
    rooms: [
      {
        id: 1,
        name: 'DELUXE 2-BEDROOM VILLA, Sea View',
        bedInfo: '1 King and 2 Single beds',
        capacity: '5 pers. max',
        size: '110m²',
        tags: ['Sea View', 'Private Pool', 'Kitchenette'],
        memberRate: true,
        price: '$165.00',
        publicRate: '$190.00',
        taxes: '$25.00',
        roomsLeft: 'Only 2 rooms left',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      }
    ]
  },
  {
    id: 3,
    title: 'Harris Resort Barelang Batam',
    stars: '4 ★',
    starNum: 4,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1100&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Overlooking the iconic Barelang Bridge, Harris Resort Barelang Batam offers a vibrant and active atmosphere, complete with giant swimming pools, beach club, and kid-friendly attractions.',
    price: '$110',
    priceNum: 110,
    available: true,
    facilities: ['Free Wi-Fi', 'Giant Swimming Pools', 'Beach Club', 'Fitness Center', 'Kids Playground', 'Spa'],
    rooms: [
      {
        id: 1,
        name: 'HARRIS ROOM, Garden View',
        bedInfo: '1 King or 2 Twin beds',
        capacity: '3 pers. max',
        size: '35m²',
        tags: ['Garden View', 'Day Bed', 'Modern Amenities'],
        memberRate: true,
        price: '$110.00',
        publicRate: '$125.00',
        taxes: '$15.00',
        roomsLeft: '3 rooms left',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      }
    ]
  },
  {
    id: 4,
    title: 'Batam View Beach Resort',
    stars: '3 ★',
    starNum: 3,
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1100&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Set on a hill overlooking the Singapore Straits, Batam View Beach Resort provides a blend of nature and comfort, featuring a private beach and marine sports center.',
    price: '$65',
    priceNum: 65,
    available: false,
    facilities: ['Free Wi-Fi', 'Swimming Pool', 'Private Beach', 'Marine Sports', 'Tennis Courts', 'Restaurant'],
    rooms: [
      {
        id: 1,
        name: 'STANDARD ROOM, Sea Breeze',
        bedInfo: '2 Twin beds',
        capacity: '2 pers. max',
        size: '28m²',
        tags: ['Sea Breeze', 'Shower', 'Air Conditioning'],
        memberRate: true,
        price: '$65.00',
        publicRate: '$75.00',
        taxes: '$10.00',
        roomsLeft: '0 rooms left',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
      }
    ]
  },
  {
    id: 5,
    title: 'Radisson Golf & Convention Center Batam',
    stars: '5 ★',
    starNum: 5,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1100&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'A 5-star luxury experience situated adjacent to the Sukajadi championship golf course, featuring modern layouts, indoor heated pool, full service spa, and executive services.',
    price: '$210',
    priceNum: 210,
    available: true,
    facilities: ['Free Wi-Fi', 'Indoor Heated Pool', 'Outdoor Infinity Pool', 'Golf Course Access', 'Fitness Center', 'Kids Club'],
    rooms: [
      {
        id: 1,
        name: 'EXECUTIVE ROOM, Golf Course View',
        bedInfo: '1 King size bed',
        capacity: '3 pers. max',
        size: '42m²',
        tags: ['Golf Course View', 'Bathtub', 'Executive Lounge Access'],
        memberRate: true,
        price: '$210.00',
        publicRate: '$230.00',
        taxes: '$30.00',
        roomsLeft: '5 rooms left',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      }
    ]
  }
];

export const getHotels = () => {
  const stored = localStorage.getItem('vtltravel_hotels');
  if (!stored) {
    localStorage.setItem('vtltravel_hotels', JSON.stringify(initialHotels));
    return initialHotels;
  }
  return JSON.parse(stored);
};

export const saveHotels = (hotels) => {
  localStorage.setItem('vtltravel_hotels', JSON.stringify(hotels));
};

export const getHotelById = (id) => {
  const hotels = getHotels();
  return hotels.find(h => h.id === Number(id));
};

export const addHotel = (hotel) => {
  const hotels = getHotels();
  const newHotel = {
    ...hotel,
    id: hotels.length > 0 ? Math.max(...hotels.map(h => h.id)) + 1 : 1,
  };
  hotels.push(newHotel);
  saveHotels(hotels);
  return newHotel;
};

export const updateHotel = (id, updatedHotel) => {
  const hotels = getHotels();
  const index = hotels.findIndex(h => h.id === Number(id));
  if (index !== -1) {
    hotels[index] = { ...hotels[index], ...updatedHotel, id: Number(id) };
    saveHotels(hotels);
    return hotels[index];
  }
  return null;
};

export const deleteHotel = (id) => {
  const hotels = getHotels();
  const filtered = hotels.filter(h => h.id !== Number(id));
  saveHotels(filtered);
};
