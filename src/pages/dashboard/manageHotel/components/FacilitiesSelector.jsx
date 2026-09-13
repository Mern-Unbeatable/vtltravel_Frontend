import React, { useEffect, useState } from "react";
import { hotelService } from "../../../../api/services/hotelService";
import { availableFacilitiesList } from "./addHotelHelper";

const isDuplicateWifi = (fac) => {
  const slug = String(fac?.slug || "").toLowerCase();
  const name = String(fac?.name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  return slug === "wifi" || name === "wifi";
};

const toSlug = (text) =>
  String(text || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const FACILITY_SLUG_ALIASES = {
  wifi: "free-wifi",
  "wi-fi": "free-wifi",
  "free-wi-fi": "free-wifi",
  "freewifi": "free-wifi",
  "swimmingpool": "swimming-pool",
  "fitnesscenter": "fitness-center",
};

export const normalizeFacilitySlug = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const asSlug = toSlug(raw);
  const compact = raw.toLowerCase().replace(/[^a-z0-9]/g, "");
  return (
    FACILITY_SLUG_ALIASES[asSlug] ||
    FACILITY_SLUG_ALIASES[compact] ||
    asSlug
  );
};

const FacilitiesSelector = ({ value = [], onChange }) => {
  const [facilities, setFacilities] = useState(
    availableFacilitiesList
      .map((name) => ({
        name,
        slug: normalizeFacilitySlug(name),
      }))
      .filter((fac) => !isDuplicateWifi(fac)),
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await hotelService.getCatalogFacilities();
        const list = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];
        if (active && list.length > 0) {
          setFacilities(
            list
              .map((item) => ({
                id: item.id,
                name: item.name,
                slug: item.slug || normalizeFacilitySlug(item.name),
              }))
              .filter((fac) => !isDuplicateWifi(fac)),
          );
        }
      } catch (err) {
        console.error("Failed to fetch facilities catalog:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const selectedSlugs = new Set(
    (value || []).map((item) => normalizeFacilitySlug(item)).filter(Boolean),
  );

  const isSelected = (fac) => selectedSlugs.has(normalizeFacilitySlug(fac.slug || fac.name));

  const handleFacilityChange = (fac) => {
    const slug = normalizeFacilitySlug(fac.slug || fac.name);
    if (!slug) return;

    if (selectedSlugs.has(slug)) {
      onChange(
        (value || []).filter((item) => normalizeFacilitySlug(item) !== slug),
      );
      return;
    }
    onChange([...(value || []), slug]);
  };

  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 uppercase mb-3">
        Popular Facilities
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
        {isLoading && facilities.length === 0 ? (
          <p className="col-span-full text-xs text-slate-400">Loading facilities...</p>
        ) : (
          facilities.map((fac) => (
            <label
              key={fac.slug || fac.name}
              className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={isSelected(fac)}
                onChange={() => handleFacilityChange(fac)}
                className="rounded text-primary accent-primary focus:ring-primary"
              />
              {fac.name}
            </label>
          ))
        )}
      </div>
    </div>
  );
};

export default FacilitiesSelector;
