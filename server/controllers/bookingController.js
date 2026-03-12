const Booking = require("../models/Booking");
const generatePNR = require("../utils/generatePNR");
const Seat = require("../models/Seat");

exports.createBooking = async (req, res) => {
  try {
    // userId should come from auth middleware, not the body
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const { flightId, seatNumber, passengers, totalAmount, holdId } = req.body;

    const booking = await Booking.create({
      userId,
      flightId,
      seatNumber,
      passengers,
      totalAmount,
      pnr: generatePNR(),
    });

    // Mark seat as booked
    const seat = await Seat.findOne({ flightId, seatNumber });
    if (seat) {
      seat.status = "booked";
      await seat.save();
    }

    // if a holdId was provided, delete the hold record so it doesn't linger
    if (holdId) {
      const SeatHold = require("../models/SeatHold");
      await SeatHold.findByIdAndDelete(holdId).catch(() => {});
    }

    const populatedBooking = await booking.populate("flightId");
    res.json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    let bookings = await Booking.find({ userId })
      .populate("flightId")
      .sort({ createdAt: -1 });

    // automatically label past flights as completed
    bookings = bookings.map((b) => {
      if (
        b.status === 'confirmed' &&
        b.flightId &&
        new Date(b.flightId.departureTime) < new Date()
      ) {
        // don't modify db, just change the object returned
        return { ...b.toObject(), status: 'completed' };
      }
      return b;
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// retrieve an individual booking by id (must belong to logged in user)
exports.getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findById(bookingId).populate("flightId");
    if (!booking || String(booking.userId) !== String(req.user.id)) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "cancelled" },
      { new: true }
    ).populate("flightId");

    // Release seat
    const seat = await Seat.findOne({
      flightId: booking.flightId._id,
      seatNumber: booking.seatNumber,
    });

    if (seat) {
      seat.status = "available";
      await seat.save();
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};