import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/landingpage/LandingPage'
import AllStates from './pages/state/AllStates'
import RajasthanState from './pages/state/rajasthan/RajasthanState'
import CityTours from './pages/state/CityTours'
import JaipurCityTours from './pages/state/rajasthan/jaipur/JaipurCityTours'
import JaipurTourDetail from './pages/state/rajasthan/jaipur/JaipurTourDetail'
import UdaipurCityTours from './pages/state/rajasthan/udaipur/UdaipurCityTours'
import UdaipurTourDetail from './pages/state/rajasthan/udaipur/UdaipurTourDetail'
import JodhpurCityTours from './pages/state/rajasthan/jodhpur/JodhpurCityTours'
import JodhpurTourDetail from './pages/state/rajasthan/jodhpur/JodhpurTourDetail'
import JaisalmerCityTours from './pages/state/rajasthan/jaisalmer/JaisalmerCityTours'
import JaisalmerTourDetail from './pages/state/rajasthan/jaisalmer/JaisalmerTourDetail'
import RanthamboreCityTours from './pages/state/rajasthan/ranthambore/RanthamboreCityTours'
import AjmerCityTours from './pages/state/rajasthan/ajmer/AjmerCityTours'
import AjmerTourDetail from './pages/state/rajasthan/ajmer/AjmerTourDetail'
import BikanerCityTours from './pages/state/rajasthan/bikaner/BikanerCityTours'
import BikanerTourDetail from './pages/state/rajasthan/bikaner/BikanerTourDetail'
import PushkarCityTours from './pages/state/rajasthan/pushkar/PushkarCityTours'
import PushkarTourDetail from './pages/state/rajasthan/pushkar/PushkarTourDetail'
import MountAbuCityTours from './pages/state/rajasthan/mount-abu/MountAbuCityTours'
import MountAbuTourDetail from './pages/state/rajasthan/mount-abu/MountAbuTourDetail'
import PackageDestinations from './pages/Package/PackageDestinations'
import PackageDetail from './pages/Package/PackageDetail'
import AndamanNicobar from './pages/Package/andaman-nicobar/AndamanNicobar'
import Kerala from './pages/Package/kerala/Kerala'
import TourDetailPage from './pages/state/rajasthan/TourDetailPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* All States Page */}
          <Route path="/all-states" element={<AllStates />} />
          {/* State Routes */}
          <Route path="/state/rajasthan" element={<RajasthanState />} />
          {/* Jaipur Dedicated Routes */}
          <Route path="/state/rajasthan/jaipur" element={<JaipurCityTours />} />
          <Route path="/state/rajasthan/jaipur/tour/:tourId" element={<JaipurTourDetail />} />
          {/* Udaipur Dedicated Routes */}
          <Route path="/state/rajasthan/udaipur" element={<UdaipurCityTours />} />
          <Route path="/state/rajasthan/udaipur/tour/:tourId" element={<UdaipurTourDetail />} />
          {/* Jodhpur Dedicated Routes */}
          <Route path="/state/rajasthan/jodhpur" element={<JodhpurCityTours />} />
          <Route path="/state/rajasthan/jodhpur/tour/:tourId" element={<JodhpurTourDetail />} />
          {/* Jaisalmer Dedicated Routes */}
          <Route path="/state/rajasthan/jaisalmer" element={<JaisalmerCityTours />} />
          <Route path="/state/rajasthan/jaisalmer/tour/:tourId" element={<JaisalmerTourDetail />} />
          {/* Ranthambore Dedicated Routes */}
          <Route path="/state/rajasthan/ranthambore" element={<RanthamboreCityTours />} />
          <Route path="/state/rajasthan/ranthambore/tour/:tourId" element={<TourDetailPage />} />
          {/* Ajmer Dedicated Routes */}
          <Route path="/state/rajasthan/ajmer" element={<AjmerCityTours />} />
          <Route path="/state/rajasthan/ajmer/tour/:tourId" element={<AjmerTourDetail />} />
          {/* Bikaner Dedicated Routes */}
          <Route path="/state/rajasthan/bikaner" element={<BikanerCityTours />} />
          <Route path="/state/rajasthan/bikaner/tour/:tourId" element={<BikanerTourDetail />} />
          {/* Pushkar Dedicated Routes */}
          <Route path="/state/rajasthan/pushkar" element={<PushkarCityTours />} />
          <Route path="/state/rajasthan/pushkar/tour/:tourId" element={<PushkarTourDetail />} />
          {/* Mount Abu Dedicated Routes */}
          <Route path="/state/rajasthan/mount-abu" element={<MountAbuCityTours />} />
          <Route path="/state/rajasthan/mount-abu/tour/:tourId" element={<MountAbuTourDetail />} />
          {/* Package Routes */}
          <Route path="/package" element={<PackageDestinations />} />
          <Route path="/package/:packageSlug" element={<PackageDetail />} />
          {/* Redirect old honeymoon routes to package */}
          <Route path="/honeymoon" element={<PackageDestinations />} />
          <Route path="/honeymoon/andaman-and-nicobar" element={<AndamanNicobar />} />
          <Route path="/honeymoon/kerala" element={<Kerala />} />
          {/* City Tours Routes (for other cities) */}
          <Route path="/state/:stateId/:cityId" element={<CityTours />} />
          {/* Tour Detail Routes - Works for other states/cities */}
          <Route path="/state/:stateId/:cityId/tour/:tourId" element={<TourDetailPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
