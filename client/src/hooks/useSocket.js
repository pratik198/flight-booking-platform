import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import socketService from '../services/socket';
import { updateSeatStatus } from '../store/slices/flightSlice';
import { showToast } from '../store/slices/uiSlice';

export const useSocket = (flightId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Connect to socket
    socketService.connect();

    // Join flight room if flightId provided
    if (flightId) {
      socketService.joinFlightRoom(flightId);
    }

    // Cleanup on unmount
    return () => {
      if (flightId) {
        socketService.leaveFlightRoom(flightId);
      }
      socketService.disconnect();
    };
  }, [flightId]);

  // Listen for seat updates
  useEffect(() => {
    const handleSeatUpdated = (data) => {
      dispatch(updateSeatStatus({ seatId: data.seatId, status: data.status }));
    };

    const handleSeatHeld = (data) => {
      dispatch(updateSeatStatus({ seatId: data.seatId, status: 'held' }));
      if (data.userId !== 'current-user') { // Replace with actual user ID check
        dispatch(showToast({ 
          message: `Seat ${data.seatNumber} is now held by another user`, 
          type: 'warning' 
        }));
      }
    };

    const handleSeatReleased = (data) => {
      dispatch(updateSeatStatus({ seatId: data.seatId, status: 'available' }));
    };

    const handleSeatBooked = (data) => {
      dispatch(updateSeatStatus({ seatId: data.seatId, status: 'booked' }));
    };

    socketService.onSeatUpdated(handleSeatUpdated);
    socketService.onSeatHeld(handleSeatHeld);
    socketService.onSeatReleased(handleSeatReleased);
    socketService.onSeatBooked(handleSeatBooked);

    return () => {
      socketService.off('seat-updated');
      socketService.off('seat-held');
      socketService.off('seat-released');
      socketService.off('seat-booked');
    };
  }, [dispatch]);

  const emit = useCallback((event, data) => {
    socketService.emit(event, data);
  }, []);

  return {
    socket: socketService.socket,
    emit,
  };
};