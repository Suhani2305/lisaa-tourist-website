# 🚀 Lisaa Tourist Website - Complete Setup Guide

## ✅ What Has Been Implemented

### Backend (Complete ✓)
- ✅ Express.js server with MongoDB integration
- ✅ 5 Complete Mongoose Models (User, Tour, Booking, Destination, Review)
- ✅ JWT-based Authentication (Login, Register, Profile)
- ✅ Complete CRUD APIs for all models
- ✅ Password hashing with bcryptjs
- ✅ CORS enabled for frontend communication

### Frontend (Complete ✓)
- ✅ React + Vite setup with Ant Design UI
- ✅ Axios integration with API service layer
- ✅ **Real Authentication** (Login, Register with Backend APIs)
- ✅ Protected Routes for authenticated users
- ✅ **User Dashboard** with booking history
- ✅ **Admin Panel** with real-time data
- ✅ **Contact Us** page
- ✅ Complete Landing Page
- ✅ Rajasthan Tours (10+ cities with detailed attractions)
- ✅ Package Tours (Kerala, Andaman, Kedarnath-Badrinath)

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (online database)
- Git

### Step 1: Clone the Project
```bash
cd C:\Users\Asus\Desktop\Client_Project\Lisaa---Tourist-Website-main
```

### Step 2: Backend Setup

1. **Navigate to backend folder:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file** in backend folder:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your-mongodb-atlas-connection-string-here
JWT_SECRET=lisaa-tourist-website-secret-key-2024
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

⚠️ **IMPORTANT:** Replace `MONGODB_URI` with your actual MongoDB Atlas connection string!

4. **Start backend server:**
```bash
npm run dev
```

Backend will run on: http://localhost:5000

### Step 3: Frontend Setup

1. **Open new terminal and navigate to frontend:**
```bash
cd frontend-new
```

2. **Install dependencies** (if not already installed):
```bash
npm install
```

3. **Create `.env` file** in frontend-new folder:
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Start frontend development server:**
```bash
npm run dev
```

Frontend will run on: http://localhost:5173

---

## 🎯 How to Use

### 1. Register a New User
- Go to: http://localhost:5173/register
- Fill in your details
- Click "Create Account"
- You'll be automatically logged in

### 2. Login (Regular Users)
- Go to: http://localhost:5173/login
- Enter email and password
- Click "Sign In"
- After login, access dashboard at: http://localhost:5173/dashboard

### 3. Admin Access (Separate Login)
Admin has its own dedicated login page with **fixed credentials**:

**Admin Login**
- Go to: http://localhost:5173/admin/login (NOT the regular login page)
- Use one of these demo credentials:
  - **Email:** pushpendrarawat868@gmail.com | **Password:** admin@123
  - **Email:** Lsiaatech@gmail.com | **Password:** admin@123
  - **Email:** vp312600@gmail.com | **Password:** admin@123
- Click "Sign In"
- You'll be redirected to: http://localhost:5173/admin/dashboard

**Forgot Password?**
- Click "Forgot Password?" link
- Select phone number for OTP:
  - 9263616263
  - 8840206492
- Enter OTP (shown in demo mode)
- Password will be revealed: `admin@123`

**Important:** 
- Regular user login (/login) and Admin login (/admin/login) are SEPARATE!
- Admin uses fixed credentials (not from database)

### 4. User Dashboard
- After user login, go to: http://localhost:5173/dashboard
- View your profile and bookings

---

## 🔌 API Endpoints

### Authentication APIs
```
POST   /api/users/register     - Register new user
POST   /api/users/login        - Login user
GET    /api/users/profile      - Get user profile (requires auth)
PUT    /api/users/profile      - Update profile (requires auth)
```

### Tour APIs
```
GET    /api/tours              - Get all tours (with filters)
GET    /api/tours/:id          - Get single tour
POST   /api/tours              - Create tour (admin)
PUT    /api/tours/:id          - Update tour (admin)
DELETE /api/tours/:id          - Delete tour (admin)
GET    /api/tours/featured/list    - Get featured tours
GET    /api/tours/trending/list    - Get trending tours
```

### Booking APIs
```
POST   /api/bookings           - Create booking
GET    /api/bookings           - Get all bookings (admin)
GET    /api/bookings/my-bookings   - Get user bookings
GET    /api/bookings/:id       - Get single booking
PUT    /api/bookings/:id/status    - Update booking status (admin)
```

### Destination APIs
```
GET    /api/destinations       - Get all destinations
GET    /api/destinations/:id   - Get single destination
POST   /api/destinations       - Create destination (admin)
```

### Review APIs
```
GET    /api/reviews/tour/:tourId   - Get tour reviews
POST   /api/reviews            - Create review
GET    /api/reviews/my-reviews - Get user reviews
```

---

## 📁 Project Structure

```
Lisaa---Tourist-Website-main/
│
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User model with bcrypt
│   │   ├── Tour.js              # Tour model
│   │   ├── Booking.js           # Booking model
│   │   ├── Destination.js       # Destination model
│   │   └── Review.js            # Review model
│   ├── routes/
│   │   ├── userRoutes.js        # Auth & user routes
│   │   ├── tourRoutes.js        # Tour CRUD routes
│   │   ├── bookingRoutes.js     # Booking routes
│   │   ├── destinationRoutes.js # Destination routes
│   │   └── reviewRoutes.js      # Review routes
│   ├── .env                     # Environment variables
│   ├── server.js                # Express server
│   └── package.json
│
├── frontend-new/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx    # Route protection
│   │   ├── services/
│   │   │   ├── api.js                # Axios instance
│   │   │   ├── authService.js        # Auth API calls
│   │   │   ├── tourService.js        # Tour API calls
│   │   │   ├── bookingService.js     # Booking API calls
│   │   │   ├── destinationService.js # Destination API calls
│   │   │   ├── reviewService.js      # Review API calls
│   │   │   └── index.js              # Service exports
│   │   ├── pages/
│   │   │   ├── Login/
│   │   │   │   └── Login.jsx         # Login with real API
│   │   │   ├── Register/
│   │   │   │   └── Register.jsx      # Register with real API
│   │   │   ├── UserDashboard/
│   │   │   │   └── UserDashboard.jsx # User dashboard
│   │   │   ├── ContactUs/
│   │   │   │   └── ContactUs.jsx     # Contact page
│   │   │   ├── Admin/
│   │   │   │   ├── Admin.jsx         # Admin routes
│   │   │   │   └── Components/
│   │   │   │       ├── AdminLogin.jsx     # Admin login
│   │   │   │       ├── AdminDashboard.jsx # Admin dashboard with real data
│   │   │   │       └── ... (other admin pages)
│   │   │   ├── landingpage/
│   │   │   │   └── components/
│   │   │   │       └── ... (Header, Footer, etc.)
│   │   │   ├── state/rajasthan/
│   │   │   │   └── ... (all city tours)
│   │   │   └── Package/
│   │   │       └── ... (package tours)
│   │   ├── App.jsx               # Main routes
│   │   └── main.jsx
│   ├── .env                      # Frontend env variables
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🛠️ Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- cors
- dotenv

### Frontend
- React 19
- Vite
- Ant Design (UI components)
- Axios (HTTP client)
- React Router DOM
- CSS3

---

## 🔐 Security Features

1. **Password Hashing:** All passwords are hashed using bcryptjs before storing
2. **JWT Authentication:** Secure token-based authentication
3. **Protected Routes:** User and Admin routes are protected
4. **CORS Configuration:** Properly configured for frontend-backend communication
5. **Input Validation:** Form validation on both frontend and backend

---

## 📝 Testing the Application

### Test User Registration
1. Go to http://localhost:5173/register
2. Register with:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Phone: 9876543210 (optional)

### Test Login
1. Go to http://localhost:5173/login
2. Login with registered credentials

### Test Admin Access
1. Register with email: admin@example.com
2. Login at http://localhost:5173/admin/login
3. Access dashboard: http://localhost:5173/admin/dashboard

---

## ⚠️ Common Issues & Solutions

### Issue 1: Backend not connecting to MongoDB
**Solution:** Make sure your MongoDB Atlas connection string is correct in `.env` file and your IP is whitelisted in MongoDB Atlas.

### Issue 2: CORS errors
**Solution:** Make sure backend is running on port 5000 and CORS is enabled in `server.js`.

### Issue 3: Login not working
**Solution:** 
- Check if backend server is running
- Check `.env` file in frontend has correct API URL
- Open browser console for error messages

### Issue 4: Cannot create admin user
**Solution:** Register with email containing "admin" or manually update user role in MongoDB to "admin".

---

## 🎨 Features Implemented

### User Features
- ✅ User Registration & Login
- ✅ User Dashboard
- ✅ View Tours & Packages
- ✅ Contact Form
- ✅ Responsive Design

### Admin Features
- ✅ Admin Login (separate)
- ✅ Admin Dashboard with statistics
- ✅ View all bookings
- ✅ View all users
- ✅ Real-time data from backend

### System Features
- ✅ JWT Authentication
- ✅ Protected Routes
- ✅ API Service Layer
- ✅ Error Handling
- ✅ Loading States
- ✅ Form Validations

---

## 🚧 Pending Features (Optional Enhancements)

1. **Booking Flow:** Complete booking creation from frontend
2. **Payment Gateway:** Razorpay/Stripe integration
3. **Email Service:** Booking confirmation emails
4. **Image Upload:** For tours and destinations
5. **Search & Filters:** Advanced search functionality
6. **Reviews System:** User can post reviews
7. **Wishlist:** Save favorite tours
8. **More States:** Add tours for other Indian states

---

## 📞 Support

For any issues or questions:
- Email: info@lisaatours.com
- Check console logs for detailed errors
- Ensure both backend and frontend servers are running

---

## 🎉 Success!

Your Lisaa Tourist Website is now fully functional with real backend APIs!

**Happy Coding! 🚀**

