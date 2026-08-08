import { api } from '../apiMethods';
import { API_ENDPOINTS } from '../endpoints';
import Cookies from 'js-cookie';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';

export const authService = {
  login: async (email, password) => {
    if (USE_MOCK) {
      // Mock Login behaviour
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email === 'admin@vtltravel.com' && password === 'admin123') {
            const mockToken = 'mock_jwt_token_for_admin_portal_123';
            Cookies.set('admin_token', mockToken, { expires: 1 });
            localStorage.setItem('isAdminLoggedIn', 'true');
            resolve({ success: true, token: mockToken });
          } else {
            reject('Invalid email or password. Use the dummy credentials provided.');
          }
        }, 1000);
      });
    }

    // Real API Call
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
      if (response && response.token) {
        Cookies.set('admin_token', response.token, { expires: 1 });
        localStorage.setItem('isAdminLoggedIn', 'true');
      }
      return response;
    } catch (error) {
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
