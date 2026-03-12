const express = require("express");
const router = express.Router();

const {
  searchFlights,
  getRoutes
} = require("../controllers/flightController");

router.get("/search", searchFlights);
router.get("/routes", getRoutes);

module.exports = router;