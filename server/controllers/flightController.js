const Flight = require("../models/Flight");
const Route = require("../models/Route");


// SEARCH FLIGHTS
exports.searchFlights = async (req, res) => {
  try {

    const { origin, destination, date, minPrice, maxPrice } = req.query;

    const query = {};

    if (origin) query.origin = origin;
    if (destination) query.destination = destination;

    if (date) {

      const start = new Date(date);
      const end = new Date(date);

      end.setHours(23, 59, 59, 999);

      query.departureTime = {
        $gte: start,
        $lte: end
      };

    }

    if (minPrice || maxPrice) {

      query.price = {};

      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);

    }

    const flights = await Flight.find(query).sort({ departureTime: 1 });

    res.json({
      count: flights.length,
      flights
    });

  } catch (err) {

    res.status(500).json({ message: err.message });

  }
};



// GET FLIGHT DETAILS
exports.getFlightById = async (req, res) => {

  try {

    const flight = await Flight.findById(req.params.id);

    if (!flight)
      return res.status(404).json({ message: "Flight not found" });

    res.json(flight);

  } catch (err) {

    res.status(500).json({ message: err.message });

  }

};



// GET ALL ROUTES
exports.getRoutes = async (req, res) => {

  try {

    const routes = await Route.find();

    res.json(routes);

  } catch (err) {

    res.status(500).json({ message: err.message });

  }

};



// GET ALL FLIGHTS (admin/debug)
exports.getAllFlights = async (req, res) => {

  try {

    const flights = await Flight.find().limit(50);

    res.json(flights);

  } catch (err) {

    res.status(500).json({ message: err.message });

  }

};