const connectDB = require("../config/db");
const Flight = require("../models/Flight");
const Route = require("../models/Route");
const Seat = require("../models/Seat");

require("dotenv").config();

// Airports include major Indian cities plus key international hubs
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
  "COK", // Kochi
  "BBI", // Bhubaneswar (Odisha)
  // International hubs
  "BCN", // Barcelona
  "SIN", // Singapore
  "DXB", // Dubai
  "LHR", // London
  "JFK", // New York
  "SYD", // Sydney
  "NRT", // Tokyo
  "FRA", // Frankfurt
  "CDG", // Paris
  "HKG", // Hong Kong
  "DOH"  // Doha
];

// Airlines (mix of domestic + international for realism)
const airlines = [
  { code: "AI", name: "Air India" },
  { code: "6E", name: "IndiGo" },
  { code: "UK", name: "Vistara" },
  { code: "SG", name: "SpiceJet" },
  { code: "IX", name: "Air India Express" },
  { code: "BA", name: "British Airways" },
  { code: "EK", name: "Emirates" },
  { code: "SQ", name: "Singapore Airlines" },
  { code: "AF", name: "Air France" },
  { code: "LH", name: "Lufthansa" }
];

const FLIGHT_COUNT = parseInt(process.env.FLIGHT_COUNT, 10) || 120000; // >= 100k flights
const SEATS_PER_FLIGHT = parseInt(process.env.SEATS_PER_FLIGHT, 10) || 20;
const BATCH_SIZE = 5000;

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const buildFlightNumber = (airlineCode) => airlineCode + (Math.floor(Math.random() * 9000) + 1000);

const generateFlights = async () => {
  await connectDB();

  try {
    await Flight.deleteMany();
    await Route.deleteMany();
    await Seat.deleteMany();

    const routeSet = new Set();
    let flightsInserted = 0;
    let flightBatch = [];

    console.log(`⚡ Generating ${FLIGHT_COUNT} flights...`);

    for (let i = 0; i < FLIGHT_COUNT; i++) {
      const origin = airports[randomInt(0, airports.length - 1)];
      let destination = airports[randomInt(0, airports.length - 1)];
      while (destination === origin) {
        destination = airports[randomInt(0, airports.length - 1)];
      }

      const airline = airlines[randomInt(0, airlines.length - 1)];

      const departure = new Date();
      departure.setDate(departure.getDate() + randomInt(0, 60));
      departure.setHours(randomInt(0, 23), randomInt(0, 59), 0, 0);

      const durationHours = randomInt(1, 8);
      const arrival = new Date(departure);
      arrival.setHours(arrival.getHours() + durationHours);

      flightBatch.push({
        flightNumber: buildFlightNumber(airline.code),
        airline: airline.name,
        origin,
        destination,
        departureTime: departure,
        arrivalTime: arrival,
        price: Math.floor(Math.random() * 15000) + 2000,
        aircraft: "A320",
        totalSeats: SEATS_PER_FLIGHT,
      });

      routeSet.add(`${origin}-${destination}`);

      if (flightBatch.length >= BATCH_SIZE) {
        await Flight.insertMany(flightBatch);
        flightsInserted += flightBatch.length;
        flightBatch = [];
        console.log(`✅ Inserted ${flightsInserted}/${FLIGHT_COUNT} flights...`);
      }
    }

    if (flightBatch.length > 0) {
      await Flight.insertMany(flightBatch);
      flightsInserted += flightBatch.length;
      console.log(`✅ Inserted ${flightsInserted}/${FLIGHT_COUNT} flights...`);
    }

    // Insert routes
    const routes = Array.from(routeSet).map((key) => {
      const [origin, destination] = key.split("-");
      return { origin, destination };
    });

    console.log(`⚡ Generating ${routes.length} unique routes...`);
    await Route.insertMany(routes);

    // Generate seats for each flight via cursor to avoid huge memory usage
    console.log(`⚡ Generating seats (~${flightsInserted * SEATS_PER_FLIGHT} seats)...`);

    const cursor = Flight.find().cursor();
    let seatsBatch = [];
    let flightsProcessed = 0;

    for await (const flight of cursor) {
      for (let seatIndex = 1; seatIndex <= SEATS_PER_FLIGHT; seatIndex++) {
        seatsBatch.push({
          flightId: flight._id,
          seatNumber: `S${seatIndex}`,
          status: "available",
        });
      }

      flightsProcessed += 1;

      if (seatsBatch.length >= BATCH_SIZE) {
        await Seat.insertMany(seatsBatch);
        seatsBatch = [];
        console.log(`✅ Generated seats for ${flightsProcessed} flights...`);
      }
    }

    if (seatsBatch.length > 0) {
      await Seat.insertMany(seatsBatch);
      console.log(`✅ Generated seats for all ${flightsProcessed} flights.`);
    }

    console.log(`🎉 Seed complete: ${flightsInserted} flights + ${routes.length} routes created.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

generateFlights();
