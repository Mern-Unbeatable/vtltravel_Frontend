import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hotelService } from "../api/services/hotelService";
import {
  buildFilterFacets,
  mergeFilterFacets,
} from "../utils/hotelSearchParams";

const emptyHotelsResult = {
  items: [],
  pagination: { page: 1, limit: 6, total: 0, totalPages: 0 },
};

export const useHotels = (params = {}) => {
  return useQuery({
    queryKey: ["hotels", params],
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
    queryKey: ["hotel-suggestions", "catalog"],
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
    queryKey: ["hotel-filter-facets", params],
    queryFn: async () => {
      const [catalogResponse, scopedResponse, featuredResponse] =
        await Promise.all([
          // Full option catalog (always show all known filters)
          hotelService.getHotels({ page: 1, limit: 100 }),
          // Counts for current search context
          hotelService.getHotels({ ...params, page: 1, limit: 100 }),
          hotelService.getHotels({
            ...params,
            isFeatured: true,
            page: 1,
            limit: 1,
          }),
        ]);

      const scopedHotels = scopedResponse?.data?.items || [];
      const catalogFacets = buildFilterFacets(
        catalogResponse?.data?.items || [],
      );
      const scopedFacets = buildFilterFacets(scopedHotels);
      const merged = mergeFilterFacets(catalogFacets, scopedFacets);

      const featuredTotal = Number(
        featuredResponse?.data?.pagination?.total ??
          featuredResponse?.data?.items?.filter((h) => h?.isFeatured === true)
            ?.length ??
          0,
      );

      const hotelLabelTexts = (hotel) => {
        const fromList = (list) =>
          (list || [])
            .map((item) => {
              if (typeof item === "string") return item;
              return (
                item?.name ||
                item?.tag?.name ||
                item?.facility?.name ||
                item?.slug ||
                ""
              );
            })
            .filter(Boolean);

        return [
          ...fromList(hotel.badges),
          ...fromList(hotel.highlights),
          ...fromList(hotel.tags),
          hotel.accommodationStyle,
          hotel.name,
        ]
          .filter(Boolean)
          .map((text) => String(text).toLowerCase());
      };

      const countHotelsMatching = (needles) =>
        scopedHotels.filter((hotel) => {
          const texts = hotelLabelTexts(hotel);
          return needles.some((needle) =>
            texts.some((text) => text.includes(needle.toLowerCase())),
          );
        }).length;

      return {
        ...merged,
        featuredPackages: [
          {
            name: "Packages of the Month",
            slug: "featured",
            count: Number.isFinite(featuredTotal) ? featuredTotal : 0,
          },
          {
            name: "Best Hotel of the Month",
            slug: "best-hotel-of-the-month",
            count: countHotelsMatching([
              "best hotel of the month",
              "hotel of the month",
            ]),
          },
          {
            name: "Beachfront Resort",
            slug: "beachfront-resort",
            count: countHotelsMatching(["beachfront"]),
          },
          {
            name: "Family Resort",
            slug: "family-resort",
            count: countHotelsMatching([
              "family resort",
              "family favourite",
              "family favorite",
            ]),
          },
        ],
      };
    },
    staleTime: 60_000,
  });
};

export const useAdminHotels = () => {
  return useQuery({
    queryKey: ["admin_hotels"],
    queryFn: async () => {
      const response = await hotelService.getAdminHotels();
      if (
        response &&
        response.success &&
        response.data &&
        Array.isArray(response.data.items)
      ) {
        return response.data.items;
      }
      return Array.isArray(response) ? response : [];
    },
  });
};

export const useHotelImages = (hotelId, enabled = false) => {
  return useQuery({
    queryKey: ["hotel-images", hotelId],
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
    queryKey: ["hotel", id, params],
    queryFn: async () => {
      const response = await hotelService.getHotelById(id, params);
      if (response && response.success && response.data) {
        return response.data;
      }
      return response;
    },
    enabled: !!id,
    staleTime: 0,
    refetchOnMount: "always",
  });
};

export const useHotelRooms = (hotelId, params = {}, enabled = true) => {
  return useQuery({
    queryKey: ["hotel-rooms", hotelId, params],
    queryFn: async () => {
      const response = await hotelService.getRoomsForHotel(hotelId, params);
      const data = response?.data || response;
      // Normalize list shape: array | { items } | { roomTypes }
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.roomTypes)
            ? data.roomTypes
            : [];
      console.log(
        "--- ROOMS API DATA RECEIVED FOR HOTEL ---",
        hotelId,
        params,
        list,
      );
      return list;
    },
    enabled: Boolean(hotelId) && enabled,
    staleTime: 0,
    refetchOnMount: "always",
  });
};

export const useRoom = (roomId, enabled = true) => {
  return useQuery({
    queryKey: ["room", roomId],
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
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      queryClient.invalidateQueries({ queryKey: ["admin_hotels"] });
    },
  });
};

export const useUpdateHotel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, hotelData }) => hotelService.updateHotel(id, hotelData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      queryClient.invalidateQueries({ queryKey: ["admin_hotels"] });
      queryClient.invalidateQueries({ queryKey: ["hotel", variables.id] });
    },
  });
};

export const useDeleteHotel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => hotelService.deleteHotel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      queryClient.invalidateQueries({ queryKey: ["admin_hotels"] });
    },
  });
};
