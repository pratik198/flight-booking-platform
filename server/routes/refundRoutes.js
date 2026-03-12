const express = require("express");
const { processRefund } = require("../controllers/refundController");

const router = express.Router();

router.post("/:bookingId", processRefund);

module.exports = router;