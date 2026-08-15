import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hotelService } from '../api/services/hotelService';
import { buildFilterFacets } from '../utils/hotelSearchParams';

const emptyHotelsResult = {
  items: [],
  pagination: { page: 1, limit: 6, total: 0, totalPages: 0 },
};

export const useHotels = (params = {}) => {
  return useQuery({
    queryKey: ['hotels', params],
    queryFn: async () => {
      const response = await hotelService.getHotels(params);
      if (response && response.success && response.data) {
        return {
          items: Array.isArray(response.data.items) ? response.data.items : [],
          pagination: response.data.pagination || emptyHotelsResult.pagination,
        };
      }
      if (Array.isArray(response)) {
        return { items: response, pagination: emptyHotelsResult.pagination };
      }
      return emptyHotelsResult;
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useHotelSuggestions = (enabled = true) => {
  return useQuery({
    queryKey: ['hotel-suggestions', 'catalog'],
    queryFn: async () => {
      const response = await hotelService.getHotels({ limit: 100 });
      return Array.isArray(response?.data?.items) ? response.data.items : [];
    },
    enabled,
    staleTime: 60_000,
    placeholderData: (previousData) => previousData,
  });
};

export const useHotelFilterFacets = (params = {}) => {
  return useQuery({
    queryKey: ['hotel-filter-facets', params],
    queryFn: async () => {
      const response = await hotelService.getHotels({ ...params, page: 1, limit: 100 });
      const items = response?.data?.items || [];
      return buildFilterFacets(items);
    },
    staleTime: 60_000,
  });
};

export const useAdminHotels = () => {
  return useQuery({
    queryKey: ['admin_hotels'],
    queryFn: async () => {
      const response = await hotelService.getAdminHotels();
      if (response && response.success && response.data && Array.isArray(response.data.items)) {
        return response.data.items;
      }
      return Array.isArray(response) ? response : [];
    },
  });
};


export const useHotelImages = (hotelId, enabled = false) => {
  return useQuery({
    queryKey: ['hotel-images', hotelId],
    queryFn: async () => {
      const response = await hotelService.getHotelImages(hotelId);
      const items = response?.data || response;
      return Array.isArray(items) ? items : [];
    },
    enabled: Boolean(hotelId) && enabled,
    staleTime: 60_000,
  });
};

export const useHotel = (id, params = {}) => {
  return useQuery({
    queryKey: ['hotel', id, params],
    queryFn: async () => {
      const response = await hotelService.getHotelById(id, params);
      if (response && response.success && response.data) {
        return response.data;
      }
      return response;
    },
    enabled: !!id,
    placeholderData: (previousData) => previousData,
  });
};

export const useHotelRooms = (hotelId, params = {}, enabled = true) => {
  return useQuery({
    queryKey: ['hotel-rooms', hotelId, params],
    queryFn: async () => {
      const response = await hotelService.getRoomsForHotel(hotelId, params);
      const data = response?.data || response;
      console.log("--- ROOMS API DATA RECEIVED FOR HOTEL ---", hotelId, params, data);
      return data;
    },
    enabled: Boolean(hotelId) && enabled,
    placeholderData: (previousData) => previousData,
  });
};

export const useRoom = (roomId, enabled = true) => {
  return useQuery({
    queryKey: ['room', roomId],
    queryFn: async () => {
      const response = await hotelService.getRoomById(roomId);
      if (response && response.success && response.data) {
        return response.data;
      }
      return response?.data || response;
    },
    enabled: Boolean(roomId) && enabled,
    staleTime: 60_000,
  });
};

export const useAddHotel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newHotel) => hotelService.addHotel(newHotel),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['admin_hotels'] });
    },
  });
};

export const useUpdateHotel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, hotelData }) => hotelService.updateHotel(id, hotelData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['admin_hotels'] });
      queryClient.invalidateQueries({ queryKey: ['hotel', variables.id] });
    },
  });
};

export const useDeleteHotel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => hotelService.deleteHotel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      queryClient.invalidateQueries({ queryKey: ['admin_hotels'] });
    },
  });
};
