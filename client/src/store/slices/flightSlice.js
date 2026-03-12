import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchResults: [],
  selectedFlight: null,
  seats: [],
  heldSeat: null,
  routes: [],
  filters: {
    airlines: [],
    priceRange: [0, 10000],
    stops: [],
    departureTime: [],
  },
  sortBy: 'price',
  isLoading: false,
  error: null,
};

const flightSlice = createSlice({
  name: 'flights',
  initialState,
  reducers: {
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setSelectedFlight: (state, action) => {
      state.selectedFlight = action.payload;
    },
    setSeats: (state, action) => {
      state.seats = action.payload;
    },
    updateSeatStatus: (state, action) => {
      const { seatId, status } = action.payload;
      const seat = state.seats.find(s => s._id === seatId);
      if (seat) {
        seat.status = status;
      }
    },
    setHeldSeat: (state, action) => {
      state.heldSeat = action.payload;
    },
    releaseHeldSeat: (state) => {
      state.heldSeat = null;
    },
    setRoutes: (state, action) => {
      state.routes = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
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
  setSearchResults,
  setSelectedFlight,
  setSeats,
  updateSeatStatus,
  setHeldSeat,
  releaseHeldSeat,
  setRoutes,
  setFilters,
  setSortBy,
  clearFilters,
  setLoading,
  setError,
  clearError,
} = flightSlice.actions;

export default flightSlice.reducer;