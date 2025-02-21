const mongoose = require("mongoose");
const ShiftSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: String,
  startTime: String,
  endTime: String,
  timeZone: String,
});
module.exports = mongoose.model("Shift", ShiftSchema);
