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
            <div className="flex items-center gap-3">
              <div className="hidden lg:block text-left">
                <p className="text-lg font-bold text-slate-900 leading-none">
                  Admin
                </p>
              </div>
            </div>
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
