import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setCurrentBooking,
  setBookings,
  addBooking,
  updateBookingStatus,
  setPassengerDetails,
  setPaymentDetails,
  clearBookingData,
  setLoading,
  setError,
} from '../store/slices/bookingSlice';
import { showToast } from '../store/slices/uiSlice';
import bookingService from '../services/bookingService';
import paymentService from '../services/paymentService';

export const useBooking = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    currentBooking,
    bookings,
    passengerDetails,
    paymentDetails,
    isLoading,
    error,
  } = useSelector((state) => state.bookings);

  const createBooking = async (bookingData) => {
    try {
      dispatch(setLoading(true));
      const data = await bookingService.createBooking(bookingData);
      dispatch(setCurrentBooking(data));
      dispatch(addBooking(data));
      return data;
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(showToast({ message: error.message, type: 'error' }));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getMyBookings = async () => {
    try {
      dispatch(setLoading(true));
      const data = await bookingService.getMyBookings();
      dispatch(setBookings(data));
      return data;
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(showToast({ message: error.message, type: 'error' }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      dispatch(setLoading(true));
      const data = await bookingService.cancelBooking(bookingId);
      dispatch(updateBookingStatus({ bookingId, status: 'cancelled' }));
      dispatch(showToast({ message: 'Booking cancelled successfully', type: 'success' }));
      return data;
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(showToast({ message: error.message, type: 'error' }));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const processPayment = async (paymentData) => {
    try {
      dispatch(setLoading(true));
      const data = await paymentService.processPayment(paymentData);
      dispatch(setPaymentDetails(data));
      return data;
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(showToast({ message: error.message, type: 'error' }));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const processRefund = async (bookingId) => {
    try {
      dispatch(setLoading(true));
      const data = await paymentService.processRefund(bookingId);
      dispatch(updateBookingStatus({ bookingId, status: 'cancelled' }));
      dispatch(showToast({ message: `Refund of ₹${data.amount} processed`, type: 'success' }));
      return data;
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(showToast({ message: error.message, type: 'error' }));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const savePassengerDetails = (details) => {
    dispatch(setPassengerDetails(details));
  };

  const savePaymentDetails = (details) => {
    dispatch(setPaymentDetails(details));
  };

  const clearBooking = () => {
    dispatch(clearBookingData());
  };

  const downloadTicket = async (bookingId) => {
    try {
      const data = await bookingService.downloadTicket(bookingId);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      dispatch(showToast({ message: 'Ticket downloaded', type: 'success' }));
    } catch (error) {
      dispatch(showToast({ message: error.message, type: 'error' }));
    }
  };

  const emailTicket = async (bookingId) => {
    try {
      await bookingService.emailTicket(bookingId);
      dispatch(showToast({ message: 'Ticket sent to email', type: 'success' }));
    } catch (error) {
      dispatch(showToast({ message: error.message, type: 'error' }));
    }
  };

  const getBookingById = async (id) => {
    try {
      dispatch(setLoading(true));
      const data = await bookingService.getBookingById(id);
      return data;
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(showToast({ message: error.message, type: 'error' }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    currentBooking,
    bookings,
    passengerDetails,
    paymentDetails,
    isLoading,
    error,
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
    processPayment,
    processRefund,
    savePassengerDetails,
    savePaymentDetails,
    clearBooking,
    downloadTicket,
    emailTicket,
  };
};