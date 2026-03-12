const mongoose = require("mongoose");

const seatHoldSchema = new mongoose.Schema({
  seatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seat"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  expiresAt: Date
});

module.exports = mongoose.model("SeatHold", seatHoldSchema);