import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

// Component to handle scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Don't scroll to top if navigating to home with article scroll flag
    const shouldScrollToArticles = sessionStorage.getItem('scrollToArticles');
    if (shouldScrollToArticles !== 'true') {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
import LandingPage from './pages/landingpage/LandingPage'
import AllStates from './pages/state/AllStates'
import PackageDestinations from './pages/Package/PackageDestinations'
import PackageDetail from './pages/Package/PackageDetail'
// Admin Panel Routes
import Admin from './pages/Admin/Admin'
// Login Page
import Login from './pages/Login/Login'
// Register Page
import Register from './pages/Register/Register'
// Change Password Page
import ChangePassword from './pages/ChangePassword/ChangePassword'
// User Dashboard
import UserDashboard from './pages/UserDashboard/UserDashboard'
// Profile Page
import Profile from './pages/Profile/Profile'
// Protected Routes
import ProtectedRoute from './components/ProtectedRoute'
// Contact Us
import ContactUs from './pages/ContactUs/ContactUs'
// Share Experience
import ShareExperience from './pages/ShareExperience/ShareExperience'
// Article Detail
import ArticleDetail from './pages/ArticleDetail/ArticleDetail'
// Dynamic State & City Pages
import StatePage from './pages/state/StatePage'
import CityPage from './pages/state/CityPage'
// Trending Destinations Page
import TrendingDestinationsPage from './pages/TrendingDestinations/TrendingDestinationsPage'
// Media Gallery Page
import MediaGallery from './pages/MediaGallery/MediaGallery'
// All Articles Page
import AllArticles from './pages/Articles/AllArticles'
import './App.css'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Routes>
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/change-password" element={<ChangePassword />} />
          
          {/* User Dashboard - Protected Route */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/user-dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />
          
          {/* Profile Page - Protected Route */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Admin Panel Routes */}
          <Route path="/admin/*" element={<Admin />} />
          
          {/* Main Website Routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Contact Us */}
          <Route path="/contact" element={<ContactUs />} />
          
          {/* Share Travel Experience */}
          <Route path="/share-experience" element={<ShareExperience />} />
          
          {/* Article Detail Page */}
          <Route path="/article/:articleId" element={<ArticleDetail />} />
          
          {/* All States Page */}
          <Route path="/all-states" element={<AllStates />} />
          
          {/* Trending Destinations Page */}
          <Route path="/trending-destinations" element={<TrendingDestinationsPage />} />
          
          {/* Media Gallery Page */}
          <Route path="/gallery" element={<MediaGallery />} />
          <Route path="/media-gallery" element={<MediaGallery />} />
          
          {/* All Articles Page */}
          <Route path="/articles" element={<AllArticles />} />
          
          {/* Dynamic State & City Routes */}
          <Route path="/state/:stateSlug" element={<StatePage />} />
          <Route path="/state/:stateSlug/:citySlug" element={<CityPage />} />
          {/* Package Routes - All Dynamic from Database */}
          <Route path="/package" element={<PackageDestinations />} />
          <Route path="/package/:packageSlug" element={<PackageDetail />} />
          {/* Redirect old honeymoon routes to package */}
          <Route path="/honeymoon" element={<PackageDestinations />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
