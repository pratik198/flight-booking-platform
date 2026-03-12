const express = require("express");
const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getBookingById,
} = require("../controllers/bookingController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// require authentication for anything that involves the current user
router.post("/", auth, createBooking);
router.get("/", auth, getMyBookings);
router.get("/:bookingId", auth, getBookingById);
router.post("/:bookingId/cancel", auth, cancelBooking);

module.exports = router;