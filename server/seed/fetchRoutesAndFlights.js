const axios = require("axios");
const connectDB = require("../config/db");
const Flight = require("../models/Flight");
const Route = require("../models/Route");

require("dotenv").config();

const API_KEY = process.env.AVIATION_EDGE_KEY;

const fetchRoutesAndFlights = async () => {
  await connectDB();

  try {
    console.log("Fetching routes from Aviation Edge...");

    const res = await axios.get(
      `https://aviation-edge.com/v2/public/routes?key=${API_KEY}`
    );

    const routesData = res.data;

    const routes = [];
    const flights = [];

    routesData.forEach((route, index) => {
      const origin = route.departureIata;
      const destination = route.arrivalIata;

      if (!origin || !destination) return;

      routes.push({
        origin,
        destination
      });

      flights.push({
        flightNumber: route.airlineIata + (100 + index),
        airline: route.airlineIata,
        origin,
        destination,
        departureTime: new Date(),
        arrivalTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        price: Math.floor(Math.random() * 5000) + 2000,
        aircraft: "A320",
        totalSeats: 180
      });
    });

    await Route.insertMany(routes);
    await Flight.insertMany(flights);

    console.log("Routes and Flights inserted successfully");

    process.exit();

  } catch (err) {
    console.error("Error:", err.message);
  }
};

fetchRoutesAndFlights();