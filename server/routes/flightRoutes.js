const express = require("express");
const router = express.Router();

const {
  searchFlights,
  getRoutes,
  getFlightById,
  getAllFlights
} = require("../controllers/flightController");

router.get("/search", searchFlights);
router.get("/routes", getRoutes);
router.get("/:id", getFlightById);
router.get("/", getAllFlights);

module.exports = router;