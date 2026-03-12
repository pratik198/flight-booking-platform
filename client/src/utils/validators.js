export const validatePassengerForm = (data) => {
  const errors = {};

  if (!data.firstName?.trim()) {
    errors.firstName = 'First name is required';
  } else if (data.firstName.length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  }

  if (!data.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (!data.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^[6-9]\d{9}$/.test(data.phone)) {
    errors.phone = 'Invalid Indian phone number';
  }

  if (!data.age) {
    errors.age = 'Age is required';
  } else if (data.age < 1 || data.age > 120) {
    errors.age = 'Age must be between 1 and 120';
  }

  return errors;
};

export const validatePaymentForm = (data) => {
  const errors = {};

  if (!data.cardNumber?.trim()) {
    errors.cardNumber = 'Card number is required';
  } else if (!/^\d{16}$/.test(data.cardNumber.replace(/\s/g, ''))) {
    errors.cardNumber = 'Invalid card number';
  }

  if (!data.cardName?.trim()) {
    errors.cardName = 'Cardholder name is required';
  }

  if (!data.expiry?.trim()) {
    errors.expiry = 'Expiry date is required';
  } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiry)) {
    errors.expiry = 'Invalid expiry format (MM/YY)';
  }

  if (!data.cvv?.trim()) {
    errors.cvv = 'CVV is required';
  } else if (!/^\d{3}$/.test(data.cvv)) {
    errors.cvv = 'CVV must be 3 digits';
  }

  return errors;
};

export const validateSearchForm = (data) => {
  const errors = {};

  if (!data.origin) {
    errors.origin = 'Origin is required';
  }

  if (!data.destination) {
    errors.destination = 'Destination is required';
  }

  if (data.origin === data.destination) {
    errors.destination = 'Origin and destination cannot be same';
  }

  if (!data.departureDate) {
    errors.departureDate = 'Departure date is required';
  }

  if (data.tripType === 'roundtrip' && !data.returnDate) {
    errors.returnDate = 'Return date is required for round trip';
  }

  if (data.tripType === 'roundtrip' && data.returnDate && data.returnDate < data.departureDate) {
    errors.returnDate = 'Return date must be after departure date';
  }

  return errors;
};

export const validateLoginForm = (data) => {
  const errors = {};

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
};

export const validateRegisterForm = (data) => {
  const errors = {};

  if (!data.name?.trim()) {
    errors.name = 'Name is required';
  } else if (data.name.length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};