const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  flightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flight"
  },
  seatNumber: String,
  status: {
    type: String,
    enum: ["available", "held", "booked"],
    default: "available"
  }
});

module.exports = mongoose.model("Seat", seatSchema);