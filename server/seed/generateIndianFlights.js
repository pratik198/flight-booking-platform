const connectDB = require("../config/db");
const Flight = require("../models/Flight");
const Route = require("../models/Route");
const Seat = require("../models/Seat");

require("dotenv").config();

const airports = [
  "DEL", // Delhi
  "BOM", // Mumbai
  "BLR", // Bangalore
  "HYD", // Hyderabad
  "CCU", // Kolkata
  "MAA", // Chennai
  "GOI", // Goa
  "AMD", // Ahmedabad
  "PNQ", // Pune
  "COK"  // Kochi
];

const airlines = [
  { code: "AI", name: "Air India" },
  { code: "6E", name: "IndiGo" },
  { code: "UK", name: "Vistara" },
  { code: "SG", name: "SpiceJet" },
  { code: "IX", name: "Air India Express" }
];

const generateFlights = async () => {
  await connectDB();

  try {

    await Flight.deleteMany();
    await Route.deleteMany();
    await Seat.deleteMany();

    const routes = [];
    const flights = [];

    for (let i = 0; i < airports.length; i++) {
      for (let j = 0; j < airports.length; j++) {

        if (i === j) continue;

        routes.push({
          origin: airports[i],
          destination: airports[j]
        });

        for (let k = 0; k < 5; k++) {

          const airline = airlines[Math.floor(Math.random() * airlines.length)];

          const departure = new Date();
          departure.setHours(Math.floor(Math.random() * 24));
          departure.setMinutes(Math.floor(Math.random() * 60));

          const arrival = new Date(departure);
          arrival.setHours(departure.getHours() + Math.floor(Math.random() * 3) + 1);

          flights.push({
            flightNumber: airline.code + (Math.floor(Math.random() * 900) + 100),
            airline: airline.name,
            origin: airports[i],
            destination: airports[j],
            departureTime: departure,
            arrivalTime: arrival,
            price: Math.floor(Math.random() * 5000) + 2500,
            aircraft: "A320",
            totalSeats: 180
          });

        }

      }
    }

    await Route.insertMany(routes);
    const createdFlights = await Flight.insertMany(flights);

    // Generate seats for each flight
    const allSeats = [];
    createdFlights.forEach(flight => {
      const rows = 30;
      const seatLetters = ["A", "B", "C", "D", "E", "F"];
      
      for (let r = 1; r <= rows; r++) {
        seatLetters.forEach(letter => {
          allSeats.push({
            flightId: flight._id,
            seatNumber: r + letter,
            status: "available"
          });
        });
      }
    });

    if (allSeats.length > 0) {
      await Seat.insertMany(allSeats);
    }

    console.log("✅ 500+ Indian flights generated successfully");
    console.log("✅ Seats generated for all flights");

    process.exit();

  } catch (err) {
    console.error(err);
  }
};

generateFlights();