import React from 'react';

const StatusCard = ({ title, value,}) => {
 

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <div className="flex justify-between items-start mb-4">
        <span className="text-gray-500 text-sm font-semibold">{title}</span>
        
      </div>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
};

export default StatusCard;
