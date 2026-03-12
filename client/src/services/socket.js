import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('Socket connected');
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      this.listeners.set(event, callback);
    }
  }

  off(event) {
    if (this.socket && this.listeners.has(event)) {
      this.socket.off(event, this.listeners.get(event));
      this.listeners.delete(event);
    }
  }

  // Seat locking events
  joinFlightRoom(flightId) {
    this.emit('join-flight', flightId);
  }

  leaveFlightRoom(flightId) {
    this.emit('leave-flight', flightId);
  }

  onSeatUpdated(callback) {
    this.on('seat-updated', callback);
  }

  onSeatHeld(callback) {
    this.on('seat-held', callback);
  }

  onSeatReleased(callback) {
    this.on('seat-released', callback);
  }

  onSeatBooked(callback) {
    this.on('seat-booked', callback);
  }

  // Booking events
  onBookingConfirmed(callback) {
    this.on('booking-confirmed', callback);
  }

  onBookingCancelled(callback) {
    this.on('booking-cancelled', callback);
  }
}

export default new SocketService();