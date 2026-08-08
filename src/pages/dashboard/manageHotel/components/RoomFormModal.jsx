import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const roomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  price: z.string().min(1, "Price is required"),
  size: z.string().min(1, "Size is required"),
  capacity: z.string().default("3 pers. max"),
  bedInfo: z.string().default("1 King size bed(s)"),
  tags: z.string().default(""),
  image: z.string().default(""),
  roomsLeft: z.string().default("Only 2 rooms left"),
});

const RoomFormModal = ({ isOpen, onClose, onSave, room }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: "",
      price: "",
      size: "",
      capacity: "3 pers. max",
      bedInfo: "1 King size bed(s)",
      tags: "",
      image: "",
      roomsLeft: "Only 2 rooms left",
    },
  });

  const imageVal = watch("image");

  useEffect(() => {
    if (room && isOpen) {
      reset({
        name: room.name || "",
        price: room.price ? room.price.replace("$", "") : "",
        size: room.size || "",
        capacity: room.capacity || "3 pers. max",
        bedInfo: room.bedInfo || "1 King size bed(s)",
        tags: room.tags ? room.tags.join(", ") : "",
        image: room.image || "",
        roomsLeft: room.roomsLeft || "Only 2 rooms left",
      });
    } else if (isOpen) {
      reset({
        name: "",
        price: "",
        size: "",
        capacity: "3 pers. max",
        bedInfo: "1 King size bed(s)",
        tags: "",
        image: "",
        roomsLeft: "Only 2 rooms left",
      });
    }
  }, [room, isOpen, reset]);

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

  if (!isOpen) return null;

  const onSubmit = (data) => {
    const formattedRoom = {
      id: room ? room.id : Date.now(),
      name: data.name,
      price: `$${data.price}`,
      size: data.size,
      capacity: data.capacity,
      bedInfo: data.bedInfo,
      tags: data.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      image:
        data.image ||
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
      roomsLeft: data.roomsLeft,
    };
    onSave(formattedRoom);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl border border-gray-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-slate-900">
            {room ? "Edit Room Type" : "Add New Room Type"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-slate-600 font-bold text-xl cursor-pointer"
          >
            &times;
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 overflow-y-auto space-y-4"
        >
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Room Name / Title
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="e.g. DELUXE SUITE, 1 King Size Bed, Ocean View"
              className={`w-full bg-white border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Price per Night ($)
              </label>
              <input
                type="number"
                {...register("price")}
                placeholder="e.g. 150"
                className={`w-full bg-white border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary ${
                  errors.price ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.price && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.price.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Room Size
              </label>
              <input
                type="text"
                {...register("size")}
                placeholder="e.g. 45m²"
                className={`w-full bg-white border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary ${
                  errors.size ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.size && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.size.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Max Capacity
              </label>
              <input
                type="text"
                {...register("capacity")}
                placeholder="e.g. 3 pers. max"
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Bed Information
              </label>
              <input
                type="text"
                {...register("bedInfo")}
                placeholder="e.g. 1 King size bed(s)"
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Rooms Left Alert
            </label>
            <input
              type="text"
              {...register("roomsLeft")}
              placeholder="e.g. Only 2 rooms left or 5 rooms left"
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              {...register("tags")}
              placeholder="e.g. Ocean View, Private Balcony, Bathtub"
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Room Photo
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
                placeholder="Or paste direct image URL (https://...)"
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
              {imageVal && (
                <div className="mt-2">
                  <img
                    src={imageVal}
                    alt="Room Preview"
                    className="h-24 w-40 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 -mx-6 -mb-6 p-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-slate-700 hover:bg-gray-100 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold cursor-pointer"
            >
              Save Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomFormModal;
