# VTL Travel - Frontend Portal

A premium travel booking and admin management system built with modern React patterns.

## Technologies Used
- **Core:** React 19, Vite 6
- **Routing:** React Router DOM v7 (Nested layout paths &guards)
- **Styling:** Tailwind CSS v4
- **State & Server Cache Management:** TanStack Query v5 (React Query)
- **Global Context:** React Context API (Auth Context)
- **Forms & Validation:** React Hook Form & Zod
- **API Client:** Axios
- **Cookie Management:** js-cookie

---

## Folder Structure
```text
src/
├── api/                  # API Integration Layer
│   ├── services/         # API Service Modules
│   │   ├── authService.js   # Authentication Service (Mock / Real API)
│   │   └── hotelService.js  # Hotel CMS Service (Mock / Real API)
│   ├── apiMethods.js     # Generic REST API HTTP methods (GET, POST, PUT, DELETE)
│   ├── axiosInstance.js  # Axios client with JWT request/response interceptors
│   └── endpoints.js      # List of all API HTTP endpoints
│
├── components/           # Reusable Global UI Components
│   ├── FormFields.jsx    # Controlled inputs (FormInput, FormTextarea, FormFileInput)
│   ├── Pagination.jsx    # Shared pagination controls
│   └── Sidebar.jsx       # Responsive Admin Drawer Sidebar
│
├── context/              # Global React Contexts
│   └── AuthContext.jsx   # Global Auth Provider (login, logout, isAuthenticated status)
│
├── hooks/                # Custom React Hooks
│   └── useHotels.js      # TanStack Query custom hooks (queries and mutations)
│
├── layout/               # Shell Wrappers & Layout Components
│   ├── Layout.jsx        # Public website main layout wrapper
│   └── AdminLayout.jsx   # Admin panel shell (Sidebar, Header, Outlet wrapper)
│
├── data/                 # Mock Data & Local Database fallback
│   └── db.js             # LocalStorage database emulator for offline development
│
├── pages/                # Page Components
│   ├── auth/             # Login / Authentication UI
│   ├── dashboard/        # Admin Dashboard Panels
│   │   ├── overview/     # Overview metrics & stats
│   │   │   ├── components/  # StatsGrid, RecentActivityTable
│   │   │   └── Admindashboard.jsx
│   │   ├── manageHotel/  # Hotel management panel
│   │   │   ├── components/  # HotelForm, HotelList, RoomFormModal
│   │   │   └── ManageHotel.jsx
│   │   └── allBookings/  # Booking management panel
│   │       ├── components/  # BookingList (Confirmed bookings, details modal)
│   │       └── AllBookings.jsx
│   │
│   ├── hotelDetails/     # Public Hotel Details page
│   └── searchResultsPage/# Search and Hotel Listing pages
│
├── utils/                # Helper functions & utilities
│   └── fileHelpers.js    # Base64 encoder utility with constraint checking
│
└── routes/               # Navigation Configuration
    └── router.jsx        # Routing configuration with Nested Admin Routes
```

---

## Architectural Enhancements

### 1. Nested Route Layouts
Admin routes are nested inside `AdminLayout.jsx` using React Router's `<Outlet />`. Toggling sections (`/admin` and `/admin/hotels`) is URL-based and preserves browser navigation history.

### 2. Form Management & Validation
Forms are managed using `React Hook Form` and validated via `Zod` schemas. We created custom controlled components (`FormInput`, `FormTextarea`, `FormFileInput`) in `FormFields.jsx` to reduce code duplication and keep forms extremely readable.

### 3. File Upload Utility
Local file uploads (images & video) are managed locally using `FileReader` wrapped in a reusable promise-based utility `fileToBase64` with size limit constraints and MIME type validation filters.

---

## Getting Started

### 1. Installation
Install project dependencies:
```bash
npm install
```

### 2. Running Locally (Development)
Run the development server:
```bash
npm run dev
```

### 3. API Switching (Mock vs. Production)
By default, the application runs on a **Mock API (localStorage DB fallback)** to allow fully functional CMS testing without a backend server.

To switch to your production/local backend server:
1. Create a `.env` file in the root directory.
2. Add the following variables:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_USE_MOCK_API=false
   ```
3. Restart your dev server.

For a detailed guide on implementing the backend server, refer to [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md).
