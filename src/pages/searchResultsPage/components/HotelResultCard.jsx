import React from 'react';
import { HiOutlinePhotograph } from 'react-icons/hi';

export default function HotelResultCard({ hotel }) {
  // Fallbacks to match the image design
  const title = hotel?.title || "Holiday Inn Resort Batam";
  const stars = hotel?.stars || "4 Hotels";
  const imageUrl = hotel?.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80";
  const price = hotel?.price || "$87";
  const brandText = hotel?.brandText || "Brand Logo";

  return (
    <article className="flex w-full  flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:flex-row">
      
      {/* Image Section - Adjusts height on mobile, fixed width on desktop */}
      <div className="relative h-[240px] w-full shrink-0 md:h-[280px] md:w-[320px]">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover"
        />
        
        {/* Top-Left Logo */}
        <div className="absolute left-3 top-3 rounded-lg bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-xs">
          {brandText}
        </div>

        {/* Bottom-Left Image Count */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-xs">
          <HiOutlinePhotograph className="h-4 w-4" />
          <span>1/6</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
        
        {/* Top Info */}
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
            {title}
          </h3>
          <p className="mt-1 text-sm font-medium text-gray-500">
            {stars}
          </p>
        </div>

        {/* Bottom Section - Stacks on mobile, inline on desktop */}
        <div className="flex flex-col-reverse gap-5 md:flex-row md:items-end md:justify-between md:gap-0">
          
          {/* Price Calendar Link */}
          <a
            href="#calendar"
            className="text-sm font-medium text-[#2d9cdb] hover:underline"
          >
            See price calendar
          </a>

          {/* Price & Action - Left aligned on mobile, Right aligned on desktop */}
          <div className="flex flex-col items-start text-left md:items-end md:text-right">
            
            {/* Price Row */}
            <div className="flex items-baseline gap-1">
              <span className="text-sm text-gray-500">From</span>
              <span className="text-3xl font-extrabold text-[#2d9cdb] md:text-4xl">
                {price}
              </span>
            </div>

            {/* Public Rate */}
            <p className="mt-1 text-sm font-medium text-slate-900">
              Public rate from <span className="font-bold">$96</span>
            </p>

            {/* Details */}
            <p className="mt-0.5 text-xs text-gray-400">
              1 night - 1 adult - Taxes not included : $15
            </p>

            {/* Button - Full width on mobile, auto on desktop */}
            <button
              type="button"
              className="mt-4 w-full rounded-full bg-[#2d9cdb] px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-[#2680b4] active:scale-95 md:w-auto"
            >
              See the hotel
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}