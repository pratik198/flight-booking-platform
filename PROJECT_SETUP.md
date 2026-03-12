# Flight Booking Platform - Complete Setup & Running Guide

## ✅ Issues Fixed

### Critical Issues Resolved:
1. **Navbar Component Error** - Fixed missing `const` keyword in state declaration
   - Error was: `[isScrolled, setIsScrolled] = useState(false);`
   - Fixed to: `const [isScrolled, setIsScrolled] = useState(false);`

2. **Frontend Build** - All Tailwind CSS v4 compatibility issues resolved
3. **Backend Services** - All API endpoints properly configured
4. **Database** - MongoDB connected and populated with 500+ flights

---

## 🚀 Running the Application

### Prerequisites:
- Node.js installed
- MongoDB connected (check `.env` file)
- Ports 5000 (backend) and 5176 (frontend) available

### Step 1: Start Backend Server
```bash
cd server
npm run dev
```
✅ Expected output: `🚀 Server running on port 5000`

### Step 2: Start Frontend Server (in new terminal)
```bash
cd client
npm run dev
```
✅ Expected output: `Local: http://localhost:5176/`

### Step 3: Access Application
Open browser and navigate to: **http://localhost:5176**

---

## 📋 Application Features

### For Unauthenticated Users:
- ✅ View home page with flight search
- ✅ Search flights (origin, destination, date)
- ✅ View flight details and pricing
- ✅ Login / Register

### For Authenticated Users:
- ✅ Complete flight booking
- ✅ Select seats
- ✅ Enter passenger details
- ✅ Process payment
- ✅ View my bookings
- ✅ Cancel bookings
- ✅ View booking details
- ✅ View user profile

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `PUT /api/auth/profile` - Update profile

### Flights
- `GET /api/flights/search?origin=DEL&destination=BOM&date=2024-03-15` - Search flights
- `GET /api/flights/routes` - Get all routes
- `GET /api/flights/:id` - Get flight details

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user's bookings (requires auth)
- `POST /api/bookings/:bookingId/cancel` - Cancel booking (requires auth)

### Seats
- `GET /api/seats/:flightId` - Get available seats
- `POST /api/seats/hold` - Hold seat (requires auth)

### Payment
- `POST /api/payment` - Process payment
- `POST /api/refund/:bookingId` - Process refund

---

## 🗄️ Database Seeding

### To Populate Database with Sample Flights:
```bash
cd server
npm run seed
```

This will create:
- 10 major Indian airports (DEL, BOM, BLR, HYD, etc.)
- 5 airlines (Air India, IndiGo, Vistara, SpiceJet, Air India Express)
- 500+ flights across all routes

---

## 📱 Testing Workflows

### Test User Registration & Login:
1. Go to http://localhost:5176/register
2. Enter name, email, password
3. Click "Sign Up"
4. You'll be redirected to home page (logged in)

### Test Flight Search:
1. On home page, select origin and destination
2. Choose date and number of passengers
3. Click "Search Flights"
4. View filtered results

### Test Flight Booking (if logged in):
1. Click on any flight
2. View flight details
3. Click "Book Now"
4. Select seats on seat map
5. Enter passenger details
6. Complete payment
7. See booking confirmation

### Test My Bookings:
1. Click on user profile icon (top right)
2. Select "My Bookings"
3. View all your bookings
4. Expand any booking to see details
5. Cancel booking if needed

---

## 🛠️ Environment Variables

### Backend (.env):
```
PORT=5000
MONGO_URI=mongodb+srv://routpratik09_db_user:Ma5JaAJCICZbOhqk@cluster0.ftzsqhx.mongodb.net/?appName=Cluster0
JWT_SECRET=supersecret
FLIGHT_API_KEY=465ca6d65d6e640019be8a5f439eb451
```

### Frontend (.env):
```
VITE_API_URL=http://localhost:5000/api
```

---

## 📂 Project Structure

```
flight-booking-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store
│   │   └── utils/          # Helper functions
│   └── package.json
│
└── server/                 # Express backend
    ├── controllers/        # Route controllers
    ├── models/             # MongoDB schemas
    ├── routes/             # API routes
    ├── middleware/         # Custom middleware
    ├── services/           # Business logic
    ├── seed/               # Database seeds
    └── package.json
```

---

## 🐛 Troubleshooting

### "Cannot find module" error:
```bash
npm install
```

### Port already in use:
```bash
# Find process using port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
```

### MongoDB connection error:
- Check `.env` file has correct `MONGO_URI`
- Ensure MongoDB cluster is active
- Verify IP whitelist in MongoDB Atlas

### Frontend blank screen FIXED:
- Issue: lucide-react 'Android' icon import error in HomePage.jsx
- Fixed: Removed invalid icons + app banner section
- Now renders Hero, Search Form, Features, Popular Routes

---

## ✨ Key Features Implemented

- ✅ User Authentication (Register/Login)
- ✅ Flight Search & Filtering
- ✅ Seat Selection & Booking
- ✅ Passenger Information Collection
- ✅ Payment Processing
- ✅ Booking Management
- ✅ Cancellation & Refunds
- ✅ Responsive Design (Mobile/Tablet/Desktop)
- ✅ Real-time Error Handling
- ✅ Toast Notifications
- ✅ Loading States
- ✅ Authentication Middleware
- ✅ Protected Routes

---

## 📞 Support

For issues or questions:
1. Check browser console (DevTools)
2. Check server terminal for errors
3. Review API response in Network tab
4. Verify environment variables
5. Ensure MongoDB is connected

---

**Last Updated:** March 13, 2026
**Status:** ✅ All systems operational
**Database:** ✅ 500+ flights populated
**Frontend:** ✅ Running on port 5176
**Backend:** ✅ Running on port 5000
