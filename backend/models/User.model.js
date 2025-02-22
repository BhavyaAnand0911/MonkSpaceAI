const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "employee"] },
  timeZone: String,
  availability: [{ type: mongoose.Schema.Types.ObjectId, ref: "Availability" }], // Reference availability
});

module.exports = mongoose.model("User", UserSchema);
