import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { IoMenuOutline } from "react-icons/io5";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, logout } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Determine active title based on path
  const getPageTitle = () => {
    if (location.pathname === "/admin/hotels") {
      return null;
    }
    if (location.pathname === "/admin/bookings") {
      return "Manage All Bookings";
    }
    if (location.pathname === "/admin/payments") {
      return "Payment History";
    }
    if (location.pathname === "/admin/profile") {
      return "Admin Profile Settings";
    }
    return "Operations Dashboard";
  };

  const getPageSubtitle = () => {
    if (location.pathname === "/admin/hotels") {
      return "Configure and update hotels, rooms, facilities, and galleries.";
    }
    if (location.pathname === "/admin/bookings") {
      return "Track, confirm, or cancel passenger bookings and resort bookings.";
    }
    if (location.pathname === "/admin/payments") {
      return "Monitor transaction logs, invoice statuses, and financial summaries.";
    }
    if (location.pathname === "/admin/profile") {
      return "Manage your administrator account credentials and personal details.";
    }
    return "Track real-time reservation statistics, service performance, and system activities.";
  };

  const getTabName = () => {
    if (location.pathname === "/admin/hotels") {
      return "hotels";
    }
    if (location.pathname === "/admin/bookings") {
      return "bookings";
    }
    if (location.pathname === "/admin/payments") {
      return "payments";
    }
    if (location.pathname === "/admin/profile") {
      return "profile";
    }
    return "overview";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f7f8fa]">
        <svg className="animate-spin h-10 w-10 text-[#3ea5dc]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f7f8fa] text-slate-700 xl:flex-row">
      {/* Sidebar Component */}
      <Sidebar
        handleLogout={handleLogout}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header Navbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 md:px-6 xl:px-10">
          <div className="flex items-center gap-3">
            {/* Hamburger: mobile + laptop (< xl) */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="cursor-pointer rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-slate-900 xl:hidden"
              aria-label="Open sidebar"
            >
              <IoMenuOutline className="text-2xl" />
            </button>

            <span className="hidden font-bold text-slate-800 sm:inline-block">
              Admin Workspace
            </span>
            <span className="hidden text-gray-300 sm:inline-block">|</span>
            <span className="text-xs font-semibold capitalize text-gray-500">
              {getTabName()} Manager
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="hidden text-left xl:block">
                <p className="text-lg font-bold leading-none text-slate-900">
                  Admin
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Wrapper */}
        <div className="w-full flex-1 overflow-y-auto">
          <main className="w-full px-3 py-5 md:px-5 xl:px-8 xl:py-6">
            {/* Header */}
            {getPageTitle() && (
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {getPageTitle()}
                </h1>
                <p className="text-gray-500 mt-1">{getPageSubtitle()}</p>
              </div>
            )}

            {/* Nested Page Content */}
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
