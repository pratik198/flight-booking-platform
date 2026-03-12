const axios = require("axios");
const connectDB = require("../config/db");
const Flight = require("../models/Flight");
const Route = require("../models/Route");

require("dotenv").config();

const fetchFlights = async () => {
  await connectDB();

  try {
    const res = await axios.get(
      `http://api.aviationstack.com/v1/flights?access_key=${process.env.FLIGHT_API_KEY}`
    );

    const flights = res.data.data;

    const formattedFlights = [];
    const routesSet = new Set();

    flights.forEach((f) => {
      const origin = f.departure?.iata;
      const destination = f.arrival?.iata;

      if (!origin || !destination) return;

      formattedFlights.push({
        flightNumber: f.flight?.iata || "UNKNOWN",
        airline: f.airline?.name || "Unknown",
        origin,
        destination,
        departureTime: f.departure?.scheduled,
        arrivalTime: f.arrival?.scheduled,
        price: Math.floor(Math.random() * 4000) + 2000
      });

      routesSet.add(`${origin}-${destination}`);
    });

    const routes = [...routesSet].map((r) => {
      const [origin, destination] = r.split("-");
      return { origin, destination };
    });

    await Flight.insertMany(formattedFlights);
    await Route.insertMany(routes);

    console.log("Flights and routes saved");

    process.exit();
  } catch (err) {
    console.error(err);
  }
};

fetchFlights();