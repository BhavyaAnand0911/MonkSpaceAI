const express = require("express");
const mongoose = require("mongoose");
const Availability = require("../models/Availibility.model");
const User = require("../models/User.model"); // Ensure User model is imported
const router = express.Router();

router.post("/availability", async (req, res) => {
  try {
    const { date, startTime, endTime, userId } = req.body; // Ensure userId is extracted

    const finalUserId = req.user ? req.user.id : userId;
    console.log(finalUserId);

    if (!mongoose.Types.ObjectId.isValid(finalUserId)) {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    const user = await User.findById(finalUserId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    console.log("User found:", user); // Debugging log

    const availability = new Availability({
      userId: user._id,
      date,
      startTime,
      endTime,
    });

    await availability.save();
    res
      .status(201)
      .json({ message: "Availability saved successfully", availability });
  } catch (err) {
    console.error("Error adding availability:", err); // Debugging log
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
