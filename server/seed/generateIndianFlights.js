const connectDB = require("../config/db");
const Flight = require("../models/Flight");
const Route = require("../models/Route");
const Seat = require("../models/Seat");

require("dotenv").config();

// Major Indian airports for domestic flights
const domesticAirports = [
  { code: "DEL", name: "Delhi", city: "New Delhi" },
  { code: "BOM", name: "Mumbai", city: "Mumbai" },
  { code: "BLR", name: "Bangalore", city: "Bangalore" },
  { code: "HYD", name: "Hyderabad", city: "Hyderabad" },
  { code: "CCU", name: "Kolkata", city: "Kolkata" },
  { code: "MAA", name: "Chennai", city: "Chennai" },
  { code: "GOI", name: "Goa", city: "Goa" },
  { code: "AMD", name: "Ahmedabad", city: "Ahmedabad" },
  { code: "PNQ", name: "Pune", city: "Pune" },
  { code: "COK", name: "Kochi", city: "Kochi" },
  { code: "BBI", name: "Bhubaneswar", city: "Bhubaneswar" },
  { code: "IXC", name: "Chandigarh", city: "Chandigarh" },
  { code: "JAI", name: "Jaipur", city: "Jaipur" },
  { code: "LKO", name: "Lucknow", city: "Lucknow" },
  { code: "PAT", name: "Patna", city: "Patna" },
  { code: "GAU", name: "Guwahati", city: "Guwahati" },
  { code: "IXB", name: "Bagdogra", city: "Siliguri" },
  { code: "TRV", name: "Trivandrum", city: "Thiruvananthapuram" },
  { code: "IXR", name: "Ranchi", city: "Ranchi" },
  { code: "VNS", name: "Varanasi", city: "Varanasi" }
];

