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

  addRoom: async (hotelId, roomData) => {
    return api.post(`/v1/rooms/hotel/${hotelId}`, roomData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  getRoomById: async (roomId) => {
    return api.get(`/v1/rooms/${roomId}`);
  },

  updateRoom: async (roomId, roomData) => {
    return api.put(`/v1/rooms/${roomId}`, roomData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  deleteRoom: async (roomId) => {
    return api.delete(`/v1/rooms/${roomId}`);
  },

  uploadGalleryImages: async (hotelId, formData) => {
    return api.post(`/v1/hotels/${hotelId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  getRoomCalendar: async (roomId, year, month) => {
    return api.get(`/v1/rooms/${roomId}/calendar`, {
      params: { year, month }
    });
  },

  updateRoomCalendar: async (roomId, payload) => {
    return api.put(`/v1/rooms/${roomId}/calendar`, payload);
  },

  deleteRoomCalendar: async (roomId, payload) => {
    return api.delete(`/v1/rooms/${roomId}/calendar`, { data: payload });
  },
};

export default hotelService;
