import api from './api';

class PaymentService {
  async processPayment(paymentData) {
    try {
      const response = await api.post('/payment', paymentData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifyPayment(transactionId) {
    try {
      const response = await api.get(`/payment/verify/${transactionId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async processRefund(bookingId) {
    try {
      const response = await api.post(`/refund/${bookingId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPaymentStatus(bookingId) {
    try {
      const response = await api.get(`/payment/status/${bookingId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      return new Error(error.response.data.message || 'Payment service error');
    } else if (error.request) {
      return new Error('No response from server');
    } else {
      return new Error('Request failed');
    }
  }
}

export default new PaymentService();