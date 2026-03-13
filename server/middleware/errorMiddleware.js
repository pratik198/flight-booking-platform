const errorHandler = (err, req, res, next) => {

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Server Error';

  // Log stack trace in development
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: errors.join(', ') });
  }

  // Mongoose invalid ObjectId (CastError)
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }

  res.status(statusCode).json({
    success: false,
    message,
  });

};

module.exports = errorHandler;