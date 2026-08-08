import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { IoMenuOutline } from "react-icons/io5";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Determine active title based on path
  const getPageTitle = () => {
    if (location.pathname === "/admin/hotels") {
      return "Hotels & Resort CMS";
    }
    return "Admin Console";
  };

  const getPageSubtitle = () => {
    if (location.pathname === "/admin/hotels") {
      return "Configure and update hotels, rooms, facilities, and galleries.";
    }
    return "Manage bookings, destinations, and system metrics.";
  };

  const getTabName = () => {
    if (location.pathname === "/admin/hotels") {
      return "hotels";
    }
    return "overview";
  };

  if (!isAuthenticated) return null;

  return (
    <div className="h-screen bg-[#f7f8fa] text-slate-700 flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar
        handleLogout={handleLogout}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header Navbar */}
        <header className="bg-white border-b border-gray-200 py-4 px-6 md:px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger Button for Mobile/Tablet */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1 text-gray-500 hover:text-slate-900 rounded-lg hover:bg-gray-100 md:hidden cursor-pointer"
              aria-label="Open sidebar"
            >
              <IoMenuOutline className="text-2xl" />
            </button>

            <span className="font-bold text-slate-800 hidden sm:inline-block">
              Admin Workspace
            </span>
            <span className="text-gray-300 hidden sm:inline-block">|</span>
            <span className="text-xs font-semibold text-gray-500 capitalize">
              {getTabName()} Manager
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Live System
            </span>

            <div className="h-6 w-[1px] bg-gray-200"></div>

            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="Admin Profile"
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-none">
                  Sara Ahmed
                </p>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                  Super Admin
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* Scrollable Content Wrapper */}
        <div className="flex-1 overflow-y-auto w-full">
          <main className="p-2 py-6 px-4 md:px-8 w-full">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                {getPageTitle()}
              </h1>
              <p className="text-gray-500 mt-1">{getPageSubtitle()}</p>
            </div>

            {/* Nested Page Content */}
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
