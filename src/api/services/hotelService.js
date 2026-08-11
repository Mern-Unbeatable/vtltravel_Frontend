import { api } from '../apiMethods';
import { API_ENDPOINTS } from '../endpoints';

export const hotelService = {
  getHotels: async (params = {}) => {
    return api.get(API_ENDPOINTS.HOTELS, { params });
  },

  getAdminHotels: async () => {
    return api.get(API_ENDPOINTS.ADMIN_HOTELS);
  },


  getHotelById: async (id, params = {}) => {
    return api.get(API_ENDPOINTS.HOTEL_DETAILS(id), { params });
  },

  getHotelImages: async (id) => {
    return api.get(API_ENDPOINTS.HOTEL_IMAGES(id));
  },

  addHotel: async (hotelData) => {
    const config = hotelData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } } 
      : {};
    return api.post(API_ENDPOINTS.HOTELS, hotelData, config);
  },

  updateHotel: async (id, hotelData) => {
    const config = hotelData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } } 
      : {};
    return api.put(API_ENDPOINTS.HOTEL_DETAILS(id), hotelData, config);
  },


  deleteHotel: async (id) => {
    return api.delete(API_ENDPOINTS.HOTEL_DETAILS(id));
  },
};

export default hotelService;
