import { NavLink } from 'react-router-dom'

const linkClasses = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
  }`

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <nav className="mx-auto flex container items-center justify-between px-4 py-4">
        <NavLink to="/" className="text-xl font-bold text-blue-600">
          VTL Travel
        </NavLink>

        <ul className="flex items-center gap-6">
          <li>
            <NavLink to="/" end className={linkClasses}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={linkClasses}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={linkClasses}>
              Contact
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}