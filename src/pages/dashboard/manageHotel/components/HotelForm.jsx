import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import RoomFormModal from "./RoomFormModal";
import RoomCalendarContainer from "./RoomCalendarContainer";
import RoomTypesSidebar from "./RoomTypesSidebar";
import AddOnOptions from "./AddOnOptions";
import RoomTypesTable from "./RoomTypesTable";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import {
  FormInput,
  FormTextarea,
  FormFileInput,
} from "../../../../components/FormFields";
import { fileToBase64, base64ToFile } from "../../../../utils/fileHelpers";
import { IoArrowBackOutline } from "react-icons/io5";
import { hotelService } from "../../../../api/services/hotelService";
import { toast } from "react-toastify";
import { CgSpinner } from "react-icons/cg";
import FacilitiesSelector from "./FacilitiesSelector";
import HotelFormGallery from "./HotelFormGallery";

import {
  hotelSchema,
  mapRoomToFormData,
  mapHotelFormToFormData,
} from "./addHotelHelper";

const HotelForm = ({ hotel, onSave, onCancel, isSaving }) => {
  // Room modal sub-states
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomDeleteId, setRoomDeleteId] = useState(null);
  const [isDeletingRoom, setIsDeletingRoom] = useState(false);

  // Calendar modal states
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [calendarRoom, setCalendarRoom] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") || "basic";

  // Form tab states
  const [activeFormTab, setActiveFormTab] = useState(tabParam);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  useEffect(() => {
    setActiveFormTab(tabParam);
  }, [tabParam]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      title: "",
      starNum: 4,
      priceNum: "",
      location: "",
      city: "",
      country: "",
      image: "",
      video: "",
      description: "",
      facilities: [],
      gallery: [],
      rooms: [],
      available: true,
      isFeatured: false,
      addOns: [{ name: "", price: "" }],
    },
  });

  const {
    fields: addOnFields,
    append: appendAddOn,
    remove: removeAddOn,
  } = useFieldArray({
    control,
    name: "addOns",
  });

  const imageVal = watch("image");
  const videoVal = watch("video");
  const galleryVal = watch("gallery") || [];
  const facilitiesVal = watch("facilities") || [];
  const roomsVal = watch("rooms") || [];
  const availableVal = watch("available");
  const isFeaturedVal = watch("isFeatured");

  const activeHotelId = hotel?.id || hotel?._id;

  useEffect(() => {
    if (hotel) {
      // Map API object properties to form properties
      const mappedFacilities = (hotel.facilities || [])
        .map((fac) =>
          typeof fac === "string"
            ? fac
            : fac?.facility?.name || fac?.name || "",
        )
        .filter(Boolean);

      const rawGallery = hotel.gallery || hotel.images || [];
      const mappedGallery = rawGallery
        .map((img) => {
          if (typeof img === "string") {
            const isVideo =
              img.toLowerCase().endsWith(".mp4") ||
              img.toLowerCase().endsWith(".mov");
            return { url: img, category: isVideo ? "Videos" : "Hotel" };
          }
          return {
            url: img.url || img.coverImageUrl || "",
            category: img.category || img.type || "Hotel",
          };
        })
        .filter((img) => img.url);

      reset({
        title: hotel.name || hotel.title || "",
        starNum: hotel.starRating || hotel.starNum || 4,
        priceNum:
          hotel.startingPrice || hotel.priceNum
            ? String(hotel.startingPrice || hotel.priceNum)
            : "",
        location: hotel.location || "",
        city: hotel.city || "",
        country: hotel.country || "",
        image: hotel.coverImageUrl || hotel.image || "",
        video: hotel.videoUrl || hotel.video || "",
        description: hotel.description || "",
        facilities: mappedFacilities,
        gallery: mappedGallery,
        rooms: hotel.rooms || hotel.roomTypes || [],
        available:
          hotel.isActive !== undefined
            ? hotel.isActive
            : hotel.available !== undefined
              ? hotel.available
              : true,
        isFeatured: hotel.isFeatured !== undefined ? hotel.isFeatured : false,
        addOns:
          hotel.addOns && hotel.addOns.length > 0
            ? hotel.addOns.map((a) => ({
                id: a.id || a.addOn?.id || "",
                name: a.addOn?.name || a.name || "",
                price: String(a.addOn?.price || a.price || ""),
              }))
            : [{ name: "", price: "" }],
      });
    }
  }, [hotel, reset]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file, {
          maxSizeMB: 5,
          allowedTypes: ["image/*"],
        });
        setValue("image", base64);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file, {
          maxSizeMB: 20,
          allowedTypes: ["video/*", "image/*"],
        });
        setValue("video", base64);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Rooms CRUD within Hotel Form
  const handleSaveRoom = async (savedRoom) => {
    const editingRoomId = editingRoom?.id || editingRoom?._id;
    const isEditingReal =
      editingRoomId && !String(editingRoomId).startsWith("mock-");

    const formData = mapRoomToFormData(savedRoom);

    try {
      let response;
      if (isEditingReal) {
        response = await hotelService.updateRoom(editingRoomId, formData);
        if (response && response.success) {
          if (response.message) toast.success(response.message);
        } else {
          if (response?.message) toast.error(response.message);
          throw new Error(response?.message || "Failed to update room.");
        }
      } else {
        response = await hotelService.addRoom(activeHotelId, formData);
        if (response && response.success) {
          if (response.message) toast.success(response.message);
        } else {
          if (response?.message) toast.error(response.message);
          throw new Error(response?.message || "Failed to create room.");
        }
      }

      const newRoomData = response.data || response.room || response.roomType;
      if (newRoomData) {
        if (isEditingReal) {
          setValue(
            "rooms",
            roomsVal.map((r) =>
              r.id === editingRoomId || r._id === editingRoomId
                ? newRoomData
                : r,
            ),
          );
        } else {
          setValue("rooms", [...roomsVal, newRoomData]);
        }
      }

      return response;
    } catch (err) {
      if (err?.message) toast.error(err.message);
      throw err;
    }
  };

  const handleEditRoom = (room) => {
    const roomId = room.id || room._id;
    if (!roomId) return;
    const localRoom = roomsVal.find((r) => r.id === roomId || r._id === roomId);
    setEditingRoom(localRoom || room);
    setIsRoomModalOpen(true);
  };

  const handleDeleteRoom = (roomId) => {
    setRoomDeleteId(roomId);
  };

  const handleConfirmDeleteRoom = async () => {
    if (!roomDeleteId) return;
    setIsDeletingRoom(true);
    try {
      const isMock = String(roomDeleteId).startsWith("mock-");
      if (!isMock) {
        const response = await hotelService.deleteRoom(roomDeleteId);
        if (response && response.success) {
          if (response.message) toast.success(response.message);
        } else {
          if (response?.message) toast.error(response.message);
          setIsDeletingRoom(false);
          return;
        }
      }
      setValue(
        "rooms",
        roomsVal.filter((r) => r.id !== roomDeleteId && r._id !== roomDeleteId),
      );
      setRoomDeleteId(null);
    } catch (err) {
      if (err?.message) toast.error(err.message);
    } finally {
      setIsDeletingRoom(false);
    }
  };

  const handleSaveCalendarSettings = (roomId, settings) => {
    setValue(
      "rooms",
      roomsVal.map((r) => {
        if (r.id === roomId || r._id === roomId) {
          return { ...r, calendarSettings: settings };
        }
        return r;
      }),
    );
   
  };

  const onSubmit = (data) => {
    const formData = mapHotelFormToFormData(data, base64ToFile);
    onSave(formData);
  };

  const onError = () => {};

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-5 xl:p-8">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-slate-900 rounded-lg hover:bg-gray-100 cursor-pointer flex items-center justify-center border border-gray-200"
          title="Back to List"
        >
          <IoArrowBackOutline className="text-lg" />
        </button>
        <h2 className="text-xl font-bold text-slate-900">
          {hotel ? `Edit Hotel: ${hotel.title || hotel.name}` : "Add New Hotel"}
        </h2>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          type="button"
          onClick={() => {
            setActiveFormTab("basic");
            setSearchParams((prev) => {
              prev.set("tab", "basic");
              return prev;
            });
          }}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeFormTab === "basic"
              ? "border-slate-900 text-slate-900 font-extrabold"
              : "border-transparent text-gray-400 hover:text-slate-700"
          }`}
        >
          1. Basic Info & Gallery
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveFormTab("calendar");
            setSearchParams((prev) => {
              prev.set("tab", "calendar");
              return prev;
            });
          }}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeFormTab === "calendar"
              ? "border-slate-900 text-slate-900 font-extrabold"
              : "border-transparent text-gray-400 hover:text-slate-700"
          }`}
        >
          2. Room Types & Calendar Rates
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        {activeFormTab === "basic" ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Hotel Title"
                name="title"
                register={register}
                error={errors.title}
                placeholder="e.g. Holiday Inn Resort Batam"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Star Rating
                  </label>
                  <select
                    {...register("starNum", { valueAsNumber: true })}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} Star{num > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <FormInput
                  label="Starting Price ($)"
                  name="priceNum"
                  type="number"
                  register={register}
                  error={errors.priceNum}
                  placeholder="e.g. 87"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
                label="Country"
                name="country"
                register={register}
                error={errors.country}
                placeholder="e.g. Indonesia"
              />
                 <FormInput
                label="City"
                name="city"
                register={register}
                error={errors.city}
                placeholder="e.g. Dhaka"
              />
              <FormInput
                label="Location"
                name="location"
                register={register}
                error={errors.location}
                placeholder="e.g. DHAKA"
              />
           
           
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Main Cover Image */}
              <FormFileInput
                label="Cover Image"
                accept="image/*"
                onChange={handleImageUpload}
                valueText={imageVal}
                error={errors.image}
              />

              {/* Hotel Video */}
              <FormFileInput
                label="Hotel Video"
                accept="video/*,image/*"
                onChange={handleVideoUpload}
                valueText={videoVal}
                error={errors.video}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Availability Status
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-700 font-semibold cursor-pointer">
                    <input
                      type="radio"
                      checked={availableVal === true}
                      onChange={() => setValue("available", true)}
                      className="accent-primary"
                    />
                    Available (Active)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 font-semibold cursor-pointer">
                    <input
                      type="radio"
                      checked={availableVal === false}
                      onChange={() => setValue("available", false)}
                      className="accent-primary"
                    />
                    Fully Booked / Unavailable
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                 Packages of the Month
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-700 font-semibold cursor-pointer">
                    <input
                      type="radio"
                      checked={isFeaturedVal === true}
                      onChange={() => setValue("isFeatured", true)}
                      className="accent-primary"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 font-semibold cursor-pointer">
                    <input
                      type="radio"
                      checked={isFeaturedVal === false}
                      onChange={() => setValue("isFeatured", false)}
                      className="accent-primary"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>

            <FormTextarea
              label="Description"
              name="description"
              register={register}
              error={errors.description}
              placeholder="Write details about the hotel features, location advantages, services, etc..."
            />

            {/* Popular Facilities */}
            <FacilitiesSelector
              value={facilitiesVal}
              onChange={(updated) => setValue("facilities", updated)}
            />

            <AddOnOptions
              register={register}
              addOnFields={addOnFields}
              appendAddOn={appendAddOn}
              removeAddOn={removeAddOn}
            />

            {/* Gallery Photos & Videos Category Tab Manager */}
            <HotelFormGallery
              value={galleryVal}
              onChange={(updated) => setValue("gallery", updated)}
            />
          </>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-5 xl:grid-cols-4 xl:gap-6">
            <RoomTypesSidebar
              roomsVal={roomsVal}
              selectedRoomId={selectedRoomId}
              setSelectedRoomId={setSelectedRoomId}
              onAddRoom={() => {
                setEditingRoom(null);
                setIsRoomModalOpen(true);
              }}
              onEditRoom={handleEditRoom}
              onDeleteRoom={handleDeleteRoom}
            />

            {/* Right Side: Interactive rates calendar (sets shared row height) */}
            <div className="min-w-0 lg:col-auto xl:col-span-3">
              {selectedRoomId &&
              roomsVal.find((r) => (r.id || r._id) === selectedRoomId) ? (
                <RoomCalendarContainer
                  room={roomsVal.find(
                    (r) => (r.id || r._id) === selectedRoomId,
                  )}
                  onSaveSettings={handleSaveCalendarSettings}
                />
              ) : (
                <div className="border border-dashed border-gray-300 rounded-2xl p-12 text-center text-sm text-gray-500 font-semibold bg-gray-50/50 h-full flex items-center justify-center">
                  Please add and select a room type on the left to configure
                  calendar prices.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Global Save and Cancel actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-gray-200 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-lg text-sm text-slate-700 hover:bg-gray-50 font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <CgSpinner className="animate-spin h-4 w-4" />
                Saving...
              </>
            ) : (
              "Save Hotel Details"
            )}
          </button>
        </div>
      </form>

      {/* Room CRUD Modal */}
      <RoomFormModal
        isOpen={isRoomModalOpen}
        onClose={() => {
          setIsRoomModalOpen(false);
          setEditingRoom(null);
        }}
        onSave={handleSaveRoom}
        room={editingRoom}
      />
      {/* Premium Room Deletion Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!roomDeleteId}
        isDeleting={isDeletingRoom}
        onClose={() => setRoomDeleteId(null)}
        onConfirm={handleConfirmDeleteRoom}
        title="Delete Room Type?"
        description="Are you sure you want to delete this room type? This action cannot be undone."
      />
    </div>
  );
};

export default HotelForm;
