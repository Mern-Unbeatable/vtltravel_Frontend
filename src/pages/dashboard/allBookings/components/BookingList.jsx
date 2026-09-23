import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import TablePagination from '../../../../components/TablePagination';
import Spinner from '../../../../components/Spinner';
import ConfirmDeleteModal from '../../manageHotel/components/ConfirmDeleteModal';
import { api } from '../../../../api/apiMethods';
import { API_ENDPOINTS } from '../../../../api/endpoints';
import { bookingService } from '../../../../api/services/bookingService';

const PAGE_LIMIT = 20;
const FETCH_LIMIT = 100;

const matchesBookingSearch = (booking, query) => {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return true;

  const phone = `${booking.guestPhoneCode || ''} ${booking.guestPhone || ''}`.toLowerCase();
  const amountRaw = booking.totalPrice ?? booking.amount ?? '';
  const amountNum = Number(amountRaw);
  const amountText = Number.isFinite(amountNum)
    ? `${amountNum} ${amountNum.toFixed(2)} $${amountNum} $${amountNum.toFixed(2)}`
    : String(amountRaw);

  const roomLabel =
    booking.rooms?.[0]?.roomType?.name ||
    booking.rooms?.[0]?.roomLabel ||
    '';

  const haystack = [
    booking.guestName,
    booking.guestEmail,
    booking.guestPhone,
    booking.guestPhoneCode,
    phone,
    booking.bookingRef,
    booking.hotel?.name,
    booking.hotelName,
    roomLabel,
    amountText,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(q);
};

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [summary, setSummary] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteResult, setDeleteResult] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const collected = [];
      let page = 1;
      let totalPages = 1;
      let latestSummary = null;

      do {
        const response = await api.get(API_ENDPOINTS.BOOKINGS, {
          params: {
            page,
            limit: FETCH_LIMIT,
          },
        });

        if (!response.success || !response.data) {
          setError('Failed to fetch bookings.');
          return;
        }

        const items = Array.isArray(response.data.items) ? response.data.items : [];
        collected.push(...items);

        const p = response.data.pagination || {};
        totalPages = Math.max(1, Number(p.totalPages) || 1);
        latestSummary = response.data.summary || latestSummary;
        page += 1;
      } while (page <= totalPages && page <= 50);

      // Deduplicate by id in case API overlaps pages
      const unique = [];
      const seen = new Set();
      collected.forEach((item) => {
        const key = item?.id || item?._id || item?.bookingRef;
        if (!key || seen.has(key)) {
          if (!key) unique.push(item);
          return;
        }
        seen.add(key);
        unique.push(item);
      });

      setBookings(unique);
      setSummary(latestSummary);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const openDeleteModal = (booking) => {
    setDeleteTarget(booking);
    setDeleteResult(null);
    setIsDeleting(false);
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
    setDeleteResult(null);
    setIsDeleting(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.id) return;
    setIsDeleting(true);
    try {
      const response = await bookingService.deleteBooking(deleteTarget.id);
      if (response && response.success) {
        setDeleteResult({
          success: true,
          message: response.message || 'Booking deleted successfully.',
        });
        if (selectedBooking?.id === deleteTarget.id) {
          setSelectedBooking(null);
        }
        setBookings((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      } else {
        setDeleteResult({
          success: false,
          message: response?.message || 'Failed to delete booking.',
        });
      }
    } catch (err) {
      setDeleteResult({
        success: false,
        message: err?.message || 'Failed to delete booking.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredBookings = useMemo(
    () =>
      searchQuery
        ? bookings.filter((item) => matchesBookingSearch(item, searchQuery))
        : bookings,
    [bookings, searchQuery],
  );

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredBookings.length / PAGE_LIMIT));
    if (currentPage > maxPage) setCurrentPage(maxPage);
  }, [filteredBookings.length, currentPage]);

  const totalEntries = filteredBookings.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / PAGE_LIMIT));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_LIMIT;
  const endIndex = startIndex + PAGE_LIMIT;
  const visibleBookings = filteredBookings.slice(startIndex, endIndex);
  const badgeTotal = searchQuery
    ? totalEntries
    : Number(summary?.totalBookings) || bookings.length;

  const handlePageChange = (pageNumber) => {
    const maxPage = Math.max(1, Math.ceil(filteredBookings.length / PAGE_LIMIT));
    if (pageNumber >= 1 && pageNumber <= maxPage && pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setCurrentPage(1);
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

  if (loading && bookings.length === 0) {
    return <Spinner />;
  }

  if (error && bookings.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl my-4">
        <p className="font-semibold">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900">Manage All Bookings</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Track confirmed hotel names, room details, and ferry seat allocations below.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto lg:max-w-xl lg:flex-1 lg:justify-end">
            <div className="relative w-full sm:min-w-[280px] lg:max-w-md">
              <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search customer, hotel, room, price..."
                value={searchInput}
                onChange={handleSearchChange}
                className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-all"
              />
            </div>
            {searchInput ? (
              <button
                type="button"
                onClick={clearSearch}
                className="shrink-0 text-xs font-semibold text-slate-600 hover:text-primary cursor-pointer self-start sm:self-center"
              >
                Clear
              </button>
            ) : null}
            <span className="self-start sm:self-center text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full whitespace-nowrap">
              {searchQuery ? `Found ${badgeTotal}` : `Total ${badgeTotal}`} Bookings
            </span>
          </div>
        </div>
      </div>

      {error ? (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          <p className="text-sm">{error}</p>
        </div>
      ) : null}

      {/* Desktop Table View */}
      <div className={`hidden md:block overflow-x-auto ${loading ? 'opacity-60' : ''}`}>
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
            {visibleBookings.length > 0 ? (
              visibleBookings.map((item) => (
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
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedBooking(item)}
                        title="View Booking Details"
                        className="inline-flex p-1.5 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-lg transition cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => openDeleteModal(item)}
                        title="Delete Booking"
                        className="inline-flex p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center text-gray-400">
                  {searchQuery ? 'No bookings match your search' : 'No bookings found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className={`grid grid-cols-1 gap-4 p-4 md:hidden ${loading ? 'opacity-60' : ''}`}>
        {visibleBookings.length > 0 ? (
          visibleBookings.map((item) => (
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
                  type="button"
                  onClick={() => setSelectedBooking(item)}
                  className="flex-1 py-2 text-center text-xs font-bold bg-gray-50 text-slate-700 hover:bg-slate-100 rounded-lg border border-gray-200 transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Details
                </button>
                <button
                  type="button"
                  onClick={() => openDeleteModal(item)}
                  className="py-2 px-3 text-center text-xs font-bold bg-gray-50 text-red-500 hover:bg-red-50 rounded-lg border border-gray-200 transition cursor-pointer flex items-center justify-center"
                  title="Delete Booking"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-400 text-sm">
            {searchQuery ? 'No bookings match your search' : 'No bookings found'}
          </div>
        )}
      </div>

      {/* Client-side pagination */}
      {totalEntries > PAGE_LIMIT && (
        <TablePagination
          currentPage={safePage}
          totalPages={totalPages}
          totalEntries={totalEntries}
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

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        isDeleting={isDeleting}
        deleteResult={deleteResult}
        onConfirm={handleConfirmDelete}
        onClose={closeDeleteModal}
        title="Delete Booking?"
        description={`Are you sure you want to permanently delete booking ${deleteTarget?.bookingRef || ''}? This cannot be undone and may allow the related hotel to be deleted afterward.`}
      />
    </div>
  );
};

export default BookingList;

