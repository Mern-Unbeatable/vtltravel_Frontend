import React from "react";
import { useSearchParams } from "react-router-dom";
import HotelList from "./components/HotelList";
import HotelForm from "./components/HotelForm";
import {
  useAdminHotels,
  useHotel,
  useAddHotel,
  useUpdateHotel,
  useDeleteHotel,
} from "../../../hooks/useHotels";

import { toast } from "react-toastify";

const ManageHotel = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const cmsMode = searchParams.get("mode") || "list"; // 'list' | 'add' | 'edit'
  const hotelId = searchParams.get("id");

  // TanStack Query hooks
  const { data: hotels = [], isLoading, isError } = useAdminHotels();
  const { data: fetchedHotel, isLoading: isFetchingHotel } = useHotel(hotelId);
  
  const addHotelMutation = useAddHotel();
  const updateHotelMutation = useUpdateHotel();
  const deleteHotelMutation = useDeleteHotel();

  const handleSaveHotel = async (formattedHotel) => {
    try {
      if (cmsMode === "edit" && hotelId) {
        const response = await updateHotelMutation.mutateAsync({
          id: hotelId,
          hotelData: formattedHotel,
        });
        const successMsg = response?.message || "Hotel updated successfully!";
        toast.success(successMsg);
        setSearchParams({});
      } else {
        const response = await addHotelMutation.mutateAsync(formattedHotel);
        const successMsg = response?.message || "Hotel created successfully!";
        toast.success(successMsg);
        
        const createdHotel = response?.data || response;
        const newId = createdHotel?.id || createdHotel?._id;
        if (newId) {
          setSearchParams({ mode: "edit", id: newId });
        } else {
          setSearchParams({});
        }
      }
    } catch (err) {
      console.error("Error saving hotel:", err);
      toast.error(err.message || "Failed to save hotel.");
    }
  };

  const handleEditClick = (hotel) => {
    setSearchParams({ mode: "edit", id: hotel.id || hotel._id });
  };

  const handleCancel = () => {
    setSearchParams({});
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this hotel listing?")) {
      try {
        await deleteHotelMutation.mutateAsync(id);
      } catch (err) {
        console.error("Error deleting hotel:", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {cmsMode === "list" && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Manage Hotel Inventory
          </h1>
          <p className="text-gray-500 mt-1">
            Configure and update hotels, rooms, facilities, and galleries.
          </p>
        </div>
      )}
      
      {cmsMode === "list" &&
        (isLoading ? (
          <div className="flex justify-center items-center py-16 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <svg
              className="animate-spin h-8 w-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600 font-semibold">
            Failed to load hotel listings.
          </div>
        ) : (
          <HotelList
            hotels={hotels}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onAddNew={() => setSearchParams({ mode: "add" })}
          />
        ))}
        
      {(cmsMode === "add" || cmsMode === "edit") && (
        isFetchingHotel && cmsMode === "edit" ? (
          <div className="flex justify-center items-center py-16 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : (
          <HotelForm
            hotel={cmsMode === "edit" ? fetchedHotel : null}
            onSave={handleSaveHotel}
            onCancel={handleCancel}
          />
        )
      )}
    </div>
  );
};

export default ManageHotel;
