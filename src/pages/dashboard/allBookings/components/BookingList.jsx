import React, { useState, useEffect } from 'react';
import TablePagination from '../../../../components/TablePagination';
import Spinner from '../../../../components/Spinner';
import { api } from '../../../../api/apiMethods';
import { API_ENDPOINTS } from '../../../../api/endpoints';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const itemsPerPage = 7;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await api.get(API_ENDPOINTS.BOOKINGS);
        if (response.success && response.data && response.data.items) {
          setBookings(response.data.items);
        } else {
          setError('Failed to fetch bookings.');
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

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

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl my-4">
        <p className="font-semibold">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Manage All Bookings</h2>
          <p className="text-xs text-gray-500 mt-0.5">Track confirmed hotel names, room details, and ferry seat allocations below.</p>
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
              <th className="px-6 py-4">Ref / Customer</th>
              <th className="px-6 py-4">Hotel Name</th>
              <th className="px-6 py-4">Room Label</th>
              <th className="px-6 py-4">Stay Dates</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-950 block text-sm">{item.guestName || 'Guest'}</span>
                    <span className="text-xs text-gray-400 font-mono block mt-0.5">{item.bookingRef}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{item.hotel?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {item.rooms?.[0]?.roomType?.name || item.rooms?.[0]?.roomLabel || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    <span className="block">In: {formatDate(item.checkIn)}</span>
                    <span className="block">Out: {formatDate(item.checkOut)}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-950">
                    {formatCurrency(item.totalPrice, item.currency)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${getStatusBadgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedBooking(item)}
                      title="View Booking Details"
                      className="inline-flex p-1.5 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center text-gray-400">
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
              
              <div className="border-t border-gray-100 pt-3 space-y-1.5">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Hotel Name</span>
                  <span className="text-sm font-semibold text-slate-900">{item.hotel?.name || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Room Details</span>
                  <span className="text-xs text-gray-500 block truncate">{item.rooms?.[0]?.roomType?.name || item.rooms?.[0]?.roomLabel || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Stay Dates</span>
                    <span className="text-xs text-gray-500">{formatDate(item.checkIn)} - {formatDate(item.checkOut)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Amount</span>
                    <span className="text-sm font-extrabold text-slate-950">{formatCurrency(item.totalPrice, item.currency)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 border-t border-gray-100 pt-3">
                <button
                  onClick={() => setSelectedBooking(item)}
                  className="w-full py-2 text-center text-xs font-bold bg-gray-50 text-slate-700 hover:bg-slate-100 rounded-lg border border-gray-200 transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-400 text-sm">
            No bookings found
          </div>
        )}
      </div>

      {/* Pagination */}
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

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md border border-gray-200 shadow-xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-base font-bold text-slate-900">Booking Details</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-slate-600 font-bold text-xl cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Guest Name</span>
                <span className="text-sm font-semibold text-slate-900">{selectedBooking.guestName || 'Guest'}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Email Address</span>
                <span className="text-sm font-medium text-slate-600">{selectedBooking.guestEmail || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Phone</span>
                <span className="text-sm font-medium text-slate-600">{selectedBooking.guestPhoneCode || ''} {selectedBooking.guestPhone || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Hotel Name</span>
                <span className="text-sm font-bold text-primary">{selectedBooking.hotel?.name || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Room Description</span>
                <span className="text-sm text-slate-700 bg-gray-50 p-2.5 rounded-lg border border-gray-150 block mt-1 font-medium">
                  {selectedBooking.rooms?.[0]?.roomType?.name || selectedBooking.rooms?.[0]?.roomLabel || 'N/A'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Check-In</span>
                  <span className="text-sm font-medium text-slate-800">{formatDate(selectedBooking.checkIn)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Check-Out</span>
                  <span className="text-sm font-medium text-slate-800">{formatDate(selectedBooking.checkOut)}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Nights</span>
                  <span className="text-sm font-medium text-slate-800">{selectedBooking.numNights || 0}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Rooms / Adults</span>
                  <span className="text-sm font-medium text-slate-800">{selectedBooking.numRooms || 0} / {selectedBooking.numAdults || 0}</span>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Booking Reference</span>
                  <span className="text-sm font-mono font-medium text-slate-800">{selectedBooking.bookingRef}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Price</span>
                  <span className="text-base font-black text-emerald-600">{formatCurrency(selectedBooking.totalPrice, selectedBooking.currency)}</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Status</span>
                <span className={`px-2.5 py-0.5 rounded text-xs font-semibold inline-block ${getStatusBadgeClass(selectedBooking.status)}`}>
                  {selectedBooking.status}
                </span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingList;

