const Seat = require("../models/Seat");

module.exports = async (flightId) => {

  const rows = 30;
  const seats = ["A","B","C","D","E","F"];

  const allSeats = [];

  for(let r=1;r<=rows;r++){

    seats.forEach(letter=>{
      allSeats.push({
        flightId,
        seatNumber: r + letter
      });
    });

  }

  await Seat.insertMany(allSeats);
};