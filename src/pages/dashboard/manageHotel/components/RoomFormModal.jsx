import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormInput, FormFileInput, FormTextarea } from '../../../../components/FormFields';
import { fileToBase64 } from '../../../../utils/fileHelpers';

const roomSchema = z.object({
  name: z.string().min(1, 'Room name is required'),
  price: z.string().min(1, 'Price is required'),
  discountPrice: z.string().default(''),
  size: z.string().min(1, 'Size is required'),
  capacity: z.string().default('3 pers. max'),
  bedInfo: z.string().default('1 King size bed(s)'),
  baths: z.string().default('1 Bath(s)'),
  description: z.string().default(''),
  foodBeverage: z.string().default(''),
  bathroomFacilities: z.string().default(''),
  mediaTechnology: z.string().default(''),
  serviceEquipment: z.string().default(''),
  tags: z.string().default(''),
  image: z.any().default([]),
  roomsLeft: z.string().default('Only 2 rooms left'),
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
      name: '',
      price: '',
      discountPrice: '',
      size: '',
      capacity: '3 pers. max',
      bedInfo: '1 King size bed(s)',
      baths: '1 Bath(s)',
      description: '',
      foodBeverage: '',
      bathroomFacilities: '',
      mediaTechnology: '',
      serviceEquipment: '',
      tags: '',
      image: [],
      roomsLeft: 'Only 2 rooms left',
    },
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const toCommaText = (value) => {
    if (!value) return '';
    if (Array.isArray(value)) return value.join(', ');
    return String(value);
  };

  useEffect(() => {
    if (room && isOpen) {
      const rawImage = room.image || room.imageUrl;
      const initialImages = Array.isArray(rawImage) 
        ? rawImage 
        : (rawImage ? [rawImage] : []);
      
      const priceVal = room.price || room.pricePerNight || room.basePrice || '';
      const discountPriceVal = room.discountPrice ?? '';
      const sizeVal = room.size || room.roomSize || room.sizeLabel || (room.sizesSqm ? String(room.sizesSqm) : '') || '';
      const capacityVal = room.capacity || room.maxCapacity || '';
      const bedInfoVal = room.bedInfo || room.bedInformation || '';
      const bathsVal = room.baths || room.bathrooms || '';
      const roomsLeftVal = room.roomsLeft || room.roomsLeftAlert || '';
      const facilityGroups = room.facilityGroups || {};

      reset({
        name: room.name || '',
        price: priceVal ? String(priceVal).replace('$', '') : '',
        discountPrice: discountPriceVal !== '' ? String(discountPriceVal).replace('$', '') : '',
        size: sizeVal || '',
        capacity: capacityVal || '3 pers. max',
        bedInfo: bedInfoVal || '1 King size bed(s)',
        baths: bathsVal || '1 Bath(s)',
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
        tags: room.tags ? (Array.isArray(room.tags) ? room.tags.join(' ') : room.tags) : '',
        image: initialImages,
        roomsLeft: roomsLeftVal || 'Only 2 rooms left',
      });
      setPreviewUrls(initialImages);
      setImageFiles([]);
    } else if (isOpen) {
      reset({
        name: '',
        price: '',
        discountPrice: '',
        size: '',
        capacity: '',
        bedInfo: '',
        baths: '',
        description: '',
        foodBeverage: '',
        bathroomFacilities: '',
        mediaTechnology: '',
        serviceEquipment: '',
        tags: '',
        image: [],
        roomsLeft: '',
      });
      setPreviewUrls([]);
      setImageFiles([]);
    }
  }, [room, isOpen, reset]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      try {
        const promises = files.map(file => fileToBase64(file, { maxSizeMB: 5, allowedTypes: ['image/*'] }));
        const base64s = await Promise.all(promises);
        setPreviewUrls(prev => {
          const updated = [...prev, ...base64s];
          setValue('image', updated);
          return updated;
        });
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setPreviewUrls(prev => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      setValue('image', updated);
      return updated;
    });
    setImageFiles(prev => {
      const existingCount = previewUrls.length - prev.length;
      if (indexToRemove >= existingCount) {
        return prev.filter((_, idx) => idx !== (indexToRemove - existingCount));
      }
      return prev;
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

    const formattedRoom = {
      id: room ? (room.id || room._id) : Date.now(),
      name: data.name,
      price: data.price,
      discountPrice: data.discountPrice,
      size: data.size,
      capacity: data.capacity,
      bedInfo: data.bedInfo,
      baths: data.baths,
      description: data.description,
      // UI → array; FormData mapper will re-join as comma string for API
      foodBeverage,
      bathroomFacilities,
      mediaTechnology,
      serviceEquipment,
      tags: data.tags.split(/[\s,]+/).map((t) => t.trim()).filter(Boolean),
      existingImages: previewUrls.filter((url) => url.startsWith('http')),
      roomsLeft: data.roomsLeft,
      imageFiles: imageFiles,
    };

    console.log('--- ROOM FORM SUBMIT (parsed arrays) ---', {
      foodBeverage,
      bathroomFacilities,
      mediaTechnology,
      serviceEquipment,
      tags: formattedRoom.tags,
      imageFilesCount: imageFiles.length,
      formattedRoom,
    });

    try {
      const response = await onSave(formattedRoom);
      console.log('--- ROOM FORM onSave RESPONSE ---', response);
      onClose();
    } catch (err) {
      console.error('Failed to save room:', err);
      console.error('--- ROOM FORM onSave ERROR ---', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl border border-gray-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-slate-900">
            {room ? 'Edit Room Type' : 'Add New Room Type'}
          </h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-slate-600 font-bold text-xl cursor-pointer">&times;</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-4">
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
              label="Room Size"
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
              label="Bed Information"
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
              label="Rooms Left Alert"
              name="roomsLeft"
              type="number"
              register={register}
              error={errors.roomsLeft}
              placeholder="e.g. 2"
            />
            <FormInput
              label="Tags "
              name="tags"
              register={register}
              error={errors.tags}
              placeholder="e.g. City View, Bathtub/shower combination"
            />
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase mb-3">Room Facilities & Amenities</h4>
            
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
            label="Room Photos (Multiple)"
            accept="image/*"
            onChange={handleImageUpload}
            valueText={previewUrls}
            onRemoveFile={handleRemoveImage}
            multiple={true}
          />

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
