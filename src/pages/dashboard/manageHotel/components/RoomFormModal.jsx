import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-toastify';
import { FormInput, FormFileInput, FormTextarea } from '../../../../components/FormFields';
import { fileToBase64 } from '../../../../utils/fileHelpers';

const MAX_ROOM_IMAGES = 12;

const roomSchema = z.object({
  name: z.string().min(1, 'Room name is required'),
  price: z.string().min(1, 'Price is required'),
  discountPrice: z.string().default(''),
  size: z.string().min(1, 'Size is required'),
  capacity: z.string().min(1, 'Capacity is required'),
  bedInfo: z.string().min(1, 'Bed count is required'),
  baths: z.string().default('1'),
  description: z.string().default(''),
  foodBeverage: z.string().default(''),
  bathroomFacilities: z.string().default(''),
  mediaTechnology: z.string().default(''),
  serviceEquipment: z.string().default(''),
  tags: z.string().default(''),
  image: z.any().default([]),
  roomsLeft: z.string().min(1, 'Rooms left is required'),
});

const extractNumber = (value, fallback = '') => {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'number' && !Number.isNaN(value)) return String(value);
  const match = String(value).match(/(\d+(\.\d+)?)/);
  return match ? match[1] : fallback;
};

/** Normalize API tags (array / JSON string / nested junk) → "a, b, c" */
const normalizeTagsToCommaText = (tags) => {
  const collected = [];

  const ingest = (value) => {
    if (value == null || value === '') return;

    if (Array.isArray(value)) {
      value.forEach(ingest);
      return;
    }

    let raw = String(value).trim();
    if (!raw) return;

    // Unwrap JSON array / JSON string (handles ["a, b, c"] and ["a","b"])
    if (
      (raw.startsWith('[') && raw.endsWith(']')) ||
      (raw.startsWith('"') && raw.endsWith('"'))
    ) {
      try {
        ingest(JSON.parse(raw));
        return;
      } catch {
        // fall through
      }
    }

    // Strip leftover brackets then split on commas
    raw = raw.replace(/^\[+/, '').replace(/\]+$/, '').trim();

    const quoted = [...raw.matchAll(/"([^"]+)"/g)].map((m) => m[1].trim());
    if (quoted.length > 1 || (quoted.length === 1 && raw.includes('"'))) {
      quoted.forEach((q) => {
        if (q) collected.push(q);
      });
      return;
    }

    raw.split(',').forEach((part) => {
      const t = part.replace(/^["'\s[\]]+|["'\s[\]]+$/g, '').trim();
      if (t) collected.push(t);
    });
  };

  ingest(tags);
  return [...new Set(collected)].join(', ');
};

const collectRoomImageUrls = (room) => {
  if (!room) return [];
  const urls = [];
  const push = (value) => {
    if (!value) return;
    if (typeof value === 'string') {
      urls.push(value);
      return;
    }
    if (typeof value === 'object' && value.url) {
      urls.push(value.url);
    }
  };

  if (Array.isArray(room.images)) room.images.forEach(push);
  if (Array.isArray(room.gallery)) room.gallery.forEach(push);

  const raw = room.image || room.imageUrl;
  if (Array.isArray(raw)) raw.forEach(push);
  else push(raw);

  return [...new Set(urls.filter(Boolean))];
};

const RoomFormModal = ({ isOpen, onClose, onSave, room }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: '',
      price: '',
      discountPrice: '',
      size: '',
      capacity: '3',
      bedInfo: '1',
      baths: '1',
      description: '',
      foodBeverage: '',
      bathroomFacilities: '',
      mediaTechnology: '',
      serviceEquipment: '',
      tags: '',
      image: [],
      roomsLeft: '2',
    },
  });

  // Stable image items: { id, url, file? } — avoids preview/file index mismatch
  const [imageItems, setImageItems] = useState([]);
  const [initialImageUrls, setInitialImageUrls] = useState([]);

  const toCommaText = (value) => {
    if (!value) return '';
    if (Array.isArray(value)) return value.join(', ');
    return String(value);
  };

  useEffect(() => {
    if (room && isOpen) {
      const initialUrls = collectRoomImageUrls(room);
      const priceVal = room.price || room.pricePerNight || room.basePrice || '';
      const discountPriceVal = room.discountPrice ?? '';
      const sizeVal = extractNumber(
        room.sizeSqm ?? room.size ?? room.roomSize ?? room.sizeLabel,
        '',
      );
      const capacityVal = extractNumber(room.capacity ?? room.maxCapacity, '3');
      const bedInfoVal = extractNumber(
        room.bedCount ?? room.bedInfo ?? room.bedInformation,
        '1',
      );
      const bathsVal = extractNumber(room.baths ?? room.bathrooms, '1');
      const roomsLeftVal = extractNumber(
        room.roomsLeft ?? room.roomsLeftAlert ?? room.totalInventory,
        '2',
      );
      const facilityGroups = room.facilityGroups || {};

      reset({
        name: room.name || '',
        price: priceVal ? String(priceVal).replace('$', '') : '',
        discountPrice:
          discountPriceVal !== '' ? String(discountPriceVal).replace('$', '') : '',
        size: sizeVal,
        capacity: capacityVal,
        bedInfo: bedInfoVal,
        baths: bathsVal,
        description: room.description || '',
        foodBeverage: toCommaText(
          room.foodBeverage || facilityGroups.foodBeverage,
        ),
        bathroomFacilities: toCommaText(
          room.bathroomFacilities ||
            room.bathroom ||
            facilityGroups.bathroomFacilities,
        ),
        mediaTechnology: toCommaText(
          room.mediaTechnology ||
            room.mediaTech ||
            facilityGroups.mediaTechnology,
        ),
        serviceEquipment: toCommaText(
          room.serviceEquipment || facilityGroups.serviceEquipment,
        ),
        tags: normalizeTagsToCommaText(room.tags),
        image: initialUrls,
        roomsLeft: roomsLeftVal,
      });
      setInitialImageUrls(initialUrls);
      setImageItems(
        initialUrls.map((url, index) => ({
          id: `existing-${index}-${url}`,
          url,
          file: null,
        })),
      );
    } else if (isOpen) {
      reset({
        name: '',
        price: '',
        discountPrice: '',
        size: '',
        capacity: '3',
        bedInfo: '1',
        baths: '1',
        description: '',
        foodBeverage: '',
        bathroomFacilities: '',
        mediaTechnology: '',
        serviceEquipment: '',
        tags: '',
        image: [],
        roomsLeft: '2',
      });
      setInitialImageUrls([]);
      setImageItems([]);
    }
  }, [room, isOpen, reset]);

  const previewUrls = imageItems.map((item) => item.url);

  const handleImageUpload = async (e) => {
    const input = e.target;
    const files = Array.from(input.files || []);
    if (files.length === 0) return;

    const remaining = MAX_ROOM_IMAGES - imageItems.length;
    if (remaining <= 0) {
      toast.info(`You can upload up to ${MAX_ROOM_IMAGES} photos per room.`);
      input.value = '';
      return;
    }

    const accepted = files.slice(0, remaining);
    if (files.length > remaining) {
      toast.info(
        `Only ${remaining} more photo${remaining !== 1 ? 's' : ''} can be added (max ${MAX_ROOM_IMAGES}).`,
      );
    }

    try {
      const base64s = await Promise.all(
        accepted.map((file) =>
          fileToBase64(file, { maxSizeMB: 5, allowedTypes: ['image/*'] }),
        ),
      );
      setImageItems((prev) => {
        const next = [
          ...prev,
          ...accepted.map((file, index) => ({
            id: `new-${Date.now()}-${index}-${file.name}`,
            url: base64s[index],
            file,
          })),
        ];
        setValue(
          'image',
          next.map((item) => item.url),
        );
        return next;
      });
    } catch (err) {
      toast.error(err?.message || 'Failed to load image.');
    } finally {
      input.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImageItems((prev) => {
      const next = prev.filter((_, idx) => idx !== indexToRemove);
      setValue(
        'image',
        next.map((item) => item.url),
      );
      return next;
    });
  };

  if (!isOpen) return null;

  const splitToArray = (value = '') =>
    value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

  const onSubmit = async (data) => {
    const foodBeverage = splitToArray(data.foodBeverage);
    const bathroomFacilities = splitToArray(data.bathroomFacilities);
    const mediaTechnology = splitToArray(data.mediaTechnology);
    const serviceEquipment = splitToArray(data.serviceEquipment);

    const existingImages = imageItems
      .filter((item) => !item.file && String(item.url).startsWith('http'))
      .map((item) => item.url);
    const imageFiles = imageItems
      .filter((item) => item.file)
      .map((item) => item.file);
    const hasNewImages = imageFiles.length > 0;
    const imagesRemoved =
      initialImageUrls.length !== existingImages.length ||
      initialImageUrls.some((url) => !existingImages.includes(url));
    // PUT: only touch imageUrl when user actually changed photos
    const imagesChanged = hasNewImages || imagesRemoved;
    const roomId = room ? room.id || room._id : null;
    const isEdit = Boolean(roomId);

    // Display/input is comma-separated; API still gets JSON array via mapRoomToFormData
    const tagsArray = normalizeTagsToCommaText(data.tags)
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    console.log('[RoomFormModal] save payload', {
      mode: isEdit ? 'PUT /api/v1/rooms/:id' : 'POST create',
      roomId,
      tags: { display: data.tags, tagsArray, formDataTags: JSON.stringify(tagsArray) },
      images: {
        imagesChanged,
        hasNewImages,
        imagesRemoved,
        existingKept: existingImages.length,
        newUploads: imageFiles.length,
        omitImageUrlOnPut: isEdit && !imagesChanged,
      },
    });

    const formattedRoom = {
      id: roomId || Date.now(),
      isEdit,
      name: data.name,
      price: data.price,
      discountPrice: data.discountPrice,
      size: data.size,
      capacity: data.capacity,
      bedInfo: data.bedInfo,
      baths: data.baths,
      description: data.description,
      foodBeverage,
      bathroomFacilities,
      mediaTechnology,
      serviceEquipment,
      tags: tagsArray,
      existingImages: imagesChanged ? existingImages : [],
      roomsLeft: data.roomsLeft,
      imageFiles: hasNewImages ? imageFiles : [],
      imagesChanged,
    };

    try {
      await onSave(formattedRoom);
      onClose();
    } catch (err) {
      // parent (HotelForm) already shows toast from API message
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl border border-gray-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-slate-900">
            {room ? 'Edit Room Type' : 'Add New Room Type'}
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
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="room-list-scroll min-h-0 flex-1 space-y-4 overflow-y-auto p-6">
            <FormInput
              label="Room Name / Title"
              name="name"
              register={register}
              error={errors.name}
              placeholder="e.g. SUPERIOR ROOM, 1 King Size Bed, City View"
            />

            <FormTextarea
              label="Description"
              name="description"
              register={register}
              error={errors.description}
              placeholder="Describe the room experience, view, amenities, etc."
              rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                label="Price per Night ($)"
                name="price"
                type="number"
                register={register}
                error={errors.price}
                placeholder="e.g. 150"
              />
              <FormInput
                label="Discount Price ($)"
                name="discountPrice"
                type="number"
                register={register}
                error={errors.discountPrice}
                placeholder="e.g. 120"
              />
              <FormInput
                label="Room Size (m²)"
                name="size"
                type="number"
                register={register}
                error={errors.size}
                placeholder="e.g. 32"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormInput
                label="Max Capacity"
                name="capacity"
                type="number"
                register={register}
                error={errors.capacity}
                placeholder="e.g. 3"
              />
              <FormInput
                label="Bed Count"
                name="bedInfo"
                type="number"
                register={register}
                error={errors.bedInfo}
                placeholder="e.g. 2"
              />
              <FormInput
                label="Baths Count"
                name="baths"
                type="number"
                register={register}
                error={errors.baths}
                placeholder="e.g. 1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Rooms Left (number)"
                name="roomsLeft"
                type="number"
                register={register}
                error={errors.roomsLeft}
                placeholder="e.g. 2"
              />
              <FormInput
                label="Tags"
                name="tags"
                register={register}
                error={errors.tags}
                placeholder="e.g. Ipsum, doloremque, dig"
              />
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase mb-3">
                Room Facilities & Amenities
              </h4>

              <div className="space-y-3">
                <FormInput
                  label="Food & Beverage Facilities"
                  name="foodBeverage"
                  register={register}
                  error={errors.foodBeverage}
                  placeholder="e.g. Bottled water, Coffee maker, Kettle"
                />
                <FormInput
                  label="Bathroom Facilities"
                  name="bathroomFacilities"
                  register={register}
                  error={errors.bathroomFacilities}
                  placeholder="e.g. Hair dryer in bathroom, Make-up mirror"
                />
                <FormInput
                  label="Media & Technology"
                  name="mediaTechnology"
                  register={register}
                  error={errors.mediaTechnology}
                  placeholder="e.g. Wireless internet, Children's TV Channels"
                />
                <FormInput
                  label="Service & Equipment"
                  name="serviceEquipment"
                  register={register}
                  error={errors.serviceEquipment}
                  placeholder="e.g. Safe deposit box, Blackout curtain, Air Conditioning"
                />
              </div>
            </div>

            <FormFileInput
              label={`Room Photos (max ${MAX_ROOM_IMAGES})`}
              accept="image/*"
              onChange={handleImageUpload}
              valueText={previewUrls}
              onRemoveFile={handleRemoveImage}
              multiple={true}
            />
          </div>

          <div className="flex shrink-0 justify-end gap-3 border-t border-gray-200 bg-gray-50 p-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
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
