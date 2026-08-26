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

const FEATURED_PACKAGE_OPTIONS = [
  { value: "featured", label: "Packages of the Month" },
  { value: "best-hotel-of-the-month", label: "Best Hotel of the Month" },
  { value: "beachfront-resort", label: "Beachfront Resort" },
  { value: "family-resort", label: "Family Resort" },
];

const collectFeaturedPackages = (hotelData) => {
  if (!hotelData) return [];
  const selected = new Set();

  if (hotelData.isFeatured) selected.add("featured");

  const addByLabelOrSlug = (raw) => {
    if (!raw) return;
    const text = String(
      typeof raw === "string"
        ? raw
        : raw?.slug || raw?.name || raw?.tag?.slug || raw?.tag?.name || "",
    )
      .trim()
      .toLowerCase();
    if (!text) return;

    FEATURED_PACKAGE_OPTIONS.forEach((option) => {
      if (
        text === option.value ||
        text === option.label.toLowerCase() ||
        text.includes(option.label.toLowerCase())
      ) {
        selected.add(option.value);
      }
    });
  };

  (hotelData.featuredPackages || []).forEach(addByLabelOrSlug);
  (hotelData.badges || []).forEach(addByLabelOrSlug);
  (hotelData.highlights || []).forEach(addByLabelOrSlug);
  (hotelData.tags || []).forEach((item) => {
    const tag = item?.tag || item;
    if (
      tag?.category === "featured_package" ||
      FEATURED_PACKAGE_OPTIONS.some((o) => o.value === tag?.slug)
    ) {
      addByLabelOrSlug(tag);
    }
  });

  return Array.from(selected);
};

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

  // Catalog best_for tags options
  const [bestForOptions, setBestForOptions] = useState([]);
  const [allCatalogTags, setAllCatalogTags] = useState([]);

  useEffect(() => {
    setActiveFormTab(tabParam);
  }, [tabParam]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await hotelService.getCatalogTags();
        const tags = response?.data || response || [];
        setAllCatalogTags(tags);
        const filteredTags = tags.filter((t) => t.category === "best_for");
        setBestForOptions(filteredTags);
      } catch (err) {
        console.error("Failed to fetch catalog tags:", err);
      }
    };
    fetchTags();
  }, []);

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
      highlights: "",
      facilities: [],
      gallery: [],
      rooms: [],
      available: true,
      isFeatured: false,
      featuredPackages: [],
      bestFor: [],
      addOns: [],
      reviewScore: "",
      reviewCount: "",
      ratingLabel: "",
    },
  });

  const bestForVal = watch("bestFor") || [];

  const handleBestForChange = (tagId) => {
    const currentValues = Array.isArray(bestForVal)
      ? bestForVal
      : String(bestForVal).split(",").map(s => s.trim()).filter(Boolean);
    const isChecked = currentValues.includes(tagId);
    const updated = isChecked
      ? currentValues.filter((v) => v !== tagId)
      : [...currentValues, tagId];
    setValue("bestFor", updated, { shouldValidate: true });
  };

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
  const addOnsVal = watch("addOns") || [];
  const roomsVal = watch("rooms") || [];
  const availableVal = watch("available");
  const featuredPackagesVal = watch("featuredPackages") || [];

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
        highlights: (() => {
          const raw = hotel.whyBookWithUs || hotel.highlights;
          if (Array.isArray(raw)) {
            return raw
              .map((item) =>
                typeof item === "string"
                  ? item
                  : item?.name || item?.text || item?.title || "",
              )
              .filter(Boolean)
              .join(", ");
          }
          if (typeof raw === "string") return raw;
          return "";
        })(),
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
        featuredPackages: collectFeaturedPackages(hotel),
        bestFor: (hotel.tags || [])
          .map((item) => item?.tag || item)
          .filter((tag) => tag?.category === "best_for")
          .map((tag) => tag?.id || tag?._id)
          .filter(Boolean),
        addOns:
          hotel.addOns && hotel.addOns.length > 0
            ? hotel.addOns.map((a) => ({
                id: a.id || a.addOn?.id || "",
                name: a.addOn?.name || a.name || "",
                price: String(a.addOn?.price || a.price || ""),
                minPax: String(a.addOn?.minPax || a.minPax || 1),
                imageUrl: a.addOn?.imageUrl || a.imageUrl || "",
              }))
            : [{ name: "", price: "", minPax: "1", imageUrl: "" }],
        reviewScore:
          hotel.reviewScore !== undefined && hotel.reviewScore !== null
            ? String(hotel.reviewScore)
            : "",
        reviewCount:
          hotel.reviewCount !== undefined && hotel.reviewCount !== null
            ? String(hotel.reviewCount)
            : "",
        ratingLabel: hotel.ratingLabel || "",
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
    // Only treat as update when modal was opened via Edit (editingRoom set).
    // Never use Date.now()/temp ids — that wrongly triggered PUT on Add.
    const editingRoomId = editingRoom?.id || editingRoom?._id || null;
    const isEditingReal =
      Boolean(editingRoom) &&
      Boolean(editingRoomId) &&
      !String(editingRoomId).startsWith("mock-");

    if (!isEditingReal && !activeHotelId) {
      toast.error("Save the hotel first, then add room types.");
      throw new Error("Hotel id is required to add a room.");
    }

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

  const onSubmit = async (data) => {
    // Gather all selected bestFor tag IDs
    const selectedBestForIds = Array.isArray(data.bestFor) ? data.bestFor : [];

    // Map featuredPackages slugs to tag IDs from allCatalogTags
    const selectedFeaturedPackageIds = (data.featuredPackages || [])
      .map((slug) => {
        let tag = allCatalogTags.find((t) => t.slug === slug);
        if (tag) return tag.id;

        const option = FEATURED_PACKAGE_OPTIONS.find((o) => o.value === slug);
        if (option) {
          const matchedTag = allCatalogTags.find(
            (t) =>
              t.name.toLowerCase() === option.label.toLowerCase() ||
              t.slug === option.label.toLowerCase().replace(/\s+/g, "-"),
          );
          if (matchedTag) return matchedTag.id;
        }
        return null;
      })
      .filter(Boolean);

    // Combine into tagIds list
    const tagIds = [...selectedBestForIds, ...selectedFeaturedPackageIds];

    const formData = mapHotelFormToFormData({ ...data, tagIds }, base64ToFile);

    console.log("--- HotelForm whyBookWithUs ---", data.highlights);
    console.log("--- HotelForm submit FormData ---");
    for (const [key, value] of formData.entries()) {
      if (key === "whyBookWithUs" || key === "highlights") {
        console.log(key, value);
      }
    }

    try {
      const response = await onSave?.(formData);
      console.log("--- HotelForm backend response ---", response);
      console.log(
        "--- HotelForm backend whyBookWithUs ---",
        response?.data?.whyBookWithUs ?? response?.whyBookWithUs,
      );
    } catch (err) {
      console.error("--- HotelForm backend error ---", err);
    }
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
              <FormInput
                label="Review Score"
                name="reviewScore"
                type="number"
                step="0.1"
                register={register}
                error={errors.reviewScore}
                placeholder="e.g. 4.1"
              />
              <FormInput
                label="Review Count"
                name="reviewCount"
                type="number"
                register={register}
                error={errors.reviewCount}
                placeholder="e.g. 1250"
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

            {/* Featured Packages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase text-slate-700">
                  Featured Packages
                </label>
                <select
                  value=""
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!value) return;
                    if (featuredPackagesVal.includes(value)) return;
                    const next = [...featuredPackagesVal, value];
                    setValue("featuredPackages", next);
                    setValue("isFeatured", next.includes("featured"));
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="">Select package to add...</option>
                  {FEATURED_PACKAGE_OPTIONS.filter(
                    (option) => !featuredPackagesVal.includes(option.value),
                  ).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {featuredPackagesVal.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {featuredPackagesVal.map((slug) => {
                      const option = FEATURED_PACKAGE_OPTIONS.find(
                        (item) => item.value === slug,
                      );
                      return (
                        <span
                          key={slug}
                          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
                        >
                          {option?.label || slug}
                          <button
                            type="button"
                            onClick={() => {
                              const next = featuredPackagesVal.filter(
                                (item) => item !== slug,
                              );
                              setValue("featuredPackages", next);
                              setValue("isFeatured", next.includes("featured"));
                            }}
                            className="cursor-pointer text-slate-400 hover:text-slate-700"
                            aria-label={`Remove ${option?.label || slug}`}
                          >
                            &times;
                          </button>
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-1.5 text-[11px] text-slate-400">
                    Add Packages of the Month, Best Hotel of the Month,
                    Beachfront Resort, or Family Resort.
                  </p>
                )}
              </div>
            </div>

            {/* Best For (Tags selector) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-3">
                Best For
              </label>
              {bestForOptions.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  {bestForOptions.map((tag) => {
                    const isChecked = Array.isArray(bestForVal)
                      ? bestForVal.includes(tag.id)
                      : String(bestForVal).split(",").map(s => s.trim()).includes(tag.id);
                    return (
                      <label
                        key={tag.id || tag.slug}
                        className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleBestForChange(tag.id)}
                          className="rounded text-primary accent-primary focus:ring-primary"
                        />
                        {tag.name}
                      </label>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">Loading best for tags...</p>
              )}
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
            </div>
            <FormTextarea
              label="Description"
              name="description"
              register={register}
              error={errors.description}
              placeholder="Write details about the hotel features, location advantages, services, etc..."
            />

            <FormTextarea
              label="Hotel Highlights"
              name="highlights"
              register={register}
              error={errors.highlights}
              rows={3}
              placeholder="e.g. Family friendly resort in Sekupang, Beachfront property with direct beach access, Perfect for couples and family getaways"
            />
            <p className="-mt-2 text-[11px] text-slate-400">
              Comma-separated. Posted as{" "}
              <code className="rounded bg-slate-100 px-1">whyBookWithUs</code>{" "}
              (same as Postman form-data).
            </p>
            <FacilitiesSelector
              value={facilitiesVal}
              onChange={(updated) => setValue("facilities", updated)}
            />

            <AddOnOptions
              addOnItems={addOnsVal}
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
