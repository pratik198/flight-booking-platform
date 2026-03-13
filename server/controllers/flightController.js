const Flight = require("../models/Flight");
const Route = require("../models/Route");


// SEARCH FLIGHTS
exports.searchFlights = async (req, res) => {
  try {
    const {
      origin,
      destination,
      date,
      returnDate,
      passengers,
      tripType,
      cabinClass,
      directFlightsOnly,
      minPrice,
      maxPrice,
      airlines,
      maxStops,
      departureTimeStart,
      departureTimeEnd,
      arrivalTimeStart,
      arrivalTimeEnd,
      sortBy = 'departureTime',
      sortOrder = 'asc',
      limit = 50,
      flexibleDates = false
    } = req.query;

    const query = {};
    let dateRange = [];

    // Basic route filters
    if (origin) query.origin = origin;
    if (destination) query.destination = destination;

    // Date filtering with flexibility option
    if (date) {
      if (flexibleDates === 'true') {
        // Search +/- 3 days from the selected date
        const baseDate = new Date(date);
        const startDate = new Date(baseDate);
        startDate.setDate(baseDate.getDate() - 3);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(baseDate);
        endDate.setDate(baseDate.getDate() + 3);
        endDate.setHours(23, 59, 59, 999);

        query.departureTime = {
          $gte: startDate,
          $lte: endDate
        };
        dateRange = [startDate, endDate];
      } else {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        query.departureTime = {
          $gte: start,
          $lte: end
        };
        dateRange = [start, end];
      }
    }

    // Return date for round trips
    if (returnDate && tripType === 'roundtrip') {
      // This would need to be handled differently for round-trip searches
      // For now, we'll focus on one-way flexibility
    }

    // Price range filtering
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Airline filtering
    if (airlines) {
      const airlineArray = Array.isArray(airlines) ? airlines : airlines.split(',');
      query.airline = { $in: airlineArray };
    }

    // Cabin class filtering (assuming flights have cabinClass field)
    if (cabinClass && cabinClass !== 'all') {
      query.cabinClass = cabinClass;
    }

    // Direct flights only
    if (directFlightsOnly === 'true') {
      query.stops = { $exists: false }; // Assuming direct flights have no stops field or stops = 0
    }

    // Maximum stops
    if (maxStops) {
      query.stops = { $lte: Number(maxStops) };
    }

    // Departure time range
    if (departureTimeStart || departureTimeEnd) {
      const departureTimeQuery = {};
      if (departureTimeStart) {
        const [hours, minutes] = departureTimeStart.split(':');
        const startTime = new Date();
        startTime.setHours(hours, minutes, 0, 0);
        departureTimeQuery.$gte = startTime;
      }
      if (departureTimeEnd) {
        const [hours, minutes] = departureTimeEnd.split(':');
        const endTime = new Date();
        endTime.setHours(hours, minutes, 0, 0);
        departureTimeQuery.$lte = endTime;
      }
      if (Object.keys(departureTimeQuery).length > 0) {
        query.departureTime = { ...query.departureTime, ...departureTimeQuery };
      }
    }

    // Arrival time range
    if (arrivalTimeStart || arrivalTimeEnd) {
      const arrivalTimeQuery = {};
      if (arrivalTimeStart) {
        const [hours, minutes] = arrivalTimeStart.split(':');
        const startTime = new Date();
        startTime.setHours(hours, minutes, 0, 0);
        arrivalTimeQuery.$gte = startTime;
      }
      if (arrivalTimeEnd) {
        const [hours, minutes] = arrivalTimeEnd.split(':');
        const endTime = new Date();
        endTime.setHours(hours, minutes, 0, 0);
        arrivalTimeQuery.$lte = endTime;
      }
      if (Object.keys(arrivalTimeQuery).length > 0) {
        query.arrivalTime = arrivalTimeQuery;
      }
    }

    // Build sort options
    let sortOptions = {};
    switch (sortBy) {
      case 'price':
        sortOptions.price = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'departureTime':
        sortOptions.departureTime = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'arrivalTime':
        sortOptions.arrivalTime = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'duration':
        // This would require calculating duration in aggregation pipeline
        sortOptions.departureTime = 1; // fallback
        break;
      default:
        sortOptions.departureTime = 1;
    }

    const flights = await Flight.find(query)
      .sort(sortOptions)
      .limit(Number(limit));

    res.json({
      count: flights.length,
      flights,
      searchCriteria: {
        origin,
        destination,
        dateRange,
        filters: {
          cabinClass,
          directFlightsOnly,
          airlines: airlines ? (Array.isArray(airlines) ? airlines : airlines.split(',')) : null,
          maxStops,
          priceRange: { min: minPrice, max: maxPrice },
          departureTimeRange: { start: departureTimeStart, end: departureTimeEnd },
          arrivalTimeRange: { start: arrivalTimeStart, end: arrivalTimeEnd }
        }
      }
    });

  } catch (err) {
    console.error('Search error:', err);
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