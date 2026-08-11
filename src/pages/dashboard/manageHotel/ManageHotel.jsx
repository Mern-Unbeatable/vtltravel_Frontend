import React, { useState } from "react";
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

  // Custom delete modal states
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteResult, setDeleteResult] = useState(null); // null | { success: boolean, message: string }

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
        const successMsg = response?.message || "Hotel created successfully! You can now add room types and upload gallery images below.";
        toast.success(successMsg, { autoClose: 6000 });
        
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

  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
    setDeleteResult(null);
    setIsDeleting(false);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      const res = await deleteHotelMutation.mutateAsync(deleteTargetId);
      setDeleteResult({
        success: true,
        message: res?.message || "Hotel listing deleted successfully!"
      });
    } catch (err) {
      console.error("Error deleting hotel:", err);
      setDeleteResult({
        success: false,
        message: err?.message || "Failed to delete the hotel listing."
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const closeDeleteModal = () => {
    setDeleteTargetId(null);
    setDeleteResult(null);
    setIsDeleting(false);
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

      {/* Premium Deletion Confirmation & Response Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md border border-gray-200 shadow-xl overflow-hidden p-6 text-center space-y-4">
            {!deleteResult ? (
              <>
                <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Delete Hotel Listing?</h3>
                <p className="text-sm text-slate-500">
                  Are you sure you want to delete this hotel? All associated room configurations will be permanently removed. This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end pt-3">
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={closeDeleteModal}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-slate-700 hover:bg-gray-50 font-semibold cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      "Confirm Delete"
                    )}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${deleteResult.success ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                  {deleteResult.success ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {deleteResult.success ? "Delete Successful" : "Delete Failed"}
                </h3>
                <p className="text-sm text-slate-500">
                  {deleteResult.message}
                </p>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={closeDeleteModal}
                    className="w-full px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageHotel;
