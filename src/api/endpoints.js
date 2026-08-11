export const API_ENDPOINTS = {
  LOGIN: '/v1/auth/admin/login',
  HOTELS: '/v1/hotels',
  HOTEL_DETAILS: (id) => `/v1/hotels/${id}`,
  ROOMS: '/rooms',
  ADMIN_STATS: '/v1/admin/stats',
  BOOKINGS: '/v1/bookings',
  CONFIRM_PAYMENT: (bookingRef) => `/v1/bookings/ref/${bookingRef}/confirm-payment`,
  ADMIN_HOTELS: '/v1/hotels/admin/list/all',
  PROFILE: '/v1/auth/admin/profile',
};



