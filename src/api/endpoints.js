export const API_ENDPOINTS = {
  LOGIN: '/v1/auth/admin/login',
  HOTELS: '/hotels',
  HOTEL_DETAILS: (id) => `/hotels/${id}`,
  ROOMS: '/rooms',
};
