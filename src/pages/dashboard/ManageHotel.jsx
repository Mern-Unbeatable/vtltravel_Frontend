import React, { useState } from "react";
import HotelList from "./components/HotelList";
import HotelForm from "./components/HotelForm";
import {
  useHotels,
  useAddHotel,
  useUpdateHotel,
  useDeleteHotel,
} from "../../hooks/useHotels";

const ManageHotel = () => {
  // CMS view state
  const [cmsMode, setCmsMode] = useState("list"); // 'list' | 'add' | 'edit'
  const [editingHotel, setEditingHotel] = useState(null);

  // TanStack Query hooks
  const { data: hotels = [], isLoading, isError } = useHotels();
  const addHotelMutation = useAddHotel();
  const updateHotelMutation = useUpdateHotel();
  const deleteHotelMutation = useDeleteHotel();

  const handleSaveHotel = async (formattedHotel) => {
    try {
      if (cmsMode === "edit" && editingHotel) {
        await updateHotelMutation.mutateAsync({
          id: editingHotel.id,
          hotelData: formattedHotel,
        });
      } else {
        await addHotelMutation.mutateAsync(formattedHotel);
      }
      setCmsMode("list");
      setEditingHotel(null);
    } catch (err) {
      console.error("Error saving hotel:", err);
    }
  };

  const handleEditClick = (hotel) => {
    setEditingHotel(hotel);
    setCmsMode("edit");
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
      {cmsMode === "list" &&
        (isLoading ? (
          <div className="flex justify-center items-center py-16 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <svg
              className="animate-spin h-8 w-8 text-[var(--color-primary)]"
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
            onAddNew={() => setCmsMode("add")}
          />
        ))}
      {(cmsMode === "add" || cmsMode === "edit") && (
        <HotelForm
          hotel={cmsMode === "edit" ? editingHotel : null}
          onSave={handleSaveHotel}
          onCancel={() => {
            setCmsMode("list");
            setEditingHotel(null);
          }}
        />
      )}
    </div>
  );
};

export default ManageHotel;
