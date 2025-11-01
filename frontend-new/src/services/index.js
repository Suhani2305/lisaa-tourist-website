// Export all services from a single entry point
import api from './api';
import authService from './authService';
import bookingService from './bookingService';
import tourService from './tourService';
import destinationService from './destinationService';
import reviewService from './reviewService';
import paymentService from './paymentService';
import articleService from './articleService';
import stateService from './stateService';

export {
  api,
  authService,
  bookingService,
  tourService,
  destinationService,
  reviewService,
  paymentService,
  articleService,
  stateService,
};
