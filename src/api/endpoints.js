export const API_ENDPOINTS = {
  LOGIN: '/v1/auth/admin/login',
  HOTELS: '/v1/hotels',
  HOTEL_DETAILS: (id) => `/v1/hotels/${id}`,
  HOTEL_IMAGES: (id) => `/v1/hotels/${id}/images`,
  ROOMS: '/rooms',
  ADMIN_STATS: '/v1/admin/stats',
  BOOKINGS: '/v1/bookings',
  CONFIRM_PAYMENT: (bookingRef) => `/v1/bookings/ref/${bookingRef}/confirm-payment`,
  ADMIN_HOTELS: '/v1/hotels/admin/list/all',
  PROFILE: '/v1/auth/me',
  UPDATE_PASSWORD: '/v1/auth/me/password',
};



