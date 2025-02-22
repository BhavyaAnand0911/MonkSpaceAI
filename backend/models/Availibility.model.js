const mongoose = require("mongoose");
const AvailabilitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: String,
  startTime: String,
  endTime: String,
});
module.exports = mongoose.model("Availability", AvailabilitySchema);
