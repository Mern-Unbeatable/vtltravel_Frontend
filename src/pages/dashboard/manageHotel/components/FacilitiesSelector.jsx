import React from "react";
import { availableFacilitiesList } from "./addHotelHelper";

const FacilitiesSelector = ({ value = [], onChange }) => {
  const handleFacilityChange = (facility) => {
    const isChecked = value.includes(facility);
    const updated = isChecked
      ? value.filter((f) => f !== facility)
      : [...value, facility];
    onChange(updated);
  };

  return (
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
              checked={value.includes(fac)}
              onChange={() => handleFacilityChange(fac)}
              className="rounded text-primary accent-primary focus:ring-primary"
            />
            {fac}
          </label>
        ))}
      </div>
    </div>
  );
};

export default FacilitiesSelector;
