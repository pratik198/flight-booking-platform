const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
  origin: String,
  destination: String
});

module.exports = mongoose.model("Route", routeSchema);