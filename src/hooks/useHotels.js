import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hotelService } from '../api/services/hotelService';

export const useHotels = () => {
  return useQuery({
    queryKey: ['hotels'],
    queryFn: hotelService.getHotels,
  });
};

export const useHotel = (id) => {
  return useQuery({
    queryKey: ['hotel', id],
    queryFn: () => hotelService.getHotelById(id),
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
