import React, { useState } from 'react';
import Pagination from '../../../../components/Pagination';

const mockAllBookingsData = [
  { id: 1, customer: "Farhan Ahmed", email: "farhan@example.com", service: "Saint Martin Ferry", hotelName: "Keari Sinbad Ferry", roomType: "Royal Class Cabin (3 Seats)", date: "Aug 8, 2026", amount: "$120.00", status: "Confirmed" },
  { id: 2, customer: "Muntasir Rahman", email: "muntasir@example.com", service: "Hotel Stay", hotelName: "Sayeman Beach Resort", roomType: "Deluxe Ocean View Double Suite (2 nights)", date: "Aug 7, 2026", amount: "$450.00", status: "Confirmed" },
  { id: 3, customer: "Anika Tabassum", email: "anika@example.com", service: "Tour Package", hotelName: "Cox's Bazar Premium Package", roomType: "Couple AC Suite - 3 days package", date: "Aug 6, 2026", amount: "$890.00", status: "Confirmed" },
  { id: 4, customer: "Rakib Hasan", email: "rakib@example.com", service: "Hotel Stay", hotelName: "Radisson Blu Chittagong", roomType: "Superior Executive King Room (1 night)", date: "Aug 5, 2026", amount: "$320.00", status: "Confirmed" },
  { id: 5, customer: "Tasnim Ara", email: "tasnim@example.com", service: "Hotel Stay", hotelName: "Kuakata Beach Hotel", roomType: "Standard Twin Bed Room (3 nights)", date: "Aug 4, 2026", amount: "$180.00", status: "Confirmed" },
  { id: 6, customer: "Imran Khan", email: "imran@example.com", service: "Hotel Stay", hotelName: "Sajek Valley Resort", roomType: "Premium Wooden Cottage (2 nights)", date: "Aug 3, 2026", amount: "$240.00", status: "Confirmed" },
  { id: 7, customer: "Nabila Yasmin", email: "nabila@example.com", service: "Tour Package", hotelName: "Sylhet Tea Garden Tour", roomType: "Eco Cottage Suite (1 night stay)", date: "Aug 2, 2026", amount: "$150.00", status: "Confirmed" },
  { id: 8, customer: "Jamil Ahmed", email: "jamil@example.com", service: "Saint Martin Ferry", hotelName: "Green Line Water Bus", roomType: "Premium First Class Cabin (2 tickets)", date: "Aug 1, 2026", amount: "$80.00", status: "Confirmed" },
];

const BookingList = () => {
  const [bookings] = useState(mockAllBookingsData);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
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

  const getStatusBadgeClass = () => {
    return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
  };

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
              <th className="px-6 py-4">Customer Info</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Hotel / Operator</th>
              <th className="px-6 py-4">Room / Details</th>
              <th className="px-6 py-4">Date</th>
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
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-slate-50 text-slate-600 border-slate-200 uppercase">
                    {item.service}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-900">{item.hotelName}</td>
                <td className="px-6 py-4 text-slate-500 text-xs">{item.roomType}</td>
                <td className="px-6 py-4 text-gray-500">{item.date}</td>
                <td className="px-6 py-4 font-bold text-slate-950">{item.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${getStatusBadgeClass()}`}>
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
              <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${getStatusBadgeClass()}`}>
                {item.status}
              </span>
            </div>
            
            <div className="border-t border-gray-100 pt-3 space-y-1.5">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Category</span>
                <span className="text-xs font-bold text-slate-700 uppercase">{item.service}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Hotel / Operator</span>
                <span className="text-sm font-semibold text-slate-900">{item.hotelName}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Room / Details</span>
                <span className="text-xs text-gray-500 block">{item.roomType}</span>
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
            <div className="p-6 space-y-4">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Customer Name</span>
                <span className="text-sm font-semibold text-slate-900">{selectedBooking.customer}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Email Address</span>
                <span className="text-sm font-medium text-slate-600">{selectedBooking.email}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Service Category</span>
                <span className="text-sm font-semibold text-slate-900">{selectedBooking.service}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Hotel / Operator Name</span>
                <span className="text-sm font-bold text-primary">{selectedBooking.hotelName}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Room Config / Seat Details</span>
                <span className="text-sm text-slate-700 bg-gray-50 p-2.5 rounded-lg border border-gray-150 block mt-1 font-medium">
                  {selectedBooking.roomType}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Booking Date</span>
                  <span className="text-sm font-medium text-slate-800">{selectedBooking.date}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Amount Paid</span>
                  <span className="text-base font-black text-emerald-600">{selectedBooking.amount}</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Status</span>
                <span className={`px-2.5 py-0.5 rounded text-xs font-semibold inline-block ${getStatusBadgeClass()}`}>
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
