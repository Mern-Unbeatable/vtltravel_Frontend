import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormInput, FormFileInput } from '../../../../components/FormFields';
import { fileToBase64 } from '../../../../utils/fileHelpers';

const roomSchema = z.object({
  name: z.string().min(1, 'Room name is required'),
  price: z.string().min(1, 'Price is required'),
  size: z.string().min(1, 'Size is required'),
  capacity: z.string().default('3 pers. max'),
  bedInfo: z.string().default('1 King size bed(s)'),
  tags: z.string().default(''),
  image: z.string().default(''),
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
      size: '',
      capacity: '3 pers. max',
      bedInfo: '1 King size bed(s)',
      tags: '',
      image: '',
      roomsLeft: 'Only 2 rooms left',
    },
  });

  const imageVal = watch('image');

  useEffect(() => {
    if (room && isOpen) {
      reset({
        name: room.name || '',
        price: room.price ? room.price.replace('$', '') : '',
        size: room.size || '',
        capacity: room.capacity || '3 pers. max',
        bedInfo: room.bedInfo || '1 King size bed(s)',
        tags: room.tags ? room.tags.join(', ') : '',
        image: room.image || '',
        roomsLeft: room.roomsLeft || 'Only 2 rooms left',
      });
    } else if (isOpen) {
      reset({
        name: '',
        price: '',
        size: '',
        capacity: '3 pers. max',
        bedInfo: '1 King size bed(s)',
        tags: '',
        image: '',
        roomsLeft: 'Only 2 rooms left',
      });
    }
  }, [room, isOpen, reset]);

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

  if (!isOpen) return null;

  const onSubmit = (data) => {
    const formattedRoom = {
      id: room ? room.id : Date.now(),
      name: data.name,
      price: `$${data.price}`,
      size: data.size,
      capacity: data.capacity,
      bedInfo: data.bedInfo,
      tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
      image: data.image || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
      roomsLeft: data.roomsLeft,
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
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-slate-600 font-bold text-xl cursor-pointer">&times;</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-4">
          <FormInput
            label="Room Name / Title"
            name="name"
            register={register}
            error={errors.name}
            placeholder="e.g. DELUXE SUITE, 1 King Size Bed, Ocean View"
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Price per Night ($)"
              name="price"
              type="number"
              register={register}
              error={errors.price}
              placeholder="e.g. 150"
            />
            <FormInput
              label="Room Size"
              name="size"
              register={register}
              error={errors.size}
              placeholder="e.g. 45m²"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Max Capacity"
              name="capacity"
              register={register}
              error={errors.capacity}
              placeholder="e.g. 3 pers. max"
            />
            <FormInput
              label="Bed Information"
              name="bedInfo"
              register={register}
              error={errors.bedInfo}
              placeholder="e.g. 1 King size bed(s)"
            />
          </div>

          <FormInput
            label="Rooms Left Alert"
            name="roomsLeft"
            register={register}
            error={errors.roomsLeft}
            placeholder="e.g. Only 2 rooms left or 5 rooms left"
          />

          <FormInput
            label="Tags (comma separated)"
            name="tags"
            register={register}
            error={errors.tags}
            placeholder="e.g. Ocean View, Private Balcony, Bathtub"
          />

          <FormFileInput
            label="Room Photo"
            accept="image/*"
            onChange={handleImageUpload}
            placeholder="Or paste direct image URL (https://...)"
            valueText={imageVal}
            onTextChange={(val) => setValue('image', val)}
            previewContent={
              imageVal && (
                <img src={imageVal} alt="Room Preview" className="h-24 w-40 object-cover rounded-lg border" />
              )
            }
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
