import React from 'react';
import StatusCard from './StatusCard';

const StatsGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <StatusCard title="Total Bookings" value="1,248"/>
      <StatusCard title="Total Hotels" value="156"/>
      <StatusCard title="Revenue" value="$45,280"/>
      <StatusCard title="Total Rooms" value="450"/>
    </div>
  );
};

export default StatsGrid;
