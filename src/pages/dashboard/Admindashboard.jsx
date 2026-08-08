import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admindashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (isLoggedIn !== 'true') {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-700 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-r border-gray-200 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center font-bold text-white text-lg">
              V
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">VTL Travel</span>
          </div>

          <nav className="space-y-1">
            <a href="#overview" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              Overview
            </a>
            <a href="#bookings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-slate-900 transition-all text-sm font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Bookings
            </a>
            <a href="#destinations" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-slate-900 transition-all text-sm font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Destinations
            </a>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all text-sm font-semibold w-full cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage bookings, destinations, and system metrics.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Live System
            </span>
          </div>
        </div>

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
      </main>
    </div>
  );
};

export default Admindashboard;
