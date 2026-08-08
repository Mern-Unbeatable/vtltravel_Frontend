import React from 'react';

const Admindashboard = () => {
  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-500 text-sm font-semibold">Total Bookings</span>
            <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold">+12%</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">1,248</p>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-500 text-sm font-semibold">Active Users</span>
            <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold">+8%</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">3,124</p>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-500 text-sm font-semibold">Revenue</span>
            <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold">+18%</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">$45,280</p>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-500 text-sm font-semibold">Pending Approvals</span>
            <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded font-bold">Action Req.</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">14</p>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">Recent Hotel & Ferry Bookings</h2>
          <button className="text-xs text-[var(--color-primary)] hover:underline font-bold cursor-pointer">View all</button>
        </div>
        <div className="overflow-x-auto">
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
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 font-semibold text-slate-950">Farhan Ahmed</td>
                <td className="px-6 py-4">Saint Martin Ferry</td>
                <td className="px-6 py-4 text-gray-500">Aug 8, 2026</td>
                <td className="px-6 py-4 font-bold text-slate-950">$120.00</td>
                <td className="px-6 py-4">
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded text-xs font-semibold">Confirmed</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-slate-950">Muntasir Rahman</td>
                <td className="px-6 py-4">Sayeman Beach Resort</td>
                <td className="px-6 py-4 text-gray-500">Aug 7, 2026</td>
                <td className="px-6 py-4 font-bold text-slate-950">$450.00</td>
                <td className="px-6 py-4">
                  <span className="bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded text-xs font-semibold">Pending</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-slate-950">Anika Tabassum</td>
                <td className="px-6 py-4">Cox's Bazar Tour Package</td>
                <td className="px-6 py-4 text-gray-500">Aug 6, 2026</td>
                <td className="px-6 py-4 font-bold text-slate-950">$890.00</td>
                <td className="px-6 py-4">
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded text-xs font-semibold">Confirmed</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Admindashboard;
