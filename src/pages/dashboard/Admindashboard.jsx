import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HotelList from './components/HotelList';
import HotelForm from './components/HotelForm';
import { useAuth } from '../../context/AuthContext';
import {
  useHotels,
  useAddHotel,
  useUpdateHotel,
  useDeleteHotel,
} from '../../hooks/useHotels';

const Admindashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'hotels'
  const { isAuthenticated, logout } = useAuth();
  
  // CMS view state
  const [cmsMode, setCmsMode] = useState('list'); // 'list' | 'add' | 'edit'
  const [editingHotel, setEditingHotel] = useState(null);

  // TanStack Query hooks
  const { data: hotels = [], isLoading, isError } = useHotels();
  const addHotelMutation = useAddHotel();
  const updateHotelMutation = useUpdateHotel();
  const deleteHotelMutation = useDeleteHotel();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveHotel = async (formattedHotel) => {
    try {
      if (cmsMode === 'edit' && editingHotel) {
        await updateHotelMutation.mutateAsync({
          id: editingHotel.id,
          hotelData: formattedHotel,
        });
      } else {
        await addHotelMutation.mutateAsync(formattedHotel);
      }
      setCmsMode('list');
      setEditingHotel(null);
    } catch (err) {
      console.error('Error saving hotel:', err);
    }
  };

  const handleEditClick = (hotel) => {
    setEditingHotel(hotel);
    setCmsMode('edit');
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this hotel listing?')) {
      try {
        await deleteHotelMutation.mutateAsync(id);
      } catch (err) {
        console.error('Error deleting hotel:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-700 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-r border-gray-200 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center font-bold text-white text-lg">
              V
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">VTL Travel</span>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => { setActiveTab('overview'); setCmsMode('list'); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm w-full transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-slate-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              Overview
            </button>
            
            <button
              onClick={() => { setActiveTab('hotels'); setCmsMode('list'); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm w-full transition-all cursor-pointer ${
                activeTab === 'hotels'
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-slate-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Hotels CMS
            </button>
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
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Console</h1>
            <p className="text-gray-500 mt-1">
              {activeTab === 'overview'
                ? 'Manage bookings, destinations, and system metrics.'
                : 'Configure and update hotels, rooms, facilities, and galleries.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Live System
            </span>
          </div>
        </div>

        {/* Tab Contents */}
        {activeTab === 'overview' && (
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
        )}

        {activeTab === 'hotels' && (
          <div className="space-y-6">
            {cmsMode === 'list' && (
              isLoading ? (
                <div className="flex justify-center items-center py-16 bg-white border border-gray-200 rounded-2xl shadow-sm">
                  <svg className="animate-spin h-8 w-8 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              ) : isError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600 font-semibold">
                  Failed to load hotel listings.
                </div>
              ) : (
                <HotelList
                  hotels={hotels}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  onAddNew={() => setCmsMode('add')}
                />
              )
            )}
            {(cmsMode === 'add' || cmsMode === 'edit') && (
              <HotelForm
                hotel={cmsMode === 'edit' ? editingHotel : null}
                onSave={handleSaveHotel}
                onCancel={() => { setCmsMode('list'); setEditingHotel(null); }}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admindashboard;
