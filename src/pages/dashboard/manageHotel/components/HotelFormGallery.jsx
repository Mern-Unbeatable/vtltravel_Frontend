import React, { useState } from "react";
import { toast } from "react-toastify";
import { fileToBase64 } from "../../../../utils/fileHelpers";
import { hotelService } from "../../../../api/services/hotelService";
import {
  GALLERY_CATEGORIES,
  isCategoryMatch,
  getBackendCategoryKey,
} from "./addHotelHelper";

const HotelFormGallery = ({ value = [], onChange }) => {
  const [activeGalleryTab, setActiveGalleryTab] = useState("Hotel");
  const [removingUrl, setRemovingUrl] = useState(null);

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

  const removeGalleryImage = async (img) => {
    const imageId = img?.id || img?._id || img?.imageId;
    const url = img?.url;

    if (imageId) {
      try {
        setRemovingUrl(url);
        await hotelService.deleteHotelImage(imageId);
        toast.success("Media deleted.");
      } catch (err) {
        console.error("Gallery media delete error:", err);
        toast.error(err?.message || "Failed to delete media.");
        return;
      } finally {
        setRemovingUrl(null);
      }
    }

    onChange(value.filter((item) => item.url !== url));
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
                const isVideoItem =
                  activeGalleryTab.toLowerCase() === "videos" ||
                  img.url.endsWith(".mp4") ||
                  img.url.endsWith(".mov") ||
                  img.url.endsWith(".webm") ||
                  img.url.startsWith("data:video/") ||
                  img.url.startsWith("blob:") ||
                  (img.category &&
                    String(img.category).toUpperCase() === "VIDEOS");
                const isRemoving = removingUrl === img.url;
                return (
                  <div
                    key={img.id || img.url || idx}
                    className={`relative group overflow-hidden rounded-lg border border-gray-200 ${
                      isVideoItem
                        ? "col-span-2 aspect-video bg-black sm:col-span-2"
                        : "aspect-square bg-white"
                    }`}
                  >
                    {isVideoItem ? (
                      <video
                        src={img.url}
                        className="h-full w-full object-contain"
                        playsInline
                        preload="metadata"
                        controls
                      />
                    ) : (
                      <img
                        src={img.url}
                        alt={`Gallery ${activeGalleryTab} ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    )}
                    <button
                      type="button"
                      disabled={isRemoving}
                      onClick={() => removeGalleryImage(img)}
                      className={`absolute right-1.5 top-1.5 z-10 rounded-md bg-slate-900/80 px-2 py-1 text-[10px] font-bold text-white hover:bg-red-600 disabled:cursor-wait ${
                        isVideoItem
                          ? "opacity-100"
                          : "opacity-0 transition-opacity group-hover:opacity-100"
                      }`}
                    >
                      {isRemoving ? "..." : "Remove"}
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
