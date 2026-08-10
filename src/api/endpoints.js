export const API_ENDPOINTS = {
  LOGIN: '/v1/auth/admin/login',
  HOTELS: '/v1/hotels',
  HOTEL_DETAILS: (id) => `/v1/hotels/${id}`,
  ROOMS: '/rooms',
};
