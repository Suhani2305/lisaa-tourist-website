import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturedTrips from './components/FeaturedTrips';
import TrendingDestinations from './components/TrendingDestinations';
import PromotionalBanner from './components/PromotionalBanner';
import TopAttractions from './components/TopAttractions';
import CustomerReviews from './components/CustomerReviews';
import PopularTours from './components/PopularTours';
import AppDownload from './components/AppDownload';
import TravelArticles from './components/TravelArticles';
import Footer from './components/Footer';

const LandingPage = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if we need to scroll to specific sections
    const shouldScrollToArticles = sessionStorage.getItem('scrollToArticles');
    const shouldScrollToStates = sessionStorage.getItem('scrollToStates');
    const shouldScrollToTrendingDestinations = sessionStorage.getItem('scrollToTrendingDestinations');
    
    if (shouldScrollToTrendingDestinations === 'true') {
      // Clear the flag immediately
      sessionStorage.removeItem('scrollToTrendingDestinations');
      
      // Wait longer for all components (including images) to render
      const scrollToTrendingDestinations = () => {
        const element = document.getElementById('trending-destinations-section');
        if (element) {
          // Get the element's position
          const rect = element.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const offsetTop = rect.top + scrollTop - 80; // 80px offset for header
          
          // Instant jump to the section
          window.scrollTo({
            top: offsetTop,
            behavior: 'auto'
          });
          
          console.log('✅ Scrolled to Trending Destinations section at position:', offsetTop);
        } else {
          console.log('❌ Trending Destinations element not found');
        }
      };
      
      // Try multiple times to ensure scroll happens
      setTimeout(scrollToTrendingDestinations, 200);
      setTimeout(scrollToTrendingDestinations, 500);
      setTimeout(scrollToTrendingDestinations, 800);
    } else if (shouldScrollToArticles === 'true') {
      // Clear the flag immediately
      sessionStorage.removeItem('scrollToArticles');
      
      // Wait longer for all components (including images) to render
      const scrollToArticles = () => {
        const element = document.getElementById('travel-articles');
        if (element) {
          // Get the element's position
          const rect = element.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const offsetTop = rect.top + scrollTop - 80; // 80px offset for header
          
          // Instant jump to the section
          window.scrollTo({
            top: offsetTop,
            behavior: 'auto'
          });
          
          console.log('✅ Scrolled to Travel Articles section at position:', offsetTop);
        } else {
          console.log('❌ Travel Articles element not found');
        }
      };
      
      // Try multiple times to ensure scroll happens
      setTimeout(scrollToArticles, 200);
      setTimeout(scrollToArticles, 500);
      setTimeout(scrollToArticles, 800);
    } else if (shouldScrollToStates === 'true') {
      // Clear the flag immediately
      sessionStorage.removeItem('scrollToStates');
      
      // Wait longer for all components (including images) to render
      const scrollToStates = () => {
        const element = document.getElementById('top-states-section');
        if (element) {
          // Get the element's position
          const rect = element.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const offsetTop = rect.top + scrollTop - 80; // 80px offset for header
          
          // Instant jump to the section
          window.scrollTo({
            top: offsetTop,
            behavior: 'auto'
          });
          
          console.log('✅ Scrolled to States section at position:', offsetTop);
        } else {
          console.log('❌ States section element not found');
        }
      };
      
      // Try multiple times to ensure scroll happens
      setTimeout(scrollToStates, 200);
      setTimeout(scrollToStates, 500);
      setTimeout(scrollToStates, 800);
    } else if (!location.hash) {
      // Normal navigation - scroll to top
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="landing-page">
      <Header />
      <HeroSection />
      <FeaturedTrips />
      <TrendingDestinations />
      <PromotionalBanner />
      <TopAttractions />
      <CustomerReviews />
      <PopularTours />
      <AppDownload />
      <TravelArticles />
      <Footer />
    </div>
  );
};

export default LandingPage;
