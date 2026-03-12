import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentBooking: null,
  bookings: [],
  passengerDetails: null,
  paymentDetails: null,
  isLoading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload;
    },
    setBookings: (state, action) => {
      state.bookings = action.payload;
    },
    addBooking: (state, action) => {
      state.bookings.unshift(action.payload);
    },
    updateBookingStatus: (state, action) => {
      const { bookingId, status } = action.payload;
      const booking = state.bookings.find(b => b._id === bookingId);
      if (booking) {
        booking.status = status;
      }
      if (state.currentBooking?._id === bookingId) {
        state.currentBooking.status = status;
      }
    },
    setPassengerDetails: (state, action) => {
      state.passengerDetails = action.payload;
    },
    setPaymentDetails: (state, action) => {
      state.paymentDetails = action.payload;
    },
    clearBookingData: (state) => {
      state.currentBooking = null;
      state.passengerDetails = null;
      state.paymentDetails = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCurrentBooking,
  setBookings,
  addBooking,
  updateBookingStatus,
  setPassengerDetails,
  setPaymentDetails,
  clearBookingData,
  setLoading,
  setError,
  clearError,
} = bookingSlice.actions;

export default bookingSlice.reducer;