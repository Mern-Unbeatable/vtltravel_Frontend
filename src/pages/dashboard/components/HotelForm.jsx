import React, { useState, useEffect } from 'react';
import RoomFormModal from './RoomFormModal';

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

const HotelForm = ({ hotel, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [starNum, setStarNum] = useState(4);
  const [priceNum, setPriceNum] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [gallery, setGallery] = useState(['']);
  const [rooms, setRooms] = useState([]);
  const [available, setAvailable] = useState(true);

  // Room modal state
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => {
    if (hotel) {
      setTitle(hotel.title || '');
      setStarNum(hotel.starNum || 4);
      setPriceNum(hotel.priceNum || '');
      setImage(hotel.image || '');
      setDescription(hotel.description || '');
      setFacilities(hotel.facilities || []);
      setGallery(hotel.gallery && hotel.gallery.length > 0 ? hotel.gallery : ['']);
      setRooms(hotel.rooms || []);
      setAvailable(hotel.available !== undefined ? hotel.available : true);
    }
  }, [hotel]);

  const handleFacilityChange = (facility) => {
    setFacilities(prev =>
      prev.includes(facility) ? prev.filter(f => f !== facility) : [...prev, facility]
    );
  };

  const handleGalleryChange = (index, value) => {
    const updated = [...gallery];
    updated[index] = value;
    setGallery(updated);
  };

  const addGalleryField = () => {
    setGallery([...gallery, '']);
  };

  const removeGalleryField = (index) => {
    setGallery(gallery.filter((_, idx) => idx !== index));
  };

  // Rooms CRUD within Hotel Form
  const handleSaveRoom = (savedRoom) => {
    if (editingRoom) {
      setRooms(prev => prev.map(r => r.id === savedRoom.id ? savedRoom : r));
    } else {
      setRooms(prev => [...prev, savedRoom]);
    }
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setIsRoomModalOpen(true);
  };

  const handleDeleteRoom = (roomId) => {
    setRooms(prev => prev.filter(r => r.id !== roomId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedHotel = {
      title,
      starNum: Number(starNum),
      stars: `${starNum} ★`,
      priceNum: Number(priceNum),
      price: `$${priceNum}`,
      image,
      description,
      facilities,
      gallery: gallery.filter(Boolean),
      rooms,
      available
    };
    onSave(formattedHotel);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-6">
        {hotel ? `Edit Hotel: ${hotel.title}` : 'Add New Hotel'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Hotel Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Holiday Inn Resort Batam"
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Star Rating</label>
              <select
                value={starNum}
                onChange={(e) => setStarNum(Number(e.target.value))}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Starting Price ($)</label>
              <input
                type="number"
                value={priceNum}
                onChange={(e) => setPriceNum(e.target.value)}
                required
                placeholder="e.g. 87"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Main Cover Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Availability Status</label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2 text-sm text-slate-700 font-semibold cursor-pointer">
                <input
                  type="radio"
                  checked={available === true}
                  onChange={() => setAvailable(true)}
                  className="accent-[var(--color-primary)]"
                />
                Available (Active)
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 font-semibold cursor-pointer">
                <input
                  type="radio"
                  checked={available === false}
                  onChange={() => setAvailable(false)}
                  className="accent-[var(--color-primary)]"
                />
                Fully Booked / Unavailable
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            placeholder="Write details about the hotel features, location advantages, services, etc..."
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>

        {/* Facilities Grid */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-3">Popular Facilities</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
            {availableFacilitiesList.map(fac => (
              <label key={fac} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={facilities.includes(fac)}
                  onChange={() => handleFacilityChange(fac)}
                  className="rounded text-[var(--color-primary)] accent-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                {fac}
              </label>
            ))}
          </div>
        </div>

        {/* Gallery Image URLs */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-bold text-slate-700 uppercase">Gallery Photo URLs</label>
            <button
              type="button"
              onClick={addGalleryField}
              className="text-xs text-[var(--color-primary)] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              + Add Image URL
            </button>
          </div>
          <div className="space-y-2">
            {gallery.map((url, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => handleGalleryChange(idx, e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)]"
                />
                {gallery.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeGalleryField(idx)}
                    className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 cursor-pointer"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Room Types Table */}
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

          {rooms.length === 0 ? (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 text-center text-sm text-gray-500 font-semibold">
              No rooms configured for this hotel yet. Add at least one room type.
            </div>
          ) : (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-600">
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
                  {rooms.map(room => (
                    <tr key={room.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-semibold text-slate-800">{room.name}</td>
                      <td className="px-4 py-3">{room.bedInfo}</td>
                      <td className="px-4 py-3">{room.size}</td>
                      <td className="px-4 py-3 font-bold text-slate-950">{room.price}/night</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEditRoom(room)}
                          className="text-xs text-[var(--color-primary)] font-bold hover:underline cursor-pointer"
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

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t border-gray-200 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm text-slate-700 hover:bg-gray-50 font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white rounded-lg text-sm font-semibold shadow-sm cursor-pointer"
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
