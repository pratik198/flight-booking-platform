require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const flightRoutes = require("./routes/flightRoutes");
const seatRoutes = require("./routes/seatRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const refundRoutes = require("./routes/refundRoutes");

const errorHandler = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());


// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/refund", refundRoutes);


// HEALTH ROUTE
app.get("/", (req, res) => {
  res.json({ message: "Flight Booking API Running" });
});

app.use(errorHandler);


// START SERVER AFTER DB CONNECTS
const PORT = process.env.PORT || 5000;

const startServer = async () => {

  await connectDB();

  // START CRON JOB AFTER DB
  require("./jobs/releaseSeatLocks");

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

};

startServer();