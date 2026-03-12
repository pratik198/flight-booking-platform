export const formatters = {
  currency: (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  },

  date: (date, format = 'medium') => {
    const formats = {
      short: { day: 'numeric', month: 'short', year: 'numeric' },
      medium: { day: 'numeric', month: 'long', year: 'numeric' },
      long: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    };
    
    return new Date(date).toLocaleDateString('en-IN', formats[format]);
  },

  time: (date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  },

  datetime: (date) => {
    return `${formatters.date(date)} • ${formatters.time(date)}`;
  },

  duration: (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  },

  flightDuration: (departure, arrival) => {
    const diff = new Date(arrival) - new Date(departure);
    const minutes = Math.floor(diff / (1000 * 60));
    return formatters.duration(minutes);
  },

  passengerCount: (count) => {
    return `${count} ${count === 1 ? 'Passenger' : 'Passengers'}`;
  },

  seatNumber: (row, col) => {
    return `${row}${col}`;
  },

  pnr: (pnr) => {
    return pnr.match(/.{1,3}/g)?.join('-') || pnr;
  },

  phone: (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phone;
  },

  cardNumber: (card) => {
    if (!card) return '';
    const cleaned = card.replace(/\D/g, '');
    const match = cleaned.match(/(\d{4})(\d{4})(\d{4})(\d{4})/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    }
    return card;
  },

  percentage: (value, total) => {
    return Math.round((value / total) * 100);
  },

  flightStatus: (status) => {
    const statuses = {
      'on-time': 'On Time',
      'delayed': 'Delayed',
      'cancelled': 'Cancelled',
      'boarding': 'Boarding',
      'departed': 'Departed',
      'landed': 'Landed'
    };
    return statuses[status] || status;
  },

  bagWeight: (kg) => {
    return `${kg} kg`;
  },

  distance: (km) => {
    return `${km.toLocaleString()} km`;
  },

  airportCode: (code) => {
    return code?.toUpperCase();
  },

  cityName: (str) => {
    return str?.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();
  }
};

export default formatters;