import { useSelector, useDispatch } from 'react-redux';
import {
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
} from '../store/slices/flightSlice';
import { showToast } from '../store/slices/uiSlice';
import flightService from '../services/flightService';

export const useFlights = () => {
  const dispatch = useDispatch();
  const {
    searchResults,
    selectedFlight,
    seats,
    heldSeat,
    routes,
    filters,
    sortBy,
    isLoading,
    error,
  } = useSelector((state) => state.flights);

  const searchFlights = async (params) => {
    try {
      dispatch(setLoading(true));
      const data = await flightService.searchFlights(params);
      dispatch(setSearchResults(data.flights));
      return data;
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(showToast({ message: error.message, type: 'error' }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getFlightById = async (id) => {
    try {
      dispatch(setLoading(true));
      const data = await flightService.getFlightById(id);
      dispatch(setSelectedFlight(data));
      return data;
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(showToast({ message: error.message, type: 'error' }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getRoutes = async () => {
    try {
      const data = await flightService.getRoutes();
      dispatch(setRoutes(data));
      return data;
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  const getSeats = async (flightId) => {
    try {
      dispatch(setLoading(true));
      const data = await flightService.getSeats(flightId);
      dispatch(setSeats(data));
      return data;
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(showToast({ message: error.message, type: 'error' }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const holdSeat = async (seatId) => {
    try {
      const data = await flightService.holdSeat(seatId);
      dispatch(setHeldSeat(data));
      dispatch(updateSeatStatus({ seatId, status: 'held' }));
      dispatch(showToast({ message: 'Seat held for 10 minutes', type: 'success' }));
      return data;
    } catch (error) {
      dispatch(showToast({ message: error.message, type: 'error' }));
      throw error;
    }
  };

  const releaseSeat = async (seatId) => {
    try {
      await flightService.releaseSeat(seatId);
      dispatch(releaseHeldSeat());
      dispatch(updateSeatStatus({ seatId, status: 'available' }));
    } catch (error) {
      console.error('Error releasing seat:', error);
    }
  };

  const updateFilters = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const updateSortBy = (sortValue) => {
    dispatch(setSortBy(sortValue));
  };

  const resetFilters = () => {
    dispatch(clearFilters());
  };

  return {
    searchResults,
    selectedFlight,
    seats,
    heldSeat,
    routes,
    filters,
    sortBy,
    isLoading,
    error,
    searchFlights,
    getFlightById,
    getRoutes,
    getSeats,
    holdSeat,
    releaseSeat,
    updateFilters,
    updateSortBy,
    resetFilters,
  };
};