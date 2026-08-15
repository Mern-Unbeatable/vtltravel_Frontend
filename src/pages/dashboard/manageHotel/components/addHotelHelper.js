import * as z from 'zod';

export const availableFacilitiesList = [
  'Free Wi-Fi',
  'Swimming Pool',
  'Private Pool',
  'Fitness Center',
  'Spa',
  'Restaurant',
  'Bar',
  'Room Service',
  'Beach Access',
  'Kids Club',
  'Free Parking'
];

export const GALLERY_CATEGORIES = [
  'Videos',
  'Hotel',
  'Rooms',
  'Suite',
  'Restaurant',
  'Bar',
  'Breakfast',
  'Family',
  'Weddings',
  'Meetings and events',
  'Services',
  'Hotel advantages',
  'Spa',
];

export const categoryMap = {
  'Videos': 'VIDEOS',
  'Hotel': 'HOTEL',
  'Rooms': 'ROOMS',
  'Suite': 'SUITE',
  'Restaurant': 'RESTAURANT',
  'Bar': 'BAR',
  'Breakfast': 'BREAKFAST',
  'Family': 'FAMILY',
  'Weddings': 'WEDDINGS',
  'Meetings and events': 'MEETINGS_AND_EVENTS',
  'Services': 'SERVICES',
  'Hotel advantages': 'HOTEL_ADVANTAGES',
  'Spa': 'SPA'
};

export const getBackendCategoryKey = (uiTab) => {
  return (categoryMap[uiTab] || 'HOTEL').toUpperCase();
};

export const isCategoryMatch = (imgCat, uiTab) => {
  if (!imgCat) return uiTab.toLowerCase() === 'hotel';
  const imgCatUpper = imgCat.toUpperCase();
  const targetCatUpper = getBackendCategoryKey(uiTab);
  return imgCatUpper === targetCatUpper || imgCatUpper === uiTab.toUpperCase();
};

export const hotelSchema = z.object({
  title: z.string().min(1, 'Hotel title is required'),
  starNum: z.number().min(1).max(5),
  priceNum: z.string().min(1, 'Starting price is required'),
  image: z.string().min(1, 'Cover image is required'),
  video: z.string().optional().default(''),
  description: z.string().min(1, 'Description is required'),
  facilities: z.array(z.string()).default([]),
  gallery: z.array(z.object({
    url: z.string(),
    category: z.string()
  })).default([]),
  rooms: z.array(z.any()).default([]),
  available: z.boolean().default(true),
  addOns: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().default(''),
      price: z.string().default(''),
    })
  ).default([]),
});
