import React, { useState } from "react";
import TablePagination from "../../../../components/TablePagination";
import { IoEyeOutline, IoSearchOutline } from "react-icons/io5";

const mockPaymentsData = [
  { id: 1, txnId: "TXN-8742910", customer: "Farhan Ahmed", email: "farhan@example.com", service: "Saint Martin Ferry", amount: "$120.00", method: "Bkash", status: "Completed", date: "Aug 8, 2026" },
  { id: 2, txnId: "TXN-1294875", customer: "Muntasir Rahman", email: "muntasir@example.com", service: "Hotel Stay", amount: "$450.00", method: "Credit Card", status: "Completed", date: "Aug 7, 2026" },
  { id: 3, txnId: "TXN-5930214", customer: "Anika Tabassum", email: "anika@example.com", service: "Tour Package", amount: "$890.00", method: "Bank Transfer", status: "Completed", date: "Aug 6, 2026" },
  { id: 4, txnId: "TXN-9038241", customer: "Rakib Hasan", email: "rakib@example.com", service: "Hotel Stay", amount: "$320.00", method: "Bkash", status: "Completed", date: "Aug 5, 2026" },
  { id: 5, txnId: "TXN-2938475", customer: "Tasnim Ara", email: "tasnim@example.com", service: "Hotel Stay", amount: "$180.00", method: "Nagad", status: "Failed", date: "Aug 4, 2026" },
  { id: 6, txnId: "TXN-8594032", customer: "Imran Khan", email: "imran@example.com", service: "Hotel Stay", amount: "$240.00", method: "PayPal", status: "Pending", date: "Aug 3, 2026" },
  { id: 7, txnId: "TXN-4920394", customer: "Nabila Yasmin", email: "nabila@example.com", service: "Tour Package", amount: "$150.00", method: "Credit Card", status: "Completed", date: "Aug 2, 2026" },
  { id: 8, txnId: "TXN-3829104", customer: "Jamil Ahmed", email: "jamil@example.com", service: "Saint Martin Ferry", amount: "$80.00", method: "Bkash", status: "Completed", date: "Aug 1, 2026" },
];

const PaymentList = () => {
  // Only show Completed payments
  const completedPayments = mockPaymentsData.filter(item => item.status === "Completed");
  const [payments, setPayments] = useState(completedPayments);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filters logic
  const filteredPayments = payments.filter((item) => {
    return (
      item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.txnId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredPayments.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Table Header & Controls */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Payment History</h2>
            <p className="text-xs text-gray-500 mt-0.5">View and trace checkout bills, transaction statuses, and payments.</p>
          </div>
          <span className="self-start sm:self-auto text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            Total {filteredPayments.length} Completed Transactions
          </span>
        </div>

        {/* Search bar */}
        <div className="mt-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search by Txn ID, customer, email..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-[#f7f8fa] text-gray-500 uppercase text-xs font-bold border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Customer Info</th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">{item.txnId}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-950 block text-sm">{item.customer}</span>
                    <span className="text-xs text-gray-400 block">{item.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-slate-50 text-slate-600 border-slate-200 uppercase">
                      {item.service}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{item.date}</td>
                  <td className="px-6 py-4 font-bold text-slate-950">{item.amount}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedPayment(item)}
                      className="inline-flex p-1.5 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-lg transition cursor-pointer"
                      title="View Details"
                    >
                      <IoEyeOutline className="text-lg" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-400 font-medium">
                  No payment histories found
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
                  <span className="font-semibold text-slate-900 block text-sm">{item.customer}</span>
                  <span className="text-xs text-gray-400 block">{item.email}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                  {item.status}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-gray-100 pt-3 text-xs text-slate-500">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Txn ID</span>
                  <span className="font-mono font-bold text-slate-700">{item.txnId}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Amount</span>
                  <span className="font-extrabold text-slate-950 text-sm">{item.amount}</span>
                </div>
              </div>

              <div className="flex gap-2 border-t border-gray-100 pt-3">
                <button
                  onClick={() => setSelectedPayment(item)}
                  className="w-full py-2 text-center text-xs font-bold bg-gray-50 text-slate-700 hover:bg-slate-100 rounded-lg border border-gray-200 transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <IoEyeOutline className="text-sm" />
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400 font-medium">
            No payment histories found
          </div>
        )}
      </div>

      {/* Reusable Table Pagination Component */}
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalEntries={filteredPayments.length}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={handlePageChange}
      />

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md border border-gray-200 shadow-xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Transaction Details</h3>
                <p className="text-xs text-gray-500 font-mono mt-0.5">{selectedPayment.txnId}</p>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-gray-400 hover:text-slate-800 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Customer</span>
                  <span className="text-sm font-semibold text-slate-900">{selectedPayment.customer}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Email Address</span>
                  <span className="text-sm font-semibold text-slate-900">{selectedPayment.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Service Category</span>
                  <span className="text-sm font-semibold text-slate-900">{selectedPayment.service}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Billing Date</span>
                  <span className="text-sm font-semibold text-slate-900">{selectedPayment.date}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Transaction Status</span>
                  <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 mt-1">
                    {selectedPayment.status}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-700">Total Amount Paid</span>
                <span className="text-2xl font-extrabold text-slate-950">{selectedPayment.amount}</span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentList;
