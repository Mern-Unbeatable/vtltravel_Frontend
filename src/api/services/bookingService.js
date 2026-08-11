import { api } from '../apiMethods';
import { API_ENDPOINTS } from '../endpoints';

export const bookingService = {
  createBooking: async (payload) => {
    return api.post(API_ENDPOINTS.BOOKINGS, payload);
  },

  confirmPayment: async (bookingRef) => {
    return api.post(API_ENDPOINTS.CONFIRM_PAYMENT(bookingRef));
  },
};

export default bookingService;
