import React, { useState } from 'react';
import Pagination from '../../../../components/Pagination';

const mockBookings = [
  { id: 1, customer: "Farhan Ahmed", service: "Saint Martin Ferry", date: "Aug 8, 2026", amount: "$120.00", status: "Confirmed" },
  { id: 2, customer: "Muntasir Rahman", service: "Sayeman Beach Resort", date: "Aug 7, 2026", amount: "$450.00", status: "Pending" },
  { id: 3, customer: "Anika Tabassum", service: "Cox's Bazar Tour Package", date: "Aug 6, 2026", amount: "$890.00", status: "Confirmed" },
  { id: 4, customer: "Rakib Hasan", service: "Radisson Blu Chittagong", date: "Aug 5, 2026", amount: "$320.00", status: "Confirmed" },
  { id: 5, customer: "Tasnim Ara", service: "Kuakata Beach Hotel", date: "Aug 4, 2026", amount: "$180.00", status: "Cancelled" },
  { id: 6, customer: "Imran Khan", service: "Sajek Valley Resort", date: "Aug 3, 2026", amount: "$240.00", status: "Confirmed" },
  { id: 7, customer: "Nabila Yasmin", service: "Sylhet Tea Garden Tour", date: "Aug 2, 2026", amount: "$150.00", status: "Pending" },
];

const RecentActivityTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const totalPages = Math.ceil(mockBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = mockBookings.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
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
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white">
        <h2 className="text-lg font-bold text-slate-900">Recent Hotel & Ferry Bookings</h2>
        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
          Total {mockBookings.length} bookings
        </span>
      </div>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-[#f7f8fa] text-gray-500 uppercase text-xs font-bold border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {currentData.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-950">{item.customer}</td>
                <td className="px-6 py-4">{item.service}</td>
                <td className="px-6 py-4 text-gray-500">{item.date}</td>
                <td className="px-6 py-4 font-bold text-slate-950">{item.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${getStatusBadgeClass(item.status)}`}>
                    {item.status}
                  </span>
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
                <span className="text-xs text-gray-500 block mt-0.5">{item.date}</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${getStatusBadgeClass(item.status)}`}>
                {item.status}
              </span>
            </div>
            
            <div className="flex justify-between items-center border-t border-gray-100 pt-3">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Service</span>
                <span className="text-sm font-medium text-slate-700">{item.service}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Amount</span>
                <span className="text-sm font-extrabold text-slate-950">{item.amount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalEntries={mockBookings.length}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default RecentActivityTable;
