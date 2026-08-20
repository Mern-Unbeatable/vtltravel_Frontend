import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { fileToBase64 } from "../../../../utils/fileHelpers";

const emptyAddOn = { name: "", price: "", minPax: "1", imageUrl: "" };

const AddOnOptions = ({
  addOnItems = [],
  addOnFields = [],
  appendAddOn,
  removeAddOn,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyAddOn);
  const [isUploading, setIsUploading] = useState(false);

  const rows = useMemo(
    () =>
      addOnItems.map((item, idx) => ({
        key: addOnFields[idx]?.id || `addon-${idx}`,
        index: idx,
        ...item,
      })),
    [addOnFields, addOnItems],
  );

  const openCreateModal = () => {
    setForm(emptyAddOn);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm(emptyAddOn);
    setIsUploading(false);
  };

  const handleUploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const base64 = await fileToBase64(file, {
        maxSizeMB: 5,
        allowedTypes: ["image/*"],
      });
      setForm((prev) => ({ ...prev, imageUrl: base64 }));
    } catch (err) {
      toast.error(err?.message || "Failed to upload add-on image.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = () => {
    const name = String(form.name || "").trim();
    const price = String(form.price || "").trim();
    const minPax = Math.max(1, Number(form.minPax) || 1);

    if (!name) {
      toast.error("Add-on name is required.");
      return;
    }
    if (!price || Number(price) <= 0) {
      toast.error("Add-on price must be greater than 0.");
      return;
    }
    if (!form.imageUrl) {
      toast.error("Please upload an add-on image.");
      return;
    }

    const payload = {
      name,
      price,
      minPax: String(minPax),
      imageUrl: form.imageUrl,
    };
    appendAddOn(payload);
    closeModal();
  };

  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">Add-on Options</h3>
        <button
          type="button"
          onClick={openCreateModal}
          className="cursor-pointer rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
        >
          + Add Option
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
          No add-ons added yet.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((item) => (
            <div
              key={item.key}
              className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-3 sm:grid-cols-[80px_minmax(0,1fr)_100px_auto]"
            >
              <div className="h-16 w-20 overflow-hidden rounded-lg bg-slate-100">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name || "Add-on"}
                    className="h-16 w-20 object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">{item.name || "-"}</p>
                <p className="text-xs text-gray-500">Min pax: {item.minPax || 1}</p>
              </div>
              <p className="text-sm font-semibold text-slate-700 self-center">${item.price || 0}</p>
              <button
                type="button"
                onClick={() => removeAddOn(item.index)}
                className="cursor-pointer px-2 py-1 text-xs font-bold text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {isModalOpen ? (
        <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <h4 className="text-lg font-bold text-slate-900">Add New Add-on</h4>

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase text-slate-700">
                  Add-on Name
                </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Add-on Name"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase text-slate-700">
                    Price
                  </label>
                <input
                  type="number"
                  min="1"
                  value={form.price}
                  onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="Price"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase text-slate-700">
                    Min Pax
                  </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.minPax}
                  onChange={(e) => setForm((prev) => ({ ...prev, minPax: e.target.value }))}
                  placeholder="Min pax"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-slate-50 p-3">
                <label className="mb-2 block text-xs font-bold uppercase text-slate-700">
                  Add-on Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  className="w-full text-xs file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:font-semibold file:text-primary hover:file:bg-primary/20"
                />
                {isUploading ? (
                  <p className="mt-2 text-xs text-gray-500">Uploading image...</p>
                ) : null}
                {form.imageUrl ? (
                  <img
                    src={form.imageUrl}
                    alt="Add-on preview"
                    className="mt-3 h-24 w-full rounded-lg border border-gray-200 object-cover"
                  />
                ) : null}
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
              >
                Add Add-on
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AddOnOptions;
