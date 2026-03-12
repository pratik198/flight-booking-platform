const Seat = require("../models/Seat");
const SeatHold = require("../models/SeatHold");

exports.getSeats = async (req,res)=>{

  const seats = await Seat.find({
    flightId: req.params.flightId
  });

  res.json(seats);

};


exports.holdSeat = async (req,res)=>{

  const { seatId } = req.body;

  const seat = await Seat.findById(seatId);

  if(seat.status !== "available")
    return res.status(400).json({message:"Seat not available"});

  seat.status = "held";
  await seat.save();

  const hold = await SeatHold.create({
    seatId,
    userId:req.user.id,
    expiresAt: new Date(Date.now() + 10*60*1000)
  });

  res.json(hold);

};