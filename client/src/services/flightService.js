import api from './api';

class FlightService {
  async searchFlights(params) {
    try {
      const response = await api.get('/flights/search', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getFlightById(id) {
    try {
      const response = await api.get(`/flights/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getRoutes() {
    try {
      const response = await api.get('/flights/routes');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAllFlights(params = {}) {
    try {
      const response = await api.get('/flights', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSeats(flightId) {
    try {
      const response = await api.get(`/seats/${flightId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async holdSeat(seatId) {
    try {
      const response = await api.post('/seats/hold', { seatId });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async releaseSeat(seatId) {
    try {
      const response = await api.post('/seats/release', { seatId });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      return new Error(error.response.data.message || 'Flight service error');
    } else if (error.request) {
      return new Error('No response from server');
    } else {
      return new Error('Request failed');
    }
  }
}

export default new FlightService();