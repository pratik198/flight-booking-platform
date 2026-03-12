const mongoose = require("mongoose");

const refundSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking"
  },
  amount: Number,
  status: String,
  processedAt: Date
});

module.exports = mongoose.model("Refund", refundSchema);