import { useMutation, useQuery } from '@tanstack/react-query';
import { bookingService } from '../api/services/bookingService';

export const useCreateBooking = () => {
  return useMutation({
    mutationFn: (payload) => bookingService.createBooking(payload),
  });
};

export const useConfirmPayment = (bookingRef) => {
  return useQuery({
    queryKey: ['confirm-payment', bookingRef],
    queryFn: () => bookingService.confirmPayment(bookingRef),
    enabled: Boolean(bookingRef),
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};
