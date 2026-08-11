import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import RoomFormModal from './RoomFormModal';
import { FormInput, FormTextarea, FormFileInput } from '../../../../components/FormFields';
import { fileToBase64 } from '../../../../utils/fileHelpers';

const availableFacilitiesList = [
  'Free Wi-Fi',
  'Swimming Pool',
  'Private Pool',
  'Fitness Center',
  'Spa',
  'Restaurant',
  'Bar',
  'Room Service',
  'Beach Access',
  'Kids Club',
  'Free Parking'
];

const GALLERY_CATEGORIES = [
  'Videos',
  'Hotel',
  'Rooms',
  'Suite',
  'Restaurant',
  'Bar',
  'Breakfast',
  'Family',
  'Weddings',
  'Meetings and events',
  'Services',
  'Hotel advantages',
  'Spa',
];

const hotelSchema = z.object({
  title: z.string().min(1, 'Hotel title is required'),
  starNum: z.number().min(1).max(5),
  priceNum: z.string().min(1, 'Starting price is required'),
  image: z.string().min(1, 'Cover image is required'),
  video: z.string().optional().default(''),
  description: z.string().min(1, 'Description is required'),
  facilities: z.array(z.string()).default([]),
  gallery: z.array(z.object({
    url: z.string(),
    category: z.string()
  })).default([]),
  rooms: z.array(z.any()).default([]),
  available: z.boolean().default(true),
  addOns: z.array(
    z.object({
      name: z.string().default(''),
      price: z.string().default(''),
    })
  ).default([]),
});

