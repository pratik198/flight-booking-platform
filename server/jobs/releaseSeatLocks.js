const cron = require("node-cron");
const SeatHold = require("../models/SeatHold");
const Seat = require("../models/Seat");

cron.schedule("* * * * *", async () => {

  try {

    const expired = await SeatHold.find({
      expiresAt: { $lt: new Date() }
    });

    for (const hold of expired) {

      const seat = await Seat.findById(hold.seatId);

      if (seat) {
        seat.status = "available";
        await seat.save();
      }

      await hold.deleteOne();

    }

  } catch (err) {

    console.error("Seat lock release error:", err.message);

  }

});