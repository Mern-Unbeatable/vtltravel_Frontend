import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hotelService } from '../api/services/hotelService';
import { buildDestinationSuggestions, buildFilterFacets } from '../utils/hotelSearchParams';

const emptyHotelsResult = {
  items: [],
  pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
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

export const useHotelSuggestions = (query) => {
  const trimmed = (query || '').trim();

  return useQuery({
    queryKey: ['hotel-suggestions', trimmed],
    queryFn: async () => {
      const response = await hotelService.getHotels({ q: trimmed, limit: 12 });
      const items = response?.data?.items || [];
      return buildDestinationSuggestions(items, trimmed);
    },
    enabled: trimmed.length >= 2,
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


export const useHotel = (id) => {
  return useQuery({
    queryKey: ['hotel', id],
    queryFn: async () => {
      const response = await hotelService.getHotelById(id);
      if (response && response.success && response.data) {
        return response.data;
      }
      return response;
    },
    enabled: !!id,
  });
};

export const useAddHotel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newHotel) => hotelService.addHotel(newHotel),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
    },
  });
};

export const useUpdateHotel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, hotelData }) => hotelService.updateHotel(id, hotelData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
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
    },
  });
};