const HotelForm = ({ hotel, onSave, onCancel }) => {
  // Room modal sub-states
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [activeGalleryTab, setActiveGalleryTab] = useState('Hotel');

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      title: '',
      starNum: 4,
      priceNum: '',
      image: '',
      video: '',
      description: '',
      facilities: [],
      gallery: [],
      rooms: [],
      available: true,
      addOns: [{ name: '', price: '' }],
    },
  });

  const { fields: addOnFields, append: appendAddOn, remove: removeAddOn } = useFieldArray({
    control,
    name: 'addOns',
  });

  const imageVal = watch('image');
  const videoVal = watch('video');
  const galleryVal = watch('gallery') || [];
  const facilitiesVal = watch('facilities') || [];
  const roomsVal = watch('rooms') || [];
  const availableVal = watch('available');

  useEffect(() => {
    if (hotel) {
      // Map API object properties to form properties
      const mappedFacilities = (hotel.facilities || []).map(fac => 
        typeof fac === 'string' ? fac : (fac?.facility?.name || fac?.name || '')
      ).filter(Boolean);

      const rawGallery = hotel.gallery || hotel.images || [];
      const mappedGallery = rawGallery.map(img => {
        if (typeof img === 'string') {
          const isVideo = img.toLowerCase().endsWith('.mp4') || img.toLowerCase().endsWith('.mov');
          return { url: img, category: isVideo ? 'Videos' : 'Hotel' };
        }
        return {
          url: img.url || img.coverImageUrl || '',
          category: img.category || img.type || 'Hotel'
        };
      }).filter(img => img.url);

      reset({
        title: hotel.name || hotel.title || '',
        starNum: hotel.starRating || hotel.starNum || 4,
        priceNum: hotel.startingPrice || hotel.priceNum ? String(hotel.startingPrice || hotel.priceNum) : '',
        image: hotel.coverImageUrl || hotel.image || '',
        video: hotel.videoUrl || hotel.video || '',
        description: hotel.description || '',
        facilities: mappedFacilities,
        gallery: mappedGallery,
        rooms: hotel.rooms || hotel.roomTypes || [],
        available: hotel.isActive !== undefined ? hotel.isActive : (hotel.available !== undefined ? hotel.available : true),
        addOns: hotel.addOns && hotel.addOns.length > 0 
          ? hotel.addOns.map(a => ({
              name: a.addOn?.name || a.name || '',
              price: String(a.addOn?.price || a.price || '')
            })) 
          : [{ name: '', price: '' }],
      });
    }
  }, [hotel, reset]);


  const handleFacilityChange = (facility) => {
    const isChecked = facilitiesVal.includes(facility);
    const updated = isChecked
      ? facilitiesVal.filter(f => f !== facility)
      : [...facilitiesVal, facility];
    setValue('facilities', updated);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file, { maxSizeMB: 5, allowedTypes: ['image/*'] });
        setValue('image', base64);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file, { maxSizeMB: 20, allowedTypes: ['video/*'] });
        setValue('video', base64);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      try {
        const isVideoTab = activeGalleryTab.toLowerCase() === 'videos';
        const promises = files.map(file => fileToBase64(file, { 
          maxSizeMB: isVideoTab ? 20 : 5, 
          allowedTypes: isVideoTab ? ['video/*'] : ['image/*'] 
        }));
        const base64Files = await Promise.all(promises);
        const newGalleryItems = base64Files.map(base64 => ({
          url: base64,
          category: activeGalleryTab
        }));
        setValue('gallery', [...galleryVal, ...newGalleryItems].filter(Boolean));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const removeGalleryImage = (url) => {
    setValue('gallery', galleryVal.filter(img => img.url !== url));
  };

  // Rooms CRUD within Hotel Form
  const handleSaveRoom = (savedRoom) => {
    if (editingRoom) {
      const updated = roomsVal.map(r => r.id === savedRoom.id ? savedRoom : r);
      setValue('rooms', updated);
    } else {
      setValue('rooms', [...roomsVal, savedRoom]);
    }
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setIsRoomModalOpen(true);
  };

  const handleDeleteRoom = (roomId) => {
    setValue('rooms', roomsVal.filter(r => r.id !== roomId));
  };

  const onSubmit = (data) => {
    console.log("HotelForm raw onSubmit data:", data);
    // We will build a FormData object as the backend expects multipart/form-data
    const formData = new FormData();
    
    // Add textual properties
    formData.append('name', data.title);
    formData.append('starRating', String(data.starNum));
    formData.append('startingPrice', String(data.priceNum));
    formData.append('availabilityStatus', data.available ? 'AVAILABLE' : 'UNAVAILABLE');
    formData.append('description', data.description || '');
    formData.append('location', 'Batam');
    formData.append('city', 'Batam');
    formData.append('country', 'Indonesia');

    // Convert facilities array into a comma-separated slug string (e.g. 'free-wifi,swimming-pool,spa')
    const slugMap = {
      'Free Wi-Fi': 'free-wifi',
      'Wi-Fi': 'free-wifi',
      'Swimming Pool': 'swimming-pool',
      'Giant Swimming Pools': 'swimming-pool',
      'Spa': 'spa',
      'Restaurant': 'restaurant',
      'Free Parking': 'free-parking'
    };
    const slugs = data.facilities
      .map(fac => slugMap[fac] || fac.toLowerCase().replace(/\s+/g, '-'))
      .join(',');
    formData.append('facilitySlugs', slugs);

    // Convert add-ons to the format [{"name":"Breakfast","price":18}]
    const filteredAddOns = data.addOns
      .filter(a => a.name && a.name.trim() !== '')
      .map(a => ({
        name: a.name,
        price: parseFloat(a.price) || 0
      }));
    formData.append('addOns', JSON.stringify(filteredAddOns));

    // Helper to convert base64 to File
    const base64ToFile = (base64String, filename) => {
      if (!base64String || !base64String.startsWith('data:')) return null;
      try {
        const arr = base64String.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while(n--){
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
      } catch (err) {
        console.error("base64ToFile conversion error:", err);
        return null;
      }
    };

    if (data.image) {
      if (data.image.startsWith('data:')) {
        const fileObj = base64ToFile(data.image, 'cover_image.png');
        if (fileObj) formData.append('coverImageUrl', fileObj);
      } else {
        formData.append('coverImageUrl', data.image); // URL fallback
      }
    }

    if (data.video) {
      if (data.video.startsWith('data:')) {
        const fileObj = base64ToFile(data.video, 'video.mp4');
        if (fileObj) formData.append('videoUrl', fileObj);
      } else {
        formData.append('videoUrl', data.video); // URL fallback
      }
    }

    // Gallery images & videos
    if (data.gallery && data.gallery.length > 0) {
      data.gallery.forEach((img, idx) => {
        const urlStr = img.url;
        const cat = img.category || 'Hotel';
        const isVideo = cat.toLowerCase() === 'videos';
        const ext = isVideo ? 'mp4' : 'png';
        
        if (urlStr.startsWith('data:')) {
          const fileObj = base64ToFile(urlStr, `gallery_${cat.toLowerCase()}_${idx}.${ext}`);
          if (fileObj) {
            formData.append('galleryImages', fileObj);
            formData.append(`galleryCategories[${idx}]`, cat);
          }
        } else {
          formData.append('galleryImages', urlStr); // URL fallback
          formData.append(`galleryCategories[${idx}]`, cat);
        }
      });
      // Also append full gallery data as JSON
      formData.append('gallery', JSON.stringify(data.gallery));
    }

    // Append rooms list
    if (data.rooms && data.rooms.length > 0) {
      formData.append('rooms', JSON.stringify(data.rooms));
    }

    // Debug print Form Data keys and values
    console.log("HotelForm generated FormData entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ', pair[1]);
    }

    onSave(formData);
  };

  const onError = (formErrors) => {
    console.error("HotelForm Validation Errors:", formErrors);
  };



  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-6">
        {hotel ? `Edit Hotel: ${hotel.title}` : 'Add New Hotel'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Hotel Title"
            name="title"
            register={register}
            error={errors.title}
            placeholder="e.g. Holiday Inn Resort Batam"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Star Rating</label>
              <select
                {...register('starNum', { valueAsNumber: true })}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <FormInput
              label="Starting Price ($)"
              name="priceNum"
              type="number"
              register={register}
              error={errors.priceNum}
              placeholder="e.g. 87"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Cover Image */}
          <FormFileInput
            label="Cover Image"
            accept="image/*"
            onChange={handleImageUpload}
            placeholder="Or paste image URL (https://...)"
            valueText={imageVal}
            onTextChange={(val) => setValue('image', val)}
            error={errors.image}
            previewContent={
              imageVal && (
                <img src={imageVal} alt="Cover Preview" className="h-24 w-40 object-cover rounded-lg border" />
              )
            }
          />

          {/* Hotel Video */}
          <FormFileInput
            label="Hotel Video"
            accept="video/*"
            onChange={handleVideoUpload}
            placeholder="Or paste video URL (https://...)"
            valueText={videoVal}
            onTextChange={(val) => setValue('video', val)}
            error={errors.video}
            previewContent={
              videoVal && (
                <video src={videoVal} controls className="h-24 w-40 object-cover rounded-lg border bg-black"></video>
              )
            }
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Availability Status</label>
          <div className="flex items-center gap-4 mt-2">
            <label className="flex items-center gap-2 text-sm text-slate-700 font-semibold cursor-pointer">
              <input
                type="radio"
                checked={availableVal === true}
                onChange={() => setValue('available', true)}
                className="accent-primary"
              />
              Available (Active)
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 font-semibold cursor-pointer">
              <input
                type="radio"
                checked={availableVal === false}
                onChange={() => setValue('available', false)}
                className="accent-primary"
              />
              Fully Booked / Unavailable
            </label>
          </div>
        </div>

        <FormTextarea
          label="Description"
          name="description"
          register={register}
          error={errors.description}
          placeholder="Write details about the hotel features, location advantages, services, etc..."
        />

        {/* Popular Facilities */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-3">Popular Facilities</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
            {availableFacilitiesList.map(fac => (
              <label key={fac} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={facilitiesVal.includes(fac)}
                  onChange={() => handleFacilityChange(fac)}
                  className="rounded text-primary accent-primary focus:ring-primary"
                />
                {fac}
              </label>
            ))}
          </div>
        </div>

        {/* Gallery Photos & Videos Category Tab Manager */}
        <div className="border-t border-gray-200 pt-6">
          <label className="block text-xs font-bold text-slate-700 uppercase mb-3">Gallery Sections (Categorized)</label>
          
          {/* Horizontal scrollable tab buttons */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-thin">
            {GALLERY_CATEGORIES.map((cat) => {
              const count = galleryVal.filter(img => (img.category || 'Hotel').toLowerCase() === cat.toLowerCase()).length;
              const isActive = activeGalleryTab.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveGalleryTab(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive 
                      ? 'bg-primary text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
                <h4 className="text-sm font-bold text-slate-800">{activeGalleryTab} Gallery</h4>
                <p className="text-xs text-slate-500">Upload media specific to the {activeGalleryTab} section</p>
              </div>
              <input
                type="file"
                multiple
                accept={activeGalleryTab.toLowerCase() === 'videos' ? 'video/*' : 'image/*'}
                onChange={handleGalleryUpload}
                className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
              />
            </div>

            {/* Filtered items display */}
            {galleryVal.filter(img => (img.category || 'Hotel').toLowerCase() === activeGalleryTab.toLowerCase()).length === 0 ? (
              <div className="text-center py-8 text-xs font-semibold text-slate-400 border border-dashed border-slate-200 rounded-xl bg-white">
                No items uploaded under {activeGalleryTab} category yet.
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {galleryVal
                  .filter(img => (img.category || 'Hotel').toLowerCase() === activeGalleryTab.toLowerCase())
                  .map((img, idx) => {
                    const isVideo = (img.category || 'Hotel').toLowerCase() === 'videos';
                    return (
                      <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-white">
                        {isVideo ? (
                          <video src={img.url} className="w-full h-full object-cover bg-black" />
                        ) : (
                          <img src={img.url} alt={`Gallery ${activeGalleryTab} ${idx + 1}`} className="w-full h-full object-cover" />
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

        {/* Add-on Options Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-slate-900">Add-on Options</h3>
            <button
              type="button"
              onClick={() => appendAddOn({ name: '', price: '' })}
              className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition cursor-pointer"
            >
              + Add Option
            </button>
          </div>
          <div className="space-y-3">
            {addOnFields.map((field, idx) => (
              <div key={field.id} className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center bg-gray-50/50 sm:bg-transparent p-3 sm:p-0 rounded-xl border border-gray-100 sm:border-0">
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

        {/* Room Types Table */}
        {hotel && (
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900">Room Types & Pricing</h3>
              <button
                type="button"
                onClick={() => {
                  setEditingRoom(null);
                  setIsRoomModalOpen(true);
                }}
                className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition cursor-pointer"
              >
                + Add Room Type
              </button>
            </div>

            {roomsVal.length === 0 ? (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 text-center text-sm text-gray-500 font-semibold">
                No rooms configured for this hotel yet. Add at least one room type.
              </div>
            ) : (
              <div className="border border-gray-200 rounded-xl overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 min-w-[600px]">
                  <thead className="bg-gray-50 uppercase font-semibold text-gray-500 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3">Room Name</th>
                      <th className="px-4 py-3">Bed Info</th>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {roomsVal.map(room => (
                      <tr key={room.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-semibold text-slate-800">{room.name}</td>
                        <td className="px-4 py-3">{room.bedInfo}</td>
                        <td className="px-4 py-3">{room.size}</td>
                        <td className="px-4 py-3 font-bold text-slate-950">{room.price}/night</td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleEditRoom(room)}
                            className="text-xs text-primary font-bold hover:underline cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRoom(room.id)}
                            className="text-xs text-red-500 font-bold hover:underline cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-gray-200 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-lg text-sm text-slate-700 hover:bg-gray-50 font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold shadow-sm cursor-pointer"
          >
            Save Hotel
          </button>
        </div>
      </form>

      {/* Room CRUD Modal */}
      <RoomFormModal
        isOpen={isRoomModalOpen}
        onClose={() => {
          setIsRoomModalOpen(false);
          setEditingRoom(null);
        }}
        onSave={handleSaveRoom}
        room={editingRoom}
      />
    </div>
  );
};

export default HotelForm;
