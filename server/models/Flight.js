const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema(
  {
    flightNumber: String,
    airline: String,
    origin: String,
    destination: String,
    departureTime: Date,
    arrivalTime: Date,
    price: Number,
    aircraft: String,
    totalSeats: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("Flight", flightSchema);