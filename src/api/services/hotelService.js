import { api } from '../apiMethods';
import { API_ENDPOINTS } from '../endpoints';
import * as localDb from '../../data/db';

// Toggle mock database or real axios endpoint using environment variable
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';

export const hotelService = {
  getHotels: async () => {
    if (USE_MOCK) {
      return localDb.getHotels();
    }
    return api.get(API_ENDPOINTS.HOTELS);
  },

  getHotelById: async (id) => {
    if (USE_MOCK) {
      return localDb.getHotelById(id);
    }
    return api.get(API_ENDPOINTS.HOTEL_DETAILS(id));
  },

  addHotel: async (hotelData) => {
    if (USE_MOCK) {
      return localDb.addHotel(hotelData);
    }
    return api.post(API_ENDPOINTS.HOTELS, hotelData);
  },

  updateHotel: async (id, hotelData) => {
    if (USE_MOCK) {
      return localDb.updateHotel(id, hotelData);
    }
    return api.put(API_ENDPOINTS.HOTEL_DETAILS(id), hotelData);
  },

  deleteHotel: async (id) => {
    if (USE_MOCK) {
      return localDb.deleteHotel(id);
    }
    return api.delete(API_ENDPOINTS.HOTEL_DETAILS(id));
  },
};
export default hotelService;
