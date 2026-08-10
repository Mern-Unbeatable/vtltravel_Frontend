import { api } from '../apiMethods';
import { API_ENDPOINTS } from '../endpoints';

export const hotelService = {
  getHotels: async () => {
    return api.get(API_ENDPOINTS.HOTELS);
  },

  getHotelById: async (id) => {
    return api.get(API_ENDPOINTS.HOTEL_DETAILS(id));
  },

  addHotel: async (hotelData) => {
    return api.post(API_ENDPOINTS.HOTELS, hotelData);
  },

  updateHotel: async (id, hotelData) => {
    return api.put(API_ENDPOINTS.HOTEL_DETAILS(id), hotelData);
  },

  deleteHotel: async (id) => {
    return api.delete(API_ENDPOINTS.HOTEL_DETAILS(id));
  },
};

export default hotelService;
