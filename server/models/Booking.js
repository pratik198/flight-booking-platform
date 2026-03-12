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
    pnr: String,
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);