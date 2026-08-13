import React from "react";

const AddOnOptions = ({ register, addOnFields, appendAddOn, removeAddOn }) => {
  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-slate-900">Add-on Options</h3>
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
          <div
            key={field.id}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center bg-gray-50/50 sm:bg-transparent p-3 sm:p-0 rounded-xl border border-gray-100 sm:border-0"
          >
            <input
              type="text"
              {...register(`addOns.${idx}.name`)}
              placeholder="Add-on Name (e.g. Airport Shuttle, Breakfast)"
              className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
            />
            <div className="flex gap-2 items-center">
              <input
                type="text"
                {...register(`addOns.${idx}.price`)}
                placeholder="Price (e.g. $25)"
                className="w-full sm:w-32 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
              {addOnFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAddOn(idx)}
                  className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 cursor-pointer whitespace-nowrap"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddOnOptions;
