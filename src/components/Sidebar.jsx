import React from "react";
import { NavLink } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";

const Sidebar = ({ handleLogout, isOpen, onClose }) => {
  const getLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm w-full transition-all cursor-pointer ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-gray-600 hover:bg-gray-50 hover:text-slate-900"
    }`;

  return (
    <>
      {/* Backdrop for Mobile/Tablet */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
        ></div>
      )}

      {/* Sidebar Aside Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between shrink-0 h-full transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:relative ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex justify-between items-center mb-8">
            <img src="/logo.png" alt="VTL Travel" className="h-10 w-auto" />
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-slate-950 rounded-lg hover:bg-gray-100 md:hidden cursor-pointer"
              aria-label="Close sidebar"
            >
              <IoCloseOutline className="text-2xl" />
            </button>
          </div>

          <nav className="space-y-1">
            <NavLink to="/admin" end onClick={onClose} className={getLinkClass}>
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
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"
                />
              </svg>
              Overview
            </NavLink>

            <NavLink
              to="/admin/hotels"
              onClick={onClose}
              className={getLinkClass}
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Manage Hotel
            </NavLink>

            <NavLink
              to="/admin/bookings"
              onClick={onClose}
              className={getLinkClass}
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              All Bookings
            </NavLink>
          </nav>
        </div>

        <button
          onClick={() => {
            handleLogout();
            onClose();
          }}
          className="mt-8 flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all text-sm font-semibold w-full cursor-pointer"
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
          Sign Out
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
