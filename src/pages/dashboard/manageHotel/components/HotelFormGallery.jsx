import React, { useState } from "react";
import { toast } from "react-toastify";
import { fileToBase64 } from "../../../../utils/fileHelpers";
import {
  GALLERY_CATEGORIES,
  isCategoryMatch,
  getBackendCategoryKey,
} from "./addHotelHelper";

const HotelFormGallery = ({ value = [], onChange }) => {
  const [activeGalleryTab, setActiveGalleryTab] = useState("Hotel");

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

      onChange([...value, ...formattedMedia]);
      toast.success("Media added to gallery locally!");
    } catch (err) {
      console.error("Gallery upload error:", err);
      toast.error(err?.message || "Failed to load gallery media.");
    }
  };

  const removeGalleryImage = (url) => {
    onChange(value.filter((img) => img.url !== url));
  };

  return (
    <div className="border-t border-gray-200 pt-6">
      <label className="block text-xs font-bold text-slate-700 uppercase mb-3">
        Gallery Sections (Categorized)
      </label>

      {/* Horizontal scrollable tab buttons */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-thin">
        {GALLERY_CATEGORIES.map((cat) => {
          const count = value.filter((img) =>
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
        {value.filter((img) =>
          isCategoryMatch(img.category, activeGalleryTab),
        ).length === 0 ? (
          <div className="text-center py-8 text-xs font-semibold text-slate-400 border border-dashed border-slate-200 rounded-xl bg-white">
            No items uploaded under {activeGalleryTab} category yet.
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {value
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
  );
};

export default HotelFormGallery;
