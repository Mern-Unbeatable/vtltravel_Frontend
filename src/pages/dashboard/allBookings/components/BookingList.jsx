import React, { useState } from 'react';
import Pagination from '../../../../components/Pagination';

const mockAllBookingsData = [
  { id: 1, customer: "Farhan Ahmed", email: "farhan@example.com", service: "Saint Martin Ferry", details: "Saint Martin Ferry - 3 tickets", date: "Aug 8, 2026", amount: "$120.00", status: "Confirmed" },
  { id: 2, customer: "Muntasir Rahman", email: "muntasir@example.com", service: "Sayeman Beach Resort", details: "Sayeman Beach Resort - 2 nights (Deluxe Room)", date: "Aug 7, 2026", amount: "$450.00", status: "Pending" },
  { id: 3, customer: "Anika Tabassum", email: "anika@example.com", service: "Cox's Bazar Tour", details: "Cox's Bazar Tour Package - 2 Persons", date: "Aug 6, 2026", amount: "$890.00", status: "Confirmed" },
  { id: 4, customer: "Rakib Hasan", email: "rakib@example.com", service: "Radisson Blu", details: "Radisson Blu Chittagong - 1 night", date: "Aug 5, 2026", amount: "$320.00", status: "Confirmed" },
  { id: 5, customer: "Tasnim Ara", email: "tasnim@example.com", service: "Kuakata Hotel", details: "Kuakata Beach Hotel - 3 nights", date: "Aug 4, 2026", amount: "$180.00", status: "Cancelled" },
  { id: 6, customer: "Imran Khan", email: "imran@example.com", service: "Sajek Valley Resort", details: "Sajek Valley Resort - 2 nights", date: "Aug 3, 2026", amount: "$240.00", status: "Confirmed" },
  { id: 7, customer: "Nabila Yasmin", email: "nabila@example.com", service: "Sylhet Tea Garden Tour", details: "Sylhet Tour Package - 1 Person", date: "Aug 2, 2026", amount: "$150.00", status: "Pending" },
  { id: 8, customer: "Jamil Ahmed", email: "jamil@example.com", service: "Saint Martin Ferry", details: "Saint Martin Ferry - 2 tickets", date: "Aug 1, 2026", amount: "$80.00", status: "Confirmed" },
];

const BookingList = () => {
  const [bookings, setBookings] = useState(mockAllBookingsData);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = bookings.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-600 border border-amber-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-600 border border-rose-200';
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Manage All Bookings</h2>
          <p className="text-xs text-gray-500 mt-0.5">Track, approve, or cancel hotel and ferry bookings.</p>
        </div>
        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
          Total {bookings.length} Bookings
        </span>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-[#f7f8fa] text-gray-500 uppercase text-xs font-bold border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Customer Info</th>
              <th className="px-6 py-4">Service & Details</th>
              <th className="px-6 py-4">Booking Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {currentData.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-semibold text-slate-950 block text-sm">{item.customer}</span>
                  <span className="text-xs text-gray-400 block">{item.email}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-slate-800 block text-sm">{item.service}</span>
                  <span className="text-xs text-gray-500 block line-clamp-1">{item.details}</span>
                </td>
                <td className="px-6 py-4 text-gray-500">{item.date}</td>
                <td className="px-6 py-4 font-bold text-slate-950">{item.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${getStatusBadgeClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {item.status === 'Pending' && (
                    <button
                      onClick={() => handleStatusChange(item.id, 'Confirmed')}
                      className="text-xs text-emerald-600 hover:underline font-bold cursor-pointer"
                    >
                      Confirm
                    </button>
                  )}
                  {item.status !== 'Cancelled' && (
                    <button
                      onClick={() => handleStatusChange(item.id, 'Cancelled')}
                      className="text-xs text-red-500 hover:underline font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
        {currentData.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-semibold text-slate-900 block text-sm">{item.customer}</span>
                <span className="text-xs text-gray-400 block mt-0.5">{item.email}</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${getStatusBadgeClass(item.status)}`}>
                {item.status}
              </span>
            </div>
            
            <div className="border-t border-gray-100 pt-3 space-y-1">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Service Details</span>
                <span className="text-sm font-semibold text-slate-700">{item.service}</span>
                <span className="text-xs text-gray-500 block">{item.details}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Date</span>
                  <span className="text-xs text-gray-500">{item.date}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Amount</span>
                  <span className="text-sm font-extrabold text-slate-950">{item.amount}</span>
                </div>
              </div>
            </div>

            {(item.status === 'Pending' || item.status !== 'Cancelled') && (
              <div className="flex gap-2 border-t border-gray-100 pt-3">
                {item.status === 'Pending' && (
                  <button
                    onClick={() => handleStatusChange(item.id, 'Confirmed')}
                    className="flex-1 py-2 text-center text-xs font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100/50 rounded-lg border border-emerald-200 transition cursor-pointer"
                  >
                    Confirm
                  </button>
                )}
                {item.status !== 'Cancelled' && (
                  <button
                    onClick={() => handleStatusChange(item.id, 'Cancelled')}
                    className="flex-1 py-2 text-center text-xs font-bold bg-rose-50 text-red-500 hover:bg-rose-100/50 rounded-lg border border-rose-200 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalEntries={bookings.length}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default BookingList;
