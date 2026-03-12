const Booking = require("../models/Booking");
const generatePNR = require("../utils/generatePNR");

exports.createBooking = async (req, res) => {

  const { flightId, seatNumber, userId } = req.body;

  const booking = await Booking.create({
    userId,
    flightId,
    seatNumber,
    pnr: generatePNR()
  });

  res.json(booking);
};