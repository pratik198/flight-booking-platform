const Refund = require("../models/Refund");
const Booking = require("../models/Booking");
const refundCalc = require("../utils/refundCalculator");

exports.processRefund = async (req,res)=>{

  const booking = await Booking.findById(req.params.bookingId)
  .populate("flightId");

  const amount = refundCalc(
    booking.flightId.departureTime,
    booking.flightId.price
  );

  const refund = await Refund.create({
    bookingId:booking._id,
    amount,
    status:"processed",
    processedAt:new Date()
  });

  booking.status="cancelled";
  await booking.save();

  res.json(refund);

};