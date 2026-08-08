import React from 'react';

const StatsGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-start mb-4">
          <span className="text-gray-500 text-sm font-semibold">Total Bookings</span>
          <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold">+12%</span>
        </div>
        <p className="text-3xl font-bold text-slate-900">1,248</p>
      </div>

      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-start mb-4">
          <span className="text-gray-500 text-sm font-semibold">Total Hotels</span>
          <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold">+8%</span>
        </div>
        <p className="text-3xl font-bold text-slate-900">156</p>
      </div>

      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-start mb-4">
          <span className="text-gray-500 text-sm font-semibold">Revenue</span>
          <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold">+18%</span>
        </div>
        <p className="text-3xl font-bold text-slate-900">$45,280</p>
      </div>

      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-start mb-4">
          <span className="text-gray-500 text-sm font-semibold">Total Rooms</span>
          <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold">+12%</span>
        </div>
        <p className="text-3xl font-bold text-slate-900">450</p>
      </div>
    </div>
  );
};

export default StatsGrid;
