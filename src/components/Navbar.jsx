import { useEffect, useState } from 'react'
import { IoTicketOutline } from 'react-icons/io5'
import { NavLink, useLocation } from 'react-router-dom'

const linkClasses = ({ isActive }) =>
  `inline-flex items-center pb-1 text-sm font-medium transition-colors ${
    isActive
      ? 'border-b-2 border-primary text-primary'
      : 'border-b-2 border-transparent text-gray-600 hover:text-primary'
  }`

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
 
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <nav className="mx-auto flex container items-center justify-between px-4 py-4">
        <NavLink to="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="VTL Travel"
            className="h-10 w-auto sm:h-11 md:h-12"
          />
        </NavLink>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" end className={linkClasses}>
            Home
          </NavLink>
          <NavLink to="/about" className={linkClasses}>
            Ferry Schedule
          </NavLink>
          <NavLink to="/destinations" className={linkClasses}>
            Destinations
          </NavLink>
          <NavLink to="/travel-info" className={linkClasses}>
            Travel Info
          </NavLink>
          <NavLink to="/contact" className={linkClasses}>
            Contact
          </NavLink>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex">
          <NavLink
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary"
          >
            <IoTicketOutline className="text-base" />
            Book Tickets
          </NavLink>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-700 transition hover:bg-gray-50 md:hidden"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="flex flex-col gap-3">
              <NavLink
                to="/"
                end
                className="rounded-lg px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className="rounded-lg px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Ferry Schedule
              </NavLink>
              <NavLink
                to="/destinations"
                className="rounded-lg px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Destinations
              </NavLink>
              <NavLink
                to="/travel-info"
                className="rounded-lg px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Travel Info
              </NavLink>
              <NavLink
                to="/contact"
                className="rounded-lg px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Contact
              </NavLink>
              <NavLink
                to="/contact"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 text-center text-sm font-semibold text-white transition hover:bg-primary"
              >
                <IoTicketOutline className="text-base" />
                Book Tickets
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}