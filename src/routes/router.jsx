import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../pages/home/Home";
import SearchResultsPage from "../pages/searchResultsPage/SearchResultsPage";
import HotelDetailsPage from "../pages/hotelDetails/HotelDetailsPage";
import CustomizeStayPage from "../pages/customizeStay/CustomizeStayPage";
import FerryBookingPage from "../pages/ferryBooking/FerryBookingPage";
import About from "../pages/About";
import Destinations from "../pages/Destinations";
import TravelInfo from "../pages/TravelInfo";
import Contact from "../pages/Contact";
import Login from "../pages/auth/Login";
import Admindashboard from "../pages/dashboard/overview/Admindashboard";
import ManageHotel from "../pages/dashboard/manageHotel/ManageHotel";
import AllBookings from "../pages/dashboard/allBookings/AllBookings";
import AdminLayout from "../layout/AdminLayout";
import NotFound from "../pages/NotFound";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Admin and Auth routes (standalone layout) */}
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Admindashboard />} />
          <Route path="hotels" element={<ManageHotel />} />
          <Route path="bookings" element={<AllBookings />} />
        </Route>

        {/* Public Website routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Navigate to="/" replace />} />
          <Route path="home/search" element={<SearchResultsPage />} />
          <Route path="home/search/:hotelId" element={<HotelDetailsPage />} />
          <Route
            path="home/search/:hotelId/customize"
            element={<CustomizeStayPage />}
          />
          <Route
            path="home/search/:hotelId/book-ferry"
            element={<FerryBookingPage />}
          />
          <Route path="about" element={<About />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="travel-info" element={<TravelInfo />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
