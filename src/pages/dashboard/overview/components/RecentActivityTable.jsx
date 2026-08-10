import React, { useState } from 'react';
import TablePagination from '../../../../components/TablePagination';

const RecentActivityTable = ({ bookings = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = bookings.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
      case 'PAID':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      case 'PENDING':
        return 'bg-amber-50 text-amber-600 border border-amber-200';
      case 'CANCELLED':
      case 'FAILED':
        return 'bg-rose-50 text-rose-600 border border-rose-200';
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount, currency) => {
    const value = parseFloat(amount);
    if (isNaN(value)) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(value);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white">
        <h2 className="text-lg font-bold text-slate-900">Recent Hotel & Ferry Bookings</h2>
        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
          Total {bookings.length} bookings
        </span>
      </div>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-[#f7f8fa] text-gray-500 uppercase text-xs font-bold border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Ref / Customer</th>
              <th className="px-6 py-4">Hotel & Room</th>
              <th className="px-6 py-4">Check In/Out</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-950 block">{item.guestName || 'Guest'}</span>
                    <span className="text-xs text-gray-400 font-mono block mt-0.5">{item.bookingRef}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-900 block">{item.hotel?.name || 'N/A'}</span>
                    <span className="text-xs text-gray-500 block mt-0.5">
                      {item.rooms?.[0]?.roomType?.name || item.rooms?.[0]?.roomLabel || 'No room selected'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <span className="block text-xs">In: {formatDate(item.checkIn)}</span>
                    <span className="block text-xs">Out: {formatDate(item.checkOut)}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-950">
                    {formatCurrency(item.totalPrice, item.currency)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${getStatusBadgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-400">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
        {currentData.length > 0 ? (
          currentData.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-semibold text-slate-900 block text-sm">{item.guestName || 'Guest'}</span>
                  <span className="text-xs text-gray-400 font-mono block mt-0.5">{item.bookingRef}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${getStatusBadgeClass(item.status)}`}>
                  {item.status}
                </span>
              </div>
              
              <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                <div className="max-w-[60%]">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Hotel</span>
                  <span className="text-sm font-medium text-slate-700 truncate block">{item.hotel?.name || 'N/A'}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Amount</span>
                  <span className="text-sm font-extrabold text-slate-950">{formatCurrency(item.totalPrice, item.currency)}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-400 text-sm">
            No bookings found
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalEntries={bookings.length}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default RecentActivityTable;

