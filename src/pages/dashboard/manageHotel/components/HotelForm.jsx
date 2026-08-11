import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import RoomFormModal from './RoomFormModal';
import AddOnOptions from './AddOnOptions';
import RoomTypesTable from './RoomTypesTable';
import { FormInput, FormTextarea, FormFileInput } from '../../../../components/FormFields';
import { fileToBase64 } from '../../../../utils/fileHelpers';
import { IoArrowBackOutline } from 'react-icons/io5';
import { hotelService } from '../../../../api/services/hotelService';
import { toast } from 'react-toastify';

import { 
  availableFacilitiesList, 
  GALLERY_CATEGORIES, 
  isCategoryMatch, 
  getBackendCategoryKey, 
  hotelSchema 
} from './addHotelHelper';

const HotelForm = ({ hotel, onSave, onCancel }) => {
  // Room modal sub-states
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [activeGalleryTab, setActiveGalleryTab] = useState('Hotel');
  const [roomDeleteId, setRoomDeleteId] = useState(null);
  const [isDeletingRoom, setIsDeletingRoom] = useState(false);

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

  const activeHotelId = hotel?.id || hotel?._id;

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
        const base64 = await fileToBase64(file, { maxSizeMB: 20, allowedTypes: ['video/*', 'image/*'] });
        setValue('video', base64);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const activeHotelId = hotel?.id || hotel?._id;
    // if (!activeHotelId) {
    //   toast.error("Please save the hotel details first before uploading gallery media.");
    //   return;
    // }

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const backendCategory = getBackendCategoryKey(activeGalleryTab);
      formData.append('category', backendCategory);

      if (backendCategory === 'VIDEOS') {
        formData.append('setAsVideo', 'true');
      }

      const res = await hotelService.uploadGalleryImages(activeHotelId, formData);

      toast.success(res?.message || "Media uploaded successfully!");

      const newMedia = res?.data || [];
      const formattedMedia = Array.isArray(newMedia) 
        ? newMedia.map(item => ({
            url: item.url || item.imageUrl || item,
            category: item.category || backendCategory
          }))
        : [{
            url: newMedia.url || newMedia.imageUrl || newMedia,
            category: newMedia.category || backendCategory
          }];

      setValue('gallery', [...galleryVal, ...formattedMedia]);
    } catch (err) {
      console.error("Gallery upload error:", err);
      toast.error(err?.message || "Failed to upload gallery media.");
    }
  };

  const removeGalleryImage = (url) => {
    setValue('gallery', galleryVal.filter(img => img.url !== url));
  };

  // Rooms CRUD within Hotel Form
  const handleSaveRoom = async (savedRoom) => {
    const activeHotelId = hotel?.id || hotel?._id;
    if (!activeHotelId) {
      toast.error("Error: Hotel ID is missing. Save the hotel details first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', savedRoom.name);
      formData.append('slug', savedRoom.name.toLowerCase().replace(/\s+/g, '-'));
      formData.append('description', savedRoom.description || '');
      formData.append('pricePerNight', String(savedRoom.price));
      formData.append('basePrice', String(savedRoom.price));
      formData.append('discountPrice', String(Math.round(savedRoom.price * 0.9)));
      formData.append('taxPerNight', '0');
      formData.append('roomSize', savedRoom.size);
      formData.append('sizeLabel', savedRoom.size);
      formData.append('sizesSqm', String(parseInt(savedRoom.size) || 0));
      
      const isKing = savedRoom.bedInfo.toLowerCase().includes('king');
      formData.append('bedType', isKing ? 'King' : 'Double');
      
      const bedCountMatch = savedRoom.bedInfo.match(/\d+/);
      formData.append('bedCount', bedCountMatch ? bedCountMatch[0] : '1');
      formData.append('bedInformation', savedRoom.bedInfo);
      
      const isOcean = savedRoom.tags.some(t => t.toLowerCase().includes('ocean'));
      formData.append('viewType', isOcean ? 'Ocean View' : 'City View');
      
      const bathCountMatch = savedRoom.baths.match(/\d+/);
      formData.append('bathrooms', bathCountMatch ? bathCountMatch[0] : '1');
      
      const capMatch = savedRoom.capacity.match(/\d+/);
      formData.append('maxCapacity', capMatch ? capMatch[0] : '3');
      formData.append('maxAdults', '2');
      formData.append('maxChildren', '1');
      formData.append('totalInventory', '5');
      formData.append('roomsLeftAlert', savedRoom.roomsLeft || 'Only 2 rooms left');
      
      formData.append('tags', JSON.stringify(savedRoom.tags));
      formData.append('amenityIds', JSON.stringify([]));
      
      const allAmenities = [
        ...(savedRoom.foodBeverage || []),
        ...(savedRoom.bathroom || []),
        ...(savedRoom.mediaTech || []),
        ...(savedRoom.serviceEquipment || [])
      ].map(a => a.toLowerCase().replace(/\s+/g, '-'));
      formData.append('amenitySlugs', JSON.stringify(allAmenities));
      
      formData.append('breakfastIncluded', 'true');
      formData.append('freeCancellation', 'true');
      formData.append('isMemberDeal', 'false');
      formData.append('smokingAllowed', 'false');

      // Append multiple binary files
      if (savedRoom.imageFiles && savedRoom.imageFiles.length > 0) {
        savedRoom.imageFiles.forEach(file => {
          formData.append('imageUrl', file);
        });
      }
      // Append existing image URLs
      if (savedRoom.existingImages && savedRoom.existingImages.length > 0) {
        savedRoom.existingImages.forEach(url => {
          formData.append('imageUrl', url);
        });
      }

      // Perform API call to create or update room
      let res;
      const editingRoomId = editingRoom?.id || editingRoom?._id;
      if (editingRoomId) {
        res = await hotelService.updateRoom(editingRoomId, formData);
      } else {
        res = await hotelService.addRoom(activeHotelId, formData);
      }

      const successMsg = res?.message || (editingRoomId ? "Room updated successfully!" : "Room added successfully!");
      toast.success(successMsg);

      // Add/update local form state to display it
      const newRoom = res?.data || savedRoom;
      const normalizedRoom = {
        ...newRoom,
        id: newRoom.id || newRoom._id || Date.now()
      };

      if (editingRoomId) {
        setValue('rooms', roomsVal.map(r => (r.id === editingRoomId || r._id === editingRoomId) ? normalizedRoom : r));
      } else {
        setValue('rooms', [...roomsVal, normalizedRoom]);
      }
    } catch (err) {
      console.error("Error saving room:", err);
      toast.error(err?.message || "Failed to save room details.");
      throw err;
    }
  };

  const handleEditRoom = async (room) => {
    const roomId = room.id || room._id;
    if (!roomId) return;

    try {
      const res = await hotelService.getRoomById(roomId);
      const fullRoomData = res?.data || res;
      setEditingRoom(fullRoomData);
      setIsRoomModalOpen(true);
    } catch (err) {
      console.error("Error fetching room details:", err);
      toast.error(err?.message || "Failed to fetch room details.");
    }
  };

  const handleDeleteRoom = (roomId) => {
    setRoomDeleteId(roomId);
  };

  const onSubmit = (data) => {
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

    onSave(formData);
  };

  const onError = (formErrors) => {
    console.error("HotelForm Validation Errors:", formErrors);
  };



  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-slate-900 rounded-lg hover:bg-gray-100 cursor-pointer flex items-center justify-center border border-gray-200"
          title="Back to List"
        >
          <IoArrowBackOutline className="text-lg" />
        </button>
        <h2 className="text-xl font-bold text-slate-900">
          {hotel ? `Edit Hotel: ${hotel.title || hotel.name}` : 'Add New Hotel'}
        </h2>
      </div>

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
            valueText={imageVal}
            error={errors.image}
          />

          {/* Hotel Video */}
          <FormFileInput
            label="Hotel Video"
            accept="video/*,image/*"
            onChange={handleVideoUpload}
            valueText={videoVal}
            error={errors.video}
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

        <AddOnOptions 
          register={register} 
          addOnFields={addOnFields} 
          appendAddOn={appendAddOn} 
          removeAddOn={removeAddOn} 
        />

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

        {/* Gallery Photos & Videos Category Tab Manager */}
        {activeHotelId && (
          <div className="border-t border-gray-200 pt-6">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-3">Gallery Sections (Categorized)</label>
            
            {/* Horizontal scrollable tab buttons */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-thin">
              {GALLERY_CATEGORIES.map((cat) => {
                const count = galleryVal.filter(img => isCategoryMatch(img.category, cat)).length;
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
              {galleryVal.filter(img => isCategoryMatch(img.category, activeGalleryTab)).length === 0 ? (
                <div className="text-center py-8 text-xs font-semibold text-slate-400 border border-dashed border-slate-200 rounded-xl bg-white">
                  No items uploaded under {activeGalleryTab} category yet.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {galleryVal
                    .filter(img => isCategoryMatch(img.category, activeGalleryTab))
                    .map((img, idx) => {
                      const isVideo = (img.category || 'Hotel').toLowerCase() === 'videos' || (img.category || 'Hotel').toLowerCase() === 'videos';
                      const hasVideoExtension = img.url.endsWith('.mp4') || img.url.endsWith('.mov') || img.url.startsWith('data:video/') || (img.category && img.category.toUpperCase() === 'VIDEOS');
                      return (
                        <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-white">
                          {hasVideoExtension ? (
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
        )}

        {activeHotelId && (
          <RoomTypesTable
            hotel={hotel}
            roomsVal={roomsVal}
            onAddClick={() => {
              setEditingRoom(null);
              setIsRoomModalOpen(true);
            }}
            onEditClick={handleEditRoom}
            onDeleteClick={handleDeleteRoom}
          />
        )}
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
      {/* Premium Room Deletion Confirmation Modal */}
      {roomDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md border border-gray-200 shadow-xl overflow-hidden p-6 text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Delete Room Type?</h3>
            <p className="text-sm text-slate-500">
              Are you sure you want to delete this room type? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end pt-3">
              <button
                type="button"
                disabled={isDeletingRoom}
                onClick={() => setRoomDeleteId(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-slate-700 hover:bg-gray-50 font-semibold cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingRoom}
                onClick={async () => {
                  setIsDeletingRoom(true);
                  try {
                    const res = await hotelService.deleteRoom(roomDeleteId);
                    toast.success(res?.message || "Room deleted successfully!");
                    setValue('rooms', roomsVal.filter(r => r.id !== roomDeleteId && r._id !== roomDeleteId));
                    setRoomDeleteId(null);
                  } catch (err) {
                    console.error("Error deleting room:", err);
                    toast.error(err?.message || "Failed to delete room.");
                  } finally {
                    setIsDeletingRoom(false);
                  }
                }}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeletingRoom ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelForm;
