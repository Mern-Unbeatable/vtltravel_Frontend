import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hotelService } from '../api/services/hotelService';

export const useHotels = () => {
  return useQuery({
    queryKey: ['hotels'],
    queryFn: async () => {
      const response = await hotelService.getHotels();
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
