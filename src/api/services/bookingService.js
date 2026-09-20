import { api } from '../apiMethods';
import { API_ENDPOINTS } from '../endpoints';

export const bookingService = {
  getBookings: async (params = {}) => {
    return api.get(API_ENDPOINTS.BOOKINGS, { params });
  },

  createBooking: async (payload) => {
    return api.post(API_ENDPOINTS.BOOKINGS, payload);
  },

  confirmPayment: async (bookingRef) => {
    return api.post(API_ENDPOINTS.CONFIRM_PAYMENT(bookingRef));
  },
};

export default bookingService;
