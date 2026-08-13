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
import {
  FormInput,
  FormTextarea,
  FormFileInput,
} from "../../../../components/FormFields";
import { fileToBase64 } from "../../../../utils/fileHelpers";
import { IoArrowBackOutline } from "react-icons/io5";
import { hotelService } from "../../../../api/services/hotelService";
import { toast } from "react-toastify";
import { CgSpinner } from "react-icons/cg";

import {
  availableFacilitiesList,
  GALLERY_CATEGORIES,
  isCategoryMatch,
  getBackendCategoryKey,
  hotelSchema,
} from "./addHotelHelper";

const HotelForm = ({ hotel, onSave, onCancel, isSaving }) => {
  // Room modal sub-states
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [activeGalleryTab, setActiveGalleryTab] = useState("Hotel");
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
      image: "",
      video: "",
      description: "",
      facilities: [],
      gallery: [],
      rooms: [],
      available: true,
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
        addOns:
          hotel.addOns && hotel.addOns.length > 0
            ? hotel.addOns.map((a) => ({
                name: a.addOn?.name || a.name || "",
                price: String(a.addOn?.price || a.price || ""),
              }))
            : [{ name: "", price: "" }],
      });
    }
  }, [hotel, reset]);

  const handleFacilityChange = (facility) => {
    const isChecked = facilitiesVal.includes(facility);
    const updated = isChecked
      ? facilitiesVal.filter((f) => f !== facility)
      : [...facilitiesVal, facility];
    setValue("facilities", updated);
  };

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

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      const promises = files.map((file) =>
        fileToBase64(file, { maxSizeMB: 5 }),
      );
      const base64s = await Promise.all(promises);

      const backendCategory = getBackendCategoryKey(activeGalleryTab);
      const formattedMedia = base64s.map((url) => ({
        url,
        category: backendCategory,
      }));

      setValue("gallery", [...galleryVal, ...formattedMedia]);
      toast.success("Media added to gallery locally!");
    } catch (err) {
      console.error("Gallery upload error:", err);
      toast.error(err?.message || "Failed to load gallery media.");
    }
  };

  const removeGalleryImage = (url) => {
    setValue(
      "gallery",
      galleryVal.filter((img) => img.url !== url),
    );
  };

  // Rooms CRUD within Hotel Form
  const handleSaveRoom = async (savedRoom) => {
    const editingRoomId = editingRoom?.id || editingRoom?._id;
    const isEditingReal = editingRoomId && !String(editingRoomId).startsWith("mock-");

    const formData = new FormData();
    formData.append("name", savedRoom.name);
    
    const slug = savedRoom.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    formData.append("slug", slug);
    formData.append("description", savedRoom.description || "");
    formData.append("pricePerNight", String(savedRoom.price));
    formData.append("basePrice", String(savedRoom.price));
    formData.append("discountPrice", String(Number(savedRoom.price) > 20 ? Number(savedRoom.price) - 20 : savedRoom.price));
    formData.append("taxPerNight", "0");
    
    const sizeLabel = savedRoom.size ? `${savedRoom.size}m²` : "";
    formData.append("roomSize", sizeLabel);
    formData.append("sizeLabel", sizeLabel);
    formData.append("sizeSqm", String(savedRoom.size || 0));
    
    formData.append("bedType", "King");
    formData.append("bedCount", String(savedRoom.bedInfo || 1));
    formData.append("bedInformation", `${savedRoom.bedInfo || 1} King size bed(s)`);
    
    const viewType = savedRoom.tags && savedRoom.tags.length > 0 ? savedRoom.tags[0] : "Ocean View";
    formData.append("viewType", viewType);
    
    formData.append("bathrooms", String(savedRoom.baths || 1));
    formData.append("maxCapacity", String(savedRoom.capacity || 3));
    
    const adults = Number(savedRoom.capacity) > 1 ? Number(savedRoom.capacity) - 1 : 1;
    formData.append("maxAdults", String(adults));
    formData.append("maxChildren", "1");
    formData.append("totalInventory", "5");
    
    const alertLabel = savedRoom.roomsLeft ? `Only ${savedRoom.roomsLeft} rooms left` : "Only 2 rooms left";
    formData.append("roomsLeftAlert", alertLabel);
    
    formData.append("tags", JSON.stringify(savedRoom.tags || []));
    formData.append("amenityIds", JSON.stringify([]));
    
    const amenities = [
      ...(savedRoom.foodBeverage || []),
      ...(savedRoom.bathroom || []),
      ...(savedRoom.mediaTech || []),
      ...(savedRoom.serviceEquipment || [])
    ];
    const amenitySlugs = amenities.map(a => a.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    formData.append("amenitySlugs", JSON.stringify(amenitySlugs));
    
    formData.append("breakfastIncluded", "true");
    formData.append("freeCancellation", "true");
    formData.append("isMemberDeal", "false");
    formData.append("smokingAllowed", "false");
    
    if (savedRoom.imageFiles && savedRoom.imageFiles.length > 0) {
      savedRoom.imageFiles.forEach(file => {
        formData.append("imageUrl", file);
      });
    }

    // Log the request payload entries to console
    console.log("--- POSTING ROOM DATA (FormData Payload) ---");
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`${pair[0]}: File [name: ${pair[1].name}, size: ${pair[1].size} bytes, type: ${pair[1].type}]`);
      } else {
        console.log(`${pair[0]}:`, pair[1]);
      }
    }

    try {
      let response;
      if (isEditingReal) {
        response = await hotelService.updateRoom(editingRoomId, formData);
        console.log("--- ROOM UPDATE API RESPONSE ---", response);
        if (response && response.success) {
          toast.success("Room type updated successfully!");
        } else {
          toast.error(response?.message || "Failed to update room.");
          return;
        }
      } else {
        response = await hotelService.addRoom(activeHotelId, formData);
        console.log("--- ROOM CREATE API RESPONSE ---", response);
        if (response && response.success) {
          toast.success("Room type created successfully!");
        } else {
          toast.error(response?.message || "Failed to create room.");
          return;
        }
      }

      // Update the local state with the returned room object to refresh UI instantly
      const newRoomData = response.data || response.room || response.roomType;
      if (newRoomData) {
        if (isEditingReal) {
          setValue("rooms", roomsVal.map(r => (r.id === editingRoomId || r._id === editingRoomId) ? newRoomData : r));
        } else {
          setValue("rooms", [...roomsVal, newRoomData]);
        }
      } else {
        // Fallback: Reload parent data
        toast.info("Please refresh to see the updated room list.");
      }

    } catch (err) {
      console.error("Error saving room:", err);
      console.error("--- ROOM API ERROR ---", err);
      toast.error(err.message || "Failed to save room details.");
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
    toast.success("Calendar settings updated locally!");
  };

  const onSubmit = (data) => {
    // We will build a FormData object as the backend expects multipart/form-data
    const formData = new FormData();

    // Add textual properties
    formData.append("name", data.title);
    formData.append("starRating", String(data.starNum));
    formData.append("startingPrice", String(data.priceNum));
    formData.append(
      "availabilityStatus",
      data.available ? "AVAILABLE" : "UNAVAILABLE",
    );
    formData.append("description", data.description || "");
    formData.append("location", "Batam");
    formData.append("city", "Batam");
    formData.append("country", "Indonesia");

    // Convert facilities array into a comma-separated slug string (e.g. 'free-wifi,swimming-pool,spa')
    const slugMap = {
      "Free Wi-Fi": "free-wifi",
      "Wi-Fi": "free-wifi",
      "Swimming Pool": "swimming-pool",
      "Giant Swimming Pools": "swimming-pool",
      Spa: "spa",
      Restaurant: "restaurant",
      "Free Parking": "free-parking",
    };
    const slugs = data.facilities
      .map((fac) => slugMap[fac] || fac.toLowerCase().replace(/\s+/g, "-"))
      .join(",");
    formData.append("facilitySlugs", slugs);

    // Convert add-ons to the format [{"name":"Breakfast","price":18}]
    const filteredAddOns = data.addOns
      .filter((a) => a.name && a.name.trim() !== "")
      .map((a) => ({
        name: a.name,
        price: parseFloat(a.price) || 0,
      }));
    formData.append("addOns", JSON.stringify(filteredAddOns));

    // Helper to convert base64 to File
    const base64ToFile = (base64String, filename) => {
      if (!base64String || !base64String.startsWith("data:")) return null;
      try {
        const arr = base64String.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
      } catch (err) {
        console.error("base64ToFile conversion error:", err);
        return null;
      }
    };

    if (data.image) {
      if (data.image.startsWith("data:")) {
        const fileObj = base64ToFile(data.image, "cover_image.png");
        if (fileObj) formData.append("coverImageUrl", fileObj);
      } else {
        formData.append("coverImageUrl", data.image); // URL fallback
      }
    }

    if (data.video) {
      if (data.video.startsWith("data:")) {
        const fileObj = base64ToFile(data.video, "video.mp4");
        if (fileObj) formData.append("videoUrl", fileObj);
      } else {
        formData.append("videoUrl", data.video); // URL fallback
      }
    }

    // Gallery images & videos (dynamically matching Postman keys like imagesHOTEL, imagesROOMS)
    if (data.gallery && data.gallery.length > 0) {
      data.gallery.forEach((img, idx) => {
        const urlStr = img.url;
        const cat = img.category || "Hotel";
        
        // Map category names to uppercase and format (e.g., 'Hotel' -> 'HOTEL', 'Meetings and events' -> 'MEETINGS_AND_EVENTS')
        const catUpper = cat.toUpperCase().replace(/\s+/g, "_");
        const formKey = `images${catUpper}`;
        
        const isVideo = catUpper === "VIDEOS";
        const ext = isVideo ? "mp4" : "png";

        if (urlStr.startsWith("data:")) {
          const fileObj = base64ToFile(
            urlStr,
            `gallery_${catUpper.toLowerCase()}_${idx}.${ext}`,
          );
          if (fileObj) {
            formData.append(formKey, fileObj);
          }
        }
      });
    }

    onSave(formData);
  };

  const onError = (formErrors) => {
    console.error("HotelForm Validation Errors:", formErrors);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
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
            setSearchParams(prev => {
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
            setSearchParams(prev => {
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

            <FormTextarea
              label="Description"
              name="description"
              register={register}
              error={errors.description}
              placeholder="Write details about the hotel features, location advantages, services, etc..."
            />

            {/* Popular Facilities */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-3">
                Popular Facilities
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                {availableFacilitiesList.map((fac) => (
                  <label
                    key={fac}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={facilitiesVal.includes(fac)}
                      onChange={() => handleFacilityChange(fac)}
                      className="rounded text-primary accent-primary focus:ring-primary"
                    />
                    {fac}
                  </label>
                ))}
              </div>
            </div>

            <AddOnOptions
              register={register}
              addOnFields={addOnFields}
              appendAddOn={appendAddOn}
              removeAddOn={removeAddOn}
            />

            {/* Gallery Photos & Videos Category Tab Manager */}
            <div className="border-t border-gray-200 pt-6">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-3">
                Gallery Sections (Categorized)
              </label>

              {/* Horizontal scrollable tab buttons */}
              <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-thin">
                {GALLERY_CATEGORIES.map((cat) => {
                  const count = galleryVal.filter((img) =>
                    isCategoryMatch(img.category, cat),
                  ).length;
                  const isActive =
                    activeGalleryTab.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveGalleryTab(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        isActive
                          ? "bg-primary text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>

              <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      {activeGalleryTab} Gallery
                    </h4>
                    <p className="text-xs text-slate-500">
                      Upload media specific to the {activeGalleryTab} section
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept={
                      activeGalleryTab.toLowerCase() === "videos"
                        ? "video/*"
                        : "image/*"
                    }
                    onChange={handleGalleryUpload}
                    className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                  />
                </div>

                {/* Filtered items display */}
                {galleryVal.filter((img) =>
                  isCategoryMatch(img.category, activeGalleryTab),
                ).length === 0 ? (
                  <div className="text-center py-8 text-xs font-semibold text-slate-400 border border-dashed border-slate-200 rounded-xl bg-white">
                    No items uploaded under {activeGalleryTab} category yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {galleryVal
                      .filter((img) =>
                        isCategoryMatch(img.category, activeGalleryTab),
                      )
                      .map((img, idx) => {
                        const hasVideoExtension =
                          img.url.endsWith(".mp4") ||
                          img.url.endsWith(".mov") ||
                          img.url.startsWith("data:video/") ||
                          (img.category &&
                            img.category.toUpperCase() === "VIDEOS");
                        return (
                          <div
                            key={idx}
                            className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-white"
                          >
                            {hasVideoExtension ? (
                              <video
                                src={img.url}
                                className="w-full h-full object-cover bg-black"
                              />
                            ) : (
                              <img
                                src={img.url}
                                alt={`Gallery ${activeGalleryTab} ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            )}
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(img.url)}
                              className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
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

            {/* Right Side: Interactive rates calendar */}
            <div className="lg:col-span-3 h-full">
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
      {roomDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md border border-gray-200 shadow-xl overflow-hidden p-6 text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Delete Room Type?
            </h3>
            <p className="text-sm text-slate-500">
              Are you sure you want to delete this room type? This action cannot
              be undone.
            </p>
            <div className="flex gap-3 justify-end pt-3">
              <button
                type="button"
                disabled={isDeletingRoom}
                onClick={() => setRoomDeleteId(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-slate-700 hover:bg-gray-50 font-semibold cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingRoom}
                onClick={async () => {
                  setIsDeletingRoom(true);
                  try {
                    setValue(
                      "rooms",
                      roomsVal.filter(
                        (r) => r.id !== roomDeleteId && r._id !== roomDeleteId,
                      ),
                    );
                    toast.success("Room deleted locally!");
                    setRoomDeleteId(null);
                  } catch (err) {
                    console.error("Error deleting room:", err);
                    toast.error("Failed to delete room.");
                  } finally {
                    setIsDeletingRoom(false);
                  }
                }}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeletingRoom ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelForm;
