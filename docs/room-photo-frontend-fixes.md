# Room Photo & Update Room — Frontend Fixes

**Date:** 2026-08-16  
**Scope:** Admin → Manage Hotel → Manage Room (Edit / Add Room)  
**Backend changes:** Not required for most fixes. Permanent server-side delete of removed photos depends on backend accepting `existingImageUrls` / `existingImages` (see note below).

---

## Files changed

| File | Role |
|------|------|
| `src/pages/dashboard/manageHotel/components/RoomFormModal.jsx` | Field load/validation, image state, max photos |
| `src/components/FormFields.jsx` | Multi-image UI (overlap + remove) |
| `src/pages/dashboard/manageHotel/components/addHotelHelper.js` | Send kept existing image URLs on save |

---

## Bug 1 — Images overlap + wrong delete order

### Problem
- Gallery previews lived inside a big `<label htmlFor={fileInput}>`, so Remove clicks conflicted with file-picker / layout.
- `previewUrls` and `imageFiles` used separate arrays; remove used a **stale** `previewUrls.length` to map indexes → first photos often could not be removed until later ones were removed.

### Old code (concept)

```js
// RoomFormModal — two arrays, stale index math
setPreviewUrls(prev => {
  const updated = prev.filter((_, idx) => idx !== indexToRemove);
  setValue('image', updated);
  return updated;
});
setImageFiles(prev => {
  const existingCount = previewUrls.length - prev.length; // stale closure
  if (indexToRemove >= existingCount) {
    return prev.filter((_, idx) => idx !== (indexToRemove - existingCount));
  }
  return prev;
});
```

```jsx
// FormFileInput — entire grid inside <label htmlFor={fileInputId}>
<label htmlFor={fileInputId} className="... overflow-hidden">
  <div className="grid ... max-h-[250px]">
    {valueText.map(... Remove button ...)}
  </div>
</label>
```

### New code (concept)

```js
// Single list: { id, url, file? }
const [imageItems, setImageItems] = useState([]);

const handleRemoveImage = (indexToRemove) => {
  setImageItems((prev) => {
    const next = prev.filter((_, idx) => idx !== indexToRemove);
    setValue('image', next.map((item) => item.url));
    return next;
  });
};
```

```jsx
// Gallery outside file label; only "+" is <label htmlFor=...>
<div className="rounded-2xl border-2 ...">
  <div className="grid ...">
    {previews with dedicated Remove button}
    <label htmlFor={fileInputId}>+</label>
  </div>
</div>
```

### Result
Any photo can be removed in any order; no overlapping click targets.

---

## Bug 2 — No way to remove / see old photos

### Problem
Edit only read `room.image` / `room.imageUrl`. API usually returns `images: [{ url }]`, so old photos often never appeared → no Remove UI.  
`existingImages` was built on submit but **never appended** to FormData.

### Old code

```js
const rawImage = room.image || room.imageUrl;
const initialImages = Array.isArray(rawImage)
  ? rawImage
  : (rawImage ? [rawImage] : []);
// images[] / gallery ignored

// mapRoomToFormData — only new files
if (savedRoom.imageFiles?.length) {
  savedRoom.imageFiles.forEach((file) => formData.append('imageUrl', file));
}
```

### New code

```js
const collectRoomImageUrls = (room) => {
  // merges room.images, room.gallery, room.image / imageUrl → unique URL strings
};

// mapRoomToFormData
formData.append('existingImageUrls', JSON.stringify(existingImages));
existingImages.forEach((url) => formData.append('existingImages', url));
```

### Result
- Old photos show in Edit Room with Remove.
- Kept URLs are sent with the update payload.

### Backend note
If the API does not yet honor `existingImageUrls` / `existingImages`, UI remove still works locally for the session, but the server may keep deleted files until the backend is updated to replace the gallery with “kept URLs + new uploads”.

---

## Bug 3 — Update Room without changes → Invalid Input + empty fields

### Problem
`size`, `bedInfo`, `roomsLeft` used `type="number"` but were loaded as strings like `"32m²"`, `"1 King size bed(s)"`, `"Only 2 rooms left"`. Number inputs cleared → Zod `size.min(1)` failed → Invalid Input.

### Old code

```js
size: sizeVal || '',                    // e.g. "32m²"
bedInfo: bedInfoVal || '1 King size...',
roomsLeft: roomsLeftVal || 'Only 2 rooms left',
// inputs: type="number"
```

### New code

```js
const extractNumber = (value, fallback = '') => {
  const match = String(value).match(/(\d+(\.\d+)?)/);
  return match ? match[1] : fallback;
};

size: extractNumber(room.sizeSqm ?? room.size ?? ...),
bedInfo: extractNumber(room.bedCount ?? room.bedInfo ?? ...),
roomsLeft: extractNumber(room.roomsLeft ?? room.roomsLeftAlert ?? ...),
```

Labels updated to **Room Size (m²)**, **Bed Count**, **Rooms Left (number)** so values match what `mapRoomToFormData` already expects.

### Result
Open Edit → Save without changes works; fields stay filled with numeric values.

---

## Bug 4 — Unlimited photo upload (61+)

### Problem
No max on `handleImageUpload`.

### Old code

```js
setImageFiles(prev => [...prev, ...files]);
// no limit
```

### New code

```js
const MAX_ROOM_IMAGES = 12;
const remaining = MAX_ROOM_IMAGES - imageItems.length;
if (remaining <= 0) {
  toast.info(`You can upload up to ${MAX_ROOM_IMAGES} photos per room.`);
  return;
}
const accepted = files.slice(0, remaining);
```

### Result
Hard cap of **12** photos per room on the frontend (toast when exceeded).

---

## How to test

1. **Edit room → Save with no changes** → success, no Invalid Input; size / bed / rooms left still filled.
2. **Edit room with many photos** → all show; Remove first photo works without removing last ones first.
3. **Add photos beyond 12** → toast; only up to 12 kept.
4. **Remove some existing + add new → Save** → Network FormData includes `existingImageUrls` / `existingImages` + new `imageUrl` files. Confirm with backend whether deleted images disappear from GET room.

---

## Summary table

| Issue | Before | After |
|-------|--------|--------|
| Overlap / delete order | Grid inside label + stale dual arrays | Separate gallery UI + `{id,url,file}` list |
| Old photos | Often not loaded; not sent on save | Load from `images[]`; send kept URLs |
| Invalid Input on save | String values wiped by `type=number` | Extract digits before fill |
| Photo limit | Unlimited | Max 12 |
