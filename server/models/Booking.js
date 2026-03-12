const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    flightId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flight"
    },
    seatNumber: String,
    // store passenger list so that booking details can be rendered later
    passengers: [
      {
        firstName: String,
        lastName: String,
        age: Number,
        gender: String,
        phone: String
      }
    ],
    totalAmount: Number,
    holdId: String,
    pnr: String,
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed"],
      default: "confirmed"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);