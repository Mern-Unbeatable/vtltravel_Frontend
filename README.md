# VTL Travel - Frontend Portal

A premium travel booking and admin management system built with modern React patterns.

## Technologies Used
- **Core:** React 19, Vite 6
- **Routing:** React Router DOM v7
- **Styling:** Tailwind CSS v4
- **State & Server Cache Management:** TanStack Query v5 (React Query)
- **Global Context:** React Context API (Auth Context)
- **API Client:** Axios
- **Cookie Management:** js-cookie
- **Forms & Validation:** React Hook Form & Zod

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
├── context/              # Global React Contexts
│   └── AuthContext.jsx   # Global Auth Provider (login, logout, isAuthenticated status)
│
├── hooks/                # Custom React Hooks
│   └── useHotels.js      # TanStack Query custom hooks (queries and mutations)
│
├── data/                 # Mock Data & Local Database fallback
│   └── db.js             # LocalStorage database emulator for offline development
│
├── pages/                # Page Components
│   ├── auth/             # Login / Authentication UI
│   ├── dashboard/        # Admin Dashboard CMS
│   │   └── components/   # Modular CMS subcomponents (HotelForm, HotelList, etc.)
│   ├── hotelDetails/     # Public Hotel Details page
│   └── searchResultsPage/# Search and Hotel Listing pages
│
└── routes/               # Navigation Configuration
    └── router.jsx        # Routing configuration and Route Guards
```

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
