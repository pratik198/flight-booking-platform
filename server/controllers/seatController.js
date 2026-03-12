const Seat = require("../models/Seat");
const SeatHold = require("../models/SeatHold");
const Flight = require("../models/Flight");

exports.getSeats = async (req,res)=>{
  try {
    const { flightId } = req.params;

    let seats = await Seat.find({
      flightId: flightId
    });

    // If no seats exist, generate them
    if (seats.length === 0) {
      const flight = await Flight.findById(flightId);
      if (!flight) {
        return res.status(404).json({ message: "Flight not found" });
      }

      // Generate seats for the flight
      const rows = 30;
      const seatLetters = ["A", "B", "C", "D", "E", "F"];
      const newSeats = [];
      
      for (let r = 1; r <= rows; r++) {
        seatLetters.forEach(letter => {
          newSeats.push({
            flightId,
            seatNumber: r + letter,
            status: "available"
          });
        });
      }

      await Seat.insertMany(newSeats);
      seats = await Seat.find({ flightId: flightId });
    }

    res.json(seats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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