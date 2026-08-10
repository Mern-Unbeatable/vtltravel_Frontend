import React from 'react';
import StatusCard from './StatusCard';

const StatsGrid = ({ stats }) => {
  const currency = stats?.currency || 'USD';
  const totalRevenue = stats?.totalRevenue !== undefined ? stats.totalRevenue : 0;

  // Format currency
  const formattedRevenue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(totalRevenue);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      <StatusCard title="Total Bookings" value={stats?.totalBookings ?? 0} />
      <StatusCard title="Total Hotels" value={stats?.totalHotels ?? 0} />
      <StatusCard title="Total Revenue" value={formattedRevenue} />
    </div>
  );
};

export default StatsGrid;

