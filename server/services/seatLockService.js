const Seat = require("../models/Seat");
const SeatHold = require("../models/SeatHold");

exports.lockSeat = async (seatId, userId) => {

  const seat = await Seat.findById(seatId);

  if (!seat) throw new Error("Seat not found");

  if (seat.status !== "available")
    throw new Error("Seat already held or booked");

  seat.status = "held";
  await seat.save();

  const hold = await SeatHold.create({
    seatId,
    userId,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000)
  });

  return hold;
};


exports.releaseSeat = async (seatId) => {

  const seat = await Seat.findById(seatId);

  if (!seat) return;

  seat.status = "available";

  await seat.save();

  await SeatHold.deleteMany({ seatId });

};