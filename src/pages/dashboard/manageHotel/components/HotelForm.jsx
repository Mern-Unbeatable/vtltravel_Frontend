import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import RoomFormModal from "./RoomFormModal";

const availableFacilitiesList = [
  "Free Wi-Fi",
  "Swimming Pool",
  "Private Pool",
  "Fitness Center",
  "Spa",
  "Restaurant",
  "Bar",
  "Room Service",
  "Beach Access",
  "Kids Club",
  "Free Parking",
];

const hotelSchema = z.object({
  title: z.string().min(1, "Hotel title is required"),
  starNum: z.number().min(1).max(5),
  priceNum: z.string().min(1, "Starting price is required"),
  image: z.string().min(1, "Cover image is required"),
  video: z.string().optional().default(""),
  description: z.string().min(1, "Description is required"),
  facilities: z.array(z.string()).default([]),
  gallery: z.array(z.string()).default([]),
  rooms: z.array(z.any()).default([]),
  available: z.boolean().default(true),
  addOns: z
    .array(
      z.object({
        name: z.string().default(""),
        price: z.string().default(""),
      }),
    )
    .default([]),
});

const HotelForm = ({ hotel, onSave, onCancel }) => {
  // Room modal sub-states
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

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

  useEffect(() => {
    if (hotel) {
      reset({
        title: hotel.title || "",
        starNum: hotel.starNum || 4,
        priceNum: hotel.priceNum ? String(hotel.priceNum) : "",
        image: hotel.image || "",
        video: hotel.video || "",
        description: hotel.description || "",
        facilities: hotel.facilities || [],
        gallery: hotel.gallery || [],
        rooms: hotel.rooms || [],
        available: hotel.available !== undefined ? hotel.available : true,
        addOns:
          hotel.addOns && hotel.addOns.length > 0
            ? hotel.addOns
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("image", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("video", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const promises = files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(promises).then((base64Images) => {
        setValue("gallery", [...galleryVal, ...base64Images].filter(Boolean));
      });
    }
  };

  const removeGalleryImage = (index) => {
    setValue(
      "gallery",
      galleryVal.filter((_, idx) => idx !== index),
    );
  };

  // Rooms CRUD within Hotel Form
  const handleSaveRoom = (savedRoom) => {
    if (editingRoom) {
      const updated = roomsVal.map((r) =>
        r.id === savedRoom.id ? savedRoom : r,
      );
      setValue("rooms", updated);
    } else {
      setValue("rooms", [...roomsVal, savedRoom]);
    }
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setIsRoomModalOpen(true);
  };

  const handleDeleteRoom = (roomId) => {
    setValue(
      "rooms",
      roomsVal.filter((r) => r.id !== roomId),
    );
  };

  const onSubmit = (data) => {
    const formattedHotel = {
      title: data.title,
      starNum: Number(data.starNum),
      stars: `${data.starNum} ★`,
      priceNum: Number(data.priceNum),
      price: `$${data.priceNum}`,
      image: data.image,
      video: data.video,
      description: data.description,
      facilities: data.facilities,
      gallery: data.gallery.filter(Boolean),
      rooms: data.rooms,
      available: data.available,
      addOns: data.addOns.filter((a) => a.name.trim() !== ""),
    };
    onSave(formattedHotel);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-6">
        {hotel ? `Edit Hotel: ${hotel.title}` : "Add New Hotel"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Hotel Title
            </label>
            <input
              type="text"
              {...register("title")}
              placeholder="e.g. Holiday Inn Resort Batam"
              className={`w-full bg-white border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.title.message}
              </span>
            )}
          </div>

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
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Starting Price ($)
              </label>
              <input
                type="number"
                {...register("priceNum")}
                placeholder="e.g. 87"
                className={`w-full bg-white border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary ${
                  errors.priceNum ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.priceNum && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.priceNum.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Cover Image */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Cover Image
            </label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
              />
              <input
                type="text"
                {...register("image")}
                placeholder="Or paste image URL (https://...)"
                className={`w-full bg-white border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary ${
                  errors.image ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.image && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.image.message}
                </span>
              )}
              {imageVal && (
                <div className="mt-2">
                  <img
                    src={imageVal}
                    alt="Cover Preview"
                    className="h-24 w-40 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Hotel Video */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Hotel Video
            </label>
            <div className="space-y-2">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
              />
              <input
                type="text"
                {...register("video")}
                placeholder="Or paste video URL (https://...)"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
              />
              {videoVal && (
                <div className="mt-2">
                  <video
                    src={videoVal}
                    controls
                    className="h-24 w-40 object-cover rounded-lg border bg-black"
                  ></video>
                </div>
              )}
            </div>
          </div>
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

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={4}
            placeholder="Write details about the hotel features, location advantages, services, etc..."
            className={`w-full bg-white border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.description && (
            <span className="text-red-500 text-xs mt-1 block">
              {errors.description.message}
            </span>
          )}
        </div>

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

        {/* Gallery Image Upload (Multiple) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
            Gallery Photos
          </label>
          <div className="space-y-4">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleGalleryUpload}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
            />

            {galleryVal.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                {galleryVal.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-white"
                  >
                    <img
                      src={url}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add-on Options Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-slate-900">
              Add-on Options
            </h3>
            <button
              type="button"
              onClick={() => appendAddOn({ name: "", price: "" })}
              className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition cursor-pointer"
            >
              + Add Option
            </button>
          </div>
          <div className="space-y-3">
            {addOnFields.map((field, idx) => (
              <div key={field.id} className="flex gap-4 items-center">
                <input
                  type="text"
                  {...register(`addOns.${idx}.name`)}
                  placeholder="Add-on Name (e.g. Airport Shuttle, Breakfast)"
                  className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
                <input
                  type="text"
                  {...register(`addOns.${idx}.price`)}
                  placeholder="Price (e.g. $25)"
                  className="w-32 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
                {addOnFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAddOn(idx)}
                    className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Room Types Table */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-slate-900">
              Room Types & Pricing
            </h3>
            <button
              type="button"
              onClick={() => {
                setEditingRoom(null);
                setIsRoomModalOpen(true);
              }}
              className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition cursor-pointer"
            >
              + Add Room Type
            </button>
          </div>

          {roomsVal.length === 0 ? (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 text-center text-sm text-gray-500 font-semibold">
              No rooms configured for this hotel yet. Add at least one room
              type.
            </div>
          ) : (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-gray-50 uppercase font-semibold text-gray-500 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">Room Name</th>
                    <th className="px-4 py-3">Bed Info</th>
                    <th className="px-4 py-3">Size</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {roomsVal.map((room) => (
                    <tr key={room.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {room.name}
                      </td>
                      <td className="px-4 py-3">{room.bedInfo}</td>
                      <td className="px-4 py-3">{room.size}</td>
                      <td className="px-4 py-3 font-bold text-slate-950">
                        {room.price}/night
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEditRoom(room)}
                          className="text-xs text-primary font-bold hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRoom(room.id)}
                          className="text-xs text-red-500 font-bold hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t border-gray-200 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm text-slate-700 hover:bg-gray-50 font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold shadow-sm cursor-pointer"
          >
            Save Hotel
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
    </div>
  );
};

export default HotelForm;
