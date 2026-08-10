import { api } from '../apiMethods';
import { API_ENDPOINTS } from '../endpoints';
import Cookies from 'js-cookie';


export const authService = {
  login: async (email, password) => {
    // Real API Call
    console.log('Sending login request to:', API_ENDPOINTS.LOGIN, { email });
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
      console.log('Login API response:', response);
      if (response && response.success && response.data && response.data.token) {
        Cookies.set('admin_token', response.data.token, { expires: 1 });
        localStorage.setItem('isAdminLoggedIn', 'true');
      }
      return response;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },

  logout: () => {
    Cookies.remove('admin_token');
    localStorage.removeItem('isAdminLoggedIn');
  },

  isAuthenticated: () => {
    const token = Cookies.get('admin_token');
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    return !!token && isLoggedIn === 'true';
  },
};

export default authService;
