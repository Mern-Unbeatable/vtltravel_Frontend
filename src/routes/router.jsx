import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../layout/Layout'
import Home from '../pages/home/Home'
import SearchResultsPage from '../pages/searchResultsPage/SearchResultsPage'
import HotelDetailsPage from '../pages/hotelDetails/HotelDetailsPage'
import About from '../pages/About'
import Destinations from '../pages/Destinations'
import TravelInfo from '../pages/TravelInfo'
import Contact from '../pages/Contact'
import NotFound from '../pages/NotFound'

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Navigate to="/" replace />} />
          <Route path="home/search" element={<SearchResultsPage />} />
          <Route path="home/search/:hotelId" element={<HotelDetailsPage />} />
          <Route path="about" element={<About />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="travel-info" element={<TravelInfo />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  )
}
