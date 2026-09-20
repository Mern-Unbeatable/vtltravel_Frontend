import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hotelService } from "../api/services/hotelService";
import { compactParams } from "../utils/hotelSearchParams";

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

export const useHotelSuggestions = (enabled = true, query = "") => {
  const searchQuery = String(query || "").trim();

  return useQuery({
    queryKey: ["hotel-suggestions", searchQuery || "catalog"],
    queryFn: async () => {
      // When typing, ask the API by name/location so new hotels aren't missed
      // just because they weren't in the first page of the catalog.
      const response = await hotelService.getHotels(
        searchQuery
          ? { q: searchQuery, page: 1, limit: 50 }
          : { page: 1, limit: 100 },
      );
      return Array.isArray(response?.data?.items) ? response.data.items : [];
    },
    enabled,
    staleTime: searchQuery ? 15_000 : 60_000,
    placeholderData: (previousData) => previousData,
  });
};

export const useHotelFilterFacets = (params = {}) => {
  return useQuery({
    queryKey: ["hotel-filter-facets", params],
    queryFn: async () => {
      const baseParams = compactParams({
        location: params.location,
        q: params.q,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        adults: params.adults,
        rooms: params.rooms,
        children: params.children,
        page: 1,
        limit: 1,
      });

      const getTotal = async (extra = {}) => {
        const response = await hotelService.getHotels({
          ...baseParams,
          ...extra,
          page: 1,
          limit: 1,
        });
        const total = Number(response?.data?.pagination?.total);
        return Number.isFinite(total) ? total : 0;
      };

      const [facilitiesResponse, featuredTotal, starTotals] = await Promise.all([
        hotelService.getCatalogFacilities(),
        getTotal({ isFeatured: true }),
        Promise.all(
          ["5", "4", "3"].map(async (star) => ({
            slug: star,
            name: `${star} ★`,
            count: await getTotal({ starRating: star }),
          })),
        ),
      ]);

      const catalogFacilities = Array.isArray(facilitiesResponse?.data)
        ? facilitiesResponse.data
        : Array.isArray(facilitiesResponse)
          ? facilitiesResponse
          : [];

      const facilityOptions = catalogFacilities.filter((fac) => {
        const slug = String(fac.slug || "").toLowerCase();
        const name = String(fac.name || "")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");
        return slug !== "wifi" && name !== "wifi";
      });

      const featuredTagOptions = [
        {
          name: "Best Hotel of the Month",
          slug: "best-hotel-of-the-month",
        },
        {
          name: "Beachfront Resort",
          slug: "beachfront-resort",
        },
        {
          name: "Family Resort",
          slug: "family-resort",
        },
      ];

      const [facilityTotals, featuredTagTotals] = await Promise.all([
        Promise.all(
          facilityOptions.map(async (fac) => ({
            name: fac.name,
            slug: fac.slug,
            count: await getTotal({ facilities: fac.slug }),
          })),
        ),
        Promise.all(
          featuredTagOptions.map(async (tag) => ({
            ...tag,
            count: await getTotal({ tags: tag.slug }),
          })),
        ),
      ]);

      const resortFeatures = facilityTotals.sort(
        (a, b) => b.count - a.count || a.name.localeCompare(b.name),
      );

      return {
        bestFor: [],
        accommodationStyles: [],
        resortFeatures,
        starRatings: starTotals,
        priceRange: { min: 0, max: 0 },
        featuredPackages: [
          {
            name: "Packages of the Month",
            slug: "featured",
            count: featuredTotal,
          },
          ...featuredTagTotals,
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
      queryClient.invalidateQueries({ queryKey: ["hotel-suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["hotel-filter-facets"] });
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
      queryClient.invalidateQueries({ queryKey: ["hotel-suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["hotel-filter-facets"] });
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
      queryClient.invalidateQueries({ queryKey: ["hotel-suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["hotel-filter-facets"] });
    },
  });
};
