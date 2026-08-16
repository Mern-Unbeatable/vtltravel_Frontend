import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import HotelList from "./components/HotelList";
import HotelForm from "./components/HotelForm";
import { toast } from "react-toastify";
import { hotelService } from "../../../api/services/hotelService";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import { CgSpinner } from "react-icons/cg";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-16 bg-white border border-gray-200 rounded-2xl shadow-sm">
    <CgSpinner className="animate-spin h-8 w-8 text-primary" />
  </div>
);

const ManageHotel = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const cmsMode = searchParams.get("mode") || "list";
  const hotelId = searchParams.get("id");

  // Backend integration states
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [fetchedHotel, setFetchedHotel] = useState(null);
  const [isFetchingHotel, setIsFetchingHotel] = useState(false);

  // Custom delete modal states
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteResult, setDeleteResult] = useState(null);

  // Fetch hotels list
  const fetchHotels = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await hotelService.getAdminHotels();
      if (
        response &&
        response.success &&
        response.data &&
        response.data.items
      ) {
        setHotels(response.data.items);
      } else {
        setIsError(true);
      }
    } catch (err) {
      console.error("Error fetching hotels:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (cmsMode === "list") {
      fetchHotels();
    }
  }, [cmsMode]);

  // Fetch single hotel details for edit mode
  useEffect(() => {
    const fetchSingleHotel = async () => {
      if (cmsMode === "edit" && hotelId) {
        setIsFetchingHotel(true);
        try {
          const response = await hotelService.getHotelById(hotelId);
          const hotelData = response?.data || response?.hotel || response;
          if (hotelData) {
            setFetchedHotel(hotelData);
          } else {
            toast.error("Failed to load hotel details.");
          }
        } catch (err) {
          console.error("Error loading hotel details:", err);
          toast.error("Failed to load hotel details.");
        } finally {
          setIsFetchingHotel(false);
        }
      } else {
        setFetchedHotel(null);
      }
    };
    fetchSingleHotel();
  }, [cmsMode, hotelId]);

  const handleSaveHotel = async (formData) => {
    setIsSaving(true);

    try {
      let response;
      if (cmsMode === "edit" && hotelId) {
        console.log("--- HOTEL UPDATE REQUEST ---", { hotelId });
        response = await hotelService.updateHotel(hotelId, formData);
        console.log("--- HOTEL UPDATE API RESPONSE ---", response);
        if (response && response.success) {
          toast.success("Hotel details updated successfully!");
          setSearchParams({});
        } else {
          toast.error(response?.message || "Failed to update hotel.");
        }
      } else {
        console.log("--- HOTEL CREATE REQUEST ---");
        response = await hotelService.addHotel(formData);
        console.log("--- HOTEL CREATE API RESPONSE ---", response);
        if (response && response.success) {
          toast.success("Hotel listing created successfully!");
          const newId = response.data?.id || response.data?._id;
          if (newId) {
            setSearchParams({ mode: "edit", id: newId, tab: "calendar" });
          } else {
            setSearchParams({});
          }
        } else {
          toast.error(response?.message || "Failed to save hotel.");
        }
      }
    } catch (err) {
      console.error("Error saving hotel:", err);
      console.error("--- HOTEL API ERROR ---", err);
      toast.error(err.message || "Failed to save hotel.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (hotel) => {
    setSearchParams({ mode: "edit", id: hotel.id || hotel._id });
  };

  const handleCancel = () => {
    setSearchParams({});
  };

  const toggleDeleteModal = (id = null) => {
    setDeleteTargetId(id);
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
          <LoadingSpinner />
        ) : isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600 font-semibold">
            Failed to load hotel listings.
          </div>
        ) : (
          <HotelList
            hotels={hotels}
            onEdit={handleEditClick}
            onDelete={toggleDeleteModal}
            onAddNew={() => setSearchParams({ mode: "add" })}
          />
        ))}

      {(cmsMode === "add" || cmsMode === "edit") &&
        (isFetchingHotel && cmsMode === "edit" ? (
          <LoadingSpinner />
        ) : (
          <HotelForm
            hotel={cmsMode === "edit" ? fetchedHotel : null}
            onSave={handleSaveHotel}
            onCancel={handleCancel}
            isSaving={isSaving}
          />
        ))}

      {/* Premium Deletion Confirmation & Response Modal Component */}
      <ConfirmDeleteModal
        isOpen={!!deleteTargetId}
        isDeleting={isDeleting}
        deleteResult={deleteResult}
        onConfirm={async () => {
          if (!deleteTargetId) return;
          setIsDeleting(true);
          try {
            const response = await hotelService.deleteHotel(deleteTargetId);
            if (response && response.success) {
              setDeleteResult({
                success: true,
                message: response.message,
              });
              fetchHotels();
            } else {
              setDeleteResult({
                success: false,
                message: response.message,
              });
            }
          } catch (err) {
            console.error("Error deleting hotel:", err);
            setDeleteResult({
              success: false,
              message: err.message || "Failed to delete the hotel listing.",
            });
          } finally {
            setIsDeleting(false);
          }
        }}
        onClose={() => toggleDeleteModal(null)}
        title="Delete Hotel Listing?"
        description="Are you sure you want to delete this hotel? All associated room configurations will be permanently removed. This action cannot be undone."
      />
    </div>
  );
};

export default ManageHotel;
