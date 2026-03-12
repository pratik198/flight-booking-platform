export const AIRPORTS = [
  { code: 'DEL', city: 'Delhi', name: 'Indira Gandhi International Airport', country: 'India' },
  { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj International Airport', country: 'India' },
  { code: 'BLR', city: 'Bangalore', name: 'Kempegowda International Airport', country: 'India' },
  { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi International Airport', country: 'India' },
  { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhas Chandra Bose International Airport', country: 'India' },
  { code: 'MAA', city: 'Chennai', name: 'Chennai International Airport', country: 'India' },
  { code: 'GOI', city: 'Goa', name: 'Dabolim Airport', country: 'India' },
  { code: 'AMD', city: 'Ahmedabad', name: 'Sardar Vallabhbhai Patel International Airport', country: 'India' },
  { code: 'PNQ', city: 'Pune', name: 'Pune Airport', country: 'India' },
  { code: 'COK', city: 'Kochi', name: 'Cochin International Airport', country: 'India' },
  { code: 'JAI', city: 'Jaipur', name: 'Jaipur International Airport', country: 'India' },
  { code: 'LKO', city: 'Lucknow', name: 'Chaudhary Charan Singh International Airport', country: 'India' },
];

export const AIRLINES = [
  { code: '6E', name: 'IndiGo', color: 'blue' },
  { code: 'AI', name: 'Air India', color: 'red' },
  { code: 'UK', name: 'Vistara', color: 'purple' },
  { code: 'SG', name: 'SpiceJet', color: 'orange' },
  { code: 'IX', name: 'Air India Express', color: 'green' },
  { code: 'G8', name: 'Go First', color: 'yellow' },
  { code: 'QP', name: 'Akasa Air', color: 'orange' },
];

export const CABIN_CLASSES = [
  { value: 'economy', label: 'Economy' },
  { value: 'premium', label: 'Premium Economy' },
  { value: 'business', label: 'Business' },
  { value: 'first', label: 'First Class' },
];

export const TRIP_TYPES = [
  { value: 'oneway', label: 'One Way' },
  { value: 'roundtrip', label: 'Round Trip' },
  { value: 'multicity', label: 'Multi City' },
];

export const SEAT_TYPES = [
  { value: 'window', label: 'Window', multiplier: 1.2 },
  { value: 'aisle', label: 'Aisle', multiplier: 1.1 },
  { value: 'middle', label: 'Middle', multiplier: 1.0 },
];

export const BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
  COMPLETED: 'completed',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

export const REFUND_RULES = {
  MORE_THAN_24_HOURS: 0.9, // 90% refund
  BETWEEN_6_24_HOURS: 0.5, // 50% refund
  LESS_THAN_6_HOURS: 0,     // 0% refund
};

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  FLIGHTS: {
    SEARCH: '/flights/search',
    ROUTES: '/flights/routes',
    DETAILS: (id) => `/flights/${id}`,
    ALL: '/flights',
  },
  SEATS: {
    GET: (flightId) => `/seats/${flightId}`,
    HOLD: '/seats/hold',
    RELEASE: '/seats/release',
  },
  BOOKINGS: {
    CREATE: '/bookings',
    MY_BOOKINGS: '/bookings/my-bookings',
    DETAILS: (id) => `/bookings/${id}`,
    CANCEL: (id) => `/bookings/${id}/cancel`,
  },
  PAYMENT: {
    CREATE: '/payment',
    VERIFY: '/payment/verify',
  },
  REFUND: {
    PROCESS: (bookingId) => `/refund/${bookingId}`,
  },
};