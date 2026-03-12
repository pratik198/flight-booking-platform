import api from './api';

class BookingService {
  async createBooking(bookingData) {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMyBookings() {
    try {
      const response = await api.get('/bookings');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getBookingById(id) {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async cancelBooking(id) {
    try {
      const response = await api.post(`/bookings/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async downloadTicket(id) {
    try {
      const response = await api.get(`/bookings/${id}/ticket`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async emailTicket(id) {
    try {
      const response = await api.post(`/bookings/${id}/email-ticket`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      return new Error(error.response.data.message || 'Booking service error');
    } else if (error.request) {
      return new Error('No response from server');
    } else {
      return new Error('Request failed');
    }
  }
}

export default new BookingService();