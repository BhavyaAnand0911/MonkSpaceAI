const express = require("express");
const mongoose = require("mongoose");
const Availability = require("../models/Availibility.model");
const User = require("../models/User.model");
const router = express.Router();
const Shift = require("../models/Shifts.model");

router.post("/availability", async (req, res) => {
  try {
    const { date, startTime, endTime, userId } = req.body;

    const finalUserId = req.user ? req.user.id : userId;
    console.log(finalUserId);

    if (!mongoose.Types.ObjectId.isValid(finalUserId)) {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    const user = await User.findById(finalUserId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    console.log("User found:", user);

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
    console.error("Error adding availability:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/shifts", async (req, res) => {
  try {
    console.log("Fetching shifts...");
    const userId = req.user ? req.user.id : req.query.userId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid Employee ID." });
    }

    const shifts = await Shift.find({ employeeId: userId }).populate("adminId");

    if (!shifts.length) {
      return res.status(404).json({ error: "No shifts found for this user." });
    }

    res.json(shifts);
  } catch (err) {
    console.error("Error fetching shifts:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
