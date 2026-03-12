const express = require("express");
const { getSeats, holdSeat } = require("../controllers/seatController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:flightId", getSeats);
router.post("/hold", auth, holdSeat);

module.exports = router;