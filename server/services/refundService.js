const Refund = require("../models/Refund");
const Booking = require("../models/Booking");
const refundCalculator = require("../utils/refundCalculator");

exports.processRefund = async (bookingId) => {

  const booking = await Booking.findById(bookingId)
    .populate("flightId");

  if (!booking) throw new Error("Booking not found");

  const refundAmount = refundCalculator(
    booking.flightId.departureTime,
    booking.flightId.price
  );

  const refund = await Refund.create({
    bookingId,
    amount: refundAmount,
    status: "processed",
    processedAt: new Date()
  });

  booking.status = "cancelled";
  await booking.save();

  return refund;

};