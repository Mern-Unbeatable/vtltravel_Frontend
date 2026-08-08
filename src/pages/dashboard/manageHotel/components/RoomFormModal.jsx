import React, { useState, useEffect } from 'react';

const RoomFormModal = ({ isOpen, onClose, onSave, room }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [capacity, setCapacity] = useState('3 pers. max');
  const [bedInfo, setBedInfo] = useState('1 King size bed(s)');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState('');
  const [roomsLeft, setRoomsLeft] = useState('Only 2 rooms left');

  useEffect(() => {
    if (room) {
      setName(room.name || '');
      setPrice(room.price ? room.price.replace('$', '') : '');
      setSize(room.size || '');
      setCapacity(room.capacity || '3 pers. max');
      setBedInfo(room.bedInfo || '1 King size bed(s)');
      setTags(room.tags ? room.tags.join(', ') : '');
      setImage(room.image || '');
      setRoomsLeft(room.roomsLeft || 'Only 2 rooms left');
    } else {
      setName('');
      setPrice('');
      setSize('');
      setCapacity('3 pers. max');
      setBedInfo('1 King size bed(s)');
      setTags('');
      setImage('');
      setRoomsLeft('Only 2 rooms left');
    }
  }, [room, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedRoom = {
      id: room ? room.id : Date.now(),
      name,
      price: `$${price}`,
      size,
      capacity,
      bedInfo,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      image: image || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
      roomsLeft,
    };
    onSave(formattedRoom);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl border border-gray-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-slate-900">
            {room ? 'Edit Room Type' : 'Add New Room Type'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-slate-600 font-bold text-xl cursor-pointer">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Room Name / Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. DELUXE SUITE, 1 King Size Bed, Ocean View"
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Price per Night ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                placeholder="e.g. 150"
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Room Size</label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                required
                placeholder="e.g. 45m²"
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Max Capacity</label>
              <input
                type="text"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
                placeholder="e.g. 3 pers. max"
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Bed Information</label>
              <input
                type="text"
                value={bedInfo}
                onChange={(e) => setBedInfo(e.target.value)}
                required
                placeholder="e.g. 1 King size bed(s)"
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Rooms Left Alert</label>
            <input
              type="text"
              value={roomsLeft}
              onChange={(e) => setRoomsLeft(e.target.value)}
              placeholder="e.g. Only 2 rooms left or 5 rooms left"
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. Ocean View, Private Balcony, Bathtub"
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Photo URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

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
              className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white rounded-lg text-sm font-semibold cursor-pointer"
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