// International airports (for some international flights)
const internationalAirports = [
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

// Major domestic routes with flight frequencies
const majorDomesticRoutes = [
  { origin: "DEL", destination: "BOM", flightsPerDay: 12, avgDuration: 2.5 },
  { origin: "DEL", destination: "BLR", flightsPerDay: 10, avgDuration: 3.0 },
  { origin: "DEL", destination: "CCU", flightsPerDay: 8, avgDuration: 2.5 },
  { origin: "DEL", destination: "MAA", flightsPerDay: 8, avgDuration: 3.5 },
  { origin: "DEL", destination: "HYD", flightsPerDay: 6, avgDuration: 2.5 },
  { origin: "DEL", destination: "AMD", flightsPerDay: 6, avgDuration: 2.0 },
  { origin: "DEL", destination: "GOI", flightsPerDay: 4, avgDuration: 3.0 },
  { origin: "DEL", destination: "BBI", flightsPerDay: 6, avgDuration: 2.5 }, // BBI to DEL
  { origin: "BBI", destination: "DEL", flightsPerDay: 6, avgDuration: 2.5 }, // DEL to BBI
  { origin: "DEL", destination: "IXC", flightsPerDay: 4, avgDuration: 1.5 },
  { origin: "DEL", destination: "JAI", flightsPerDay: 4, avgDuration: 1.5 },
  { origin: "DEL", destination: "LKO", flightsPerDay: 5, avgDuration: 1.5 },
  { origin: "BOM", destination: "BLR", flightsPerDay: 8, avgDuration: 2.0 },
  { origin: "BOM", destination: "CCU", flightsPerDay: 6, avgDuration: 3.0 },
  { origin: "BOM", destination: "MAA", flightsPerDay: 6, avgDuration: 2.5 },
  { origin: "BOM", destination: "HYD", flightsPerDay: 5, avgDuration: 1.5 },
  { origin: "BOM", destination: "GOI", flightsPerDay: 4, avgDuration: 1.5 },
  { origin: "BOM", destination: "PNQ", flightsPerDay: 3, avgDuration: 1.0 },
  { origin: "BLR", destination: "MAA", flightsPerDay: 6, avgDuration: 1.5 },
  { origin: "BLR", destination: "HYD", flightsPerDay: 4, avgDuration: 1.0 },
  { origin: "BLR", destination: "CCU", flightsPerDay: 4, avgDuration: 3.0 },
  { origin: "BLR", destination: "GOI", flightsPerDay: 3, avgDuration: 1.5 },
  { origin: "CCU", destination: "BLR", flightsPerDay: 4, avgDuration: 3.0 },
  { origin: "CCU", destination: "MAA", flightsPerDay: 3, avgDuration: 3.5 },
  { origin: "CCU", destination: "HYD", flightsPerDay: 3, avgDuration: 2.5 },
  { origin: "CCU", destination: "BBI", flightsPerDay: 4, avgDuration: 1.0 },
  { origin: "BBI", destination: "CCU", flightsPerDay: 4, avgDuration: 1.0 },
  { origin: "HYD", destination: "MAA", flightsPerDay: 4, avgDuration: 1.5 },
  { origin: "HYD", destination: "CCU", flightsPerDay: 3, avgDuration: 2.5 },
  { origin: "MAA", destination: "CCU", flightsPerDay: 3, avgDuration: 3.5 },
  { origin: "AMD", destination: "BOM", flightsPerDay: 6, avgDuration: 2.0 },
  { origin: "AMD", destination: "BLR", flightsPerDay: 4, avgDuration: 2.5 },
  { origin: "GOI", destination: "BLR", flightsPerDay: 3, avgDuration: 1.5 },
  { origin: "PNQ", destination: "DEL", flightsPerDay: 4, avgDuration: 3.0 },
  { origin: "COK", destination: "BLR", flightsPerDay: 4, avgDuration: 1.5 },
  { origin: "COK", destination: "MAA", flightsPerDay: 3, avgDuration: 2.0 },
  { origin: "TRV", destination: "BLR", flightsPerDay: 3, avgDuration: 2.0 },
  { origin: "IXC", destination: "BOM", flightsPerDay: 2, avgDuration: 3.0 },
  { origin: "JAI", destination: "BOM", flightsPerDay: 3, avgDuration: 2.0 },
  { origin: "LKO", destination: "BOM", flightsPerDay: 3, avgDuration: 2.5 },
  { origin: "PAT", destination: "DEL", flightsPerDay: 3, avgDuration: 2.0 },
  { origin: "GAU", destination: "DEL", flightsPerDay: 2, avgDuration: 3.0 },
  { origin: "IXB", destination: "DEL", flightsPerDay: 2, avgDuration: 3.5 },
  { origin: "IXR", destination: "DEL", flightsPerDay: 2, avgDuration: 2.5 },
  { origin: "VNS", destination: "DEL", flightsPerDay: 2, avgDuration: 1.5 }
];

const FLIGHT_COUNT = 1000; // Generate more flights
const SEATS_PER_FLIGHT = 180; // More realistic seat count
const BATCH_SIZE = 5000;

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const buildFlightNumber = (airlineCode) => airlineCode + (Math.floor(Math.random() * 9000) + 1000);

// Generate realistic flight times throughout the day
const generateFlightTimes = (flightsPerDay) => {
  const times = [];
  const startHour = 6; // 6 AM
  const endHour = 22; // 10 PM
  
  for (let i = 0; i < flightsPerDay; i++) {
    const hour = startHour + Math.floor((endHour - startHour) * i / (flightsPerDay - 1 || 1));
    const minute = randomInt(0, 59);
    times.push({ hour, minute });
  }
  
  return times;
};

// Generate price based on route popularity and distance
const generatePrice = (origin, destination, avgDuration) => {
  const basePrice = 2500; // Base price for short flights
  const pricePerHour = 800; // Additional price per hour
  const routeMultiplier = {
    'DEL-BOM': 1.5, 'BOM-DEL': 1.5,
    'DEL-BLR': 1.4, 'BLR-DEL': 1.4,
    'DEL-CCU': 1.3, 'CCU-DEL': 1.3,
    'DEL-MAA': 1.4, 'MAA-DEL': 1.4,
    'BOM-BLR': 1.2, 'BLR-BOM': 1.2,
    'BLR-MAA': 1.1, 'MAA-BLR': 1.1
  };
  
  const routeKey = `${origin}-${destination}`;
  const multiplier = routeMultiplier[routeKey] || 1.0;
  
  return Math.floor((basePrice + (avgDuration * pricePerHour)) * multiplier);
};

const generateFlights = async () => {
  await connectDB();

  try {
    await Flight.deleteMany();
    await Route.deleteMany();
    await Seat.deleteMany();

    const routeSet = new Set();
    let flightsInserted = 0;
    let flightBatch = [];

    console.log(`⚡ Generating flights for ${majorDomesticRoutes.length} major domestic routes...`);

    // Generate flights for major domestic routes
    for (const route of majorDomesticRoutes) {
      const flightTimes = generateFlightTimes(route.flightsPerDay);
      
      for (let dayOffset = 0; dayOffset < 30; dayOffset++) { // Generate for next 30 days
        for (const time of flightTimes) {
          const airline = airlines[randomInt(0, airlines.length - 1)];
          
          const departure = new Date();
          departure.setDate(departure.getDate() + dayOffset);
          departure.setHours(time.hour, time.minute, 0, 0);
          
          const durationMinutes = Math.floor(route.avgDuration * 60) + randomInt(-15, 15); // Add some variation
          const arrival = new Date(departure);
          arrival.setMinutes(arrival.getMinutes() + durationMinutes);
          
          flightBatch.push({
            flightNumber: buildFlightNumber(airline.code),
            airline: airline.name,
            origin: route.origin,
            destination: route.destination,
            departureTime: departure,
            arrivalTime: arrival,
            price: generatePrice(route.origin, route.destination, route.avgDuration),
            aircraft: ["A320", "B737", "A321", "B777"][randomInt(0, 3)],
            totalSeats: SEATS_PER_FLIGHT,
          });
          
          routeSet.add(`${route.origin}-${route.destination}`);
          
          if (flightBatch.length >= BATCH_SIZE) {
            await Flight.insertMany(flightBatch);
            flightsInserted += flightBatch.length;
            flightBatch = [];
            console.log(`✅ Inserted ${flightsInserted} flights...`);
          }
        }
      }
    }

    // Generate some international flights (10% of total)
    const internationalFlightCount = Math.floor(FLIGHT_COUNT * 0.1);
    console.log(`⚡ Generating ${internationalFlightCount} international flights...`);
    
    for (let i = 0; i < Math.min(internationalFlightCount, 100); i++) { // Limit to 100 for testing
      const origin = domesticAirports[randomInt(0, domesticAirports.length - 1)].code;
      const destination = internationalAirports[randomInt(0, internationalAirports.length - 1)];
      const airline = airlines.filter(a => ["BA", "EK", "SQ", "AF", "LH"].includes(a.code))[randomInt(0, 4)];
      
      const departure = new Date();
      departure.setDate(departure.getDate() + randomInt(0, 60));
      departure.setHours(randomInt(0, 23), randomInt(0, 59), 0, 0);
      
      const durationHours = randomInt(6, 15);
      const arrival = new Date(departure);
      arrival.setHours(arrival.getHours() + durationHours);
      
      flightBatch.push({
        flightNumber: buildFlightNumber(airline.code),
        airline: airline.name,
        origin,
        destination,
        departureTime: departure,
        arrivalTime: arrival,
        price: Math.floor(Math.random() * 50000) + 15000, // Higher prices for international
        aircraft: ["B777", "A380", "B787"][randomInt(0, 2)],
        totalSeats: 300, // Larger planes for international
      });
      
      routeSet.add(`${origin}-${destination}`);
      
      if (flightBatch.length >= BATCH_SIZE) {
        await Flight.insertMany(flightBatch);
        flightsInserted += flightBatch.length;
        flightBatch = [];
        console.log(`✅ Inserted ${flightsInserted} flights...`);
      }
    }

    if (flightBatch.length > 0) {
      await Flight.insertMany(flightBatch);
      flightsInserted += flightBatch.length;
      console.log(`✅ Inserted ${flightsInserted} flights...`);
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
      for (let seatIndex = 1; seatIndex <= flight.totalSeats; seatIndex++) {
        seatsBatch.push({
          flightId: flight._id,
          seatNumber: `${String.fromCharCode(65 + Math.floor((seatIndex - 1) / 6))}${((seatIndex - 1) % 6) + 1}`,
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
