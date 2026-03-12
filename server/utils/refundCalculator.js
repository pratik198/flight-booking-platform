module.exports = (departureTime, price) => {

  const diff = (departureTime - new Date()) / (1000 * 60 * 60);

  if (diff > 24) return price * 0.9;

  if (diff > 6) return price * 0.5;

  return 0;
};