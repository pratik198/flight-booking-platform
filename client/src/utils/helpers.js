import { format } from 'date-fns';

export const generatePNR = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pnr = '';
  for (let i = 0; i < 6; i++) {
    pnr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pnr;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date, formatStr = 'dd MMM yyyy') => {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return format(d, formatStr);
};

export const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return format(d, 'HH:mm');
};

export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return format(d, 'dd MMM yyyy, HH:mm');
};

export const calculateDuration = (departure, arrival) => {
  const diff = new Date(arrival) - new Date(departure);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

export const calculateRefund = (departureTime, price) => {
  const now = new Date();
  const departure = new Date(departureTime);
  const hoursDiff = (departure - now) / (1000 * 60 * 60);

  if (hoursDiff > 24) {
    return price * 0.9; // 90% refund
  } else if (hoursDiff > 6) {
    return price * 0.5; // 50% refund
  } else {
    return 0; // No refund
  }
};

export const getSeatColor = (status, isSelected = false) => {
  if (isSelected) return 'bg-green-500 hover:bg-green-600 text-white';
  
  switch (status) {
    case 'available':
      return 'bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-700';
    case 'held':
      return 'bg-yellow-400 cursor-not-allowed text-white';
    case 'booked':
      return 'bg-red-400 cursor-not-allowed text-white';
    default:
      return 'bg-gray-200 text-gray-700';
  }
};

export const getAirportByCode = (code) => {
  return AIRPORTS.find(airport => airport.code === code) || { code, city: code, name: code };
};

export const getAirlineByCode = (code) => {
  return AIRLINES.find(airline => airline.code === code) || { code, name: code, color: 'gray' };
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone);
};

export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};