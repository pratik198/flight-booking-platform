const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking"
  },
  amount: Number,
  method: String,
  status: {
    type: String,
    enum: ["pending", "success", "failed"]
  },
  transactionId: String
});

module.exports = mongoose.model("Payment", paymentSchema);