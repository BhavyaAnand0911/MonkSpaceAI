const express = require("express");
const Availability = require("../models/Availibility.model");
const Shift = require("../models/Shifts.model");
const router = express.Router();

router.post("/availability", async (req, res) => {
  try {
    const { userId, day, startTime, endTime } = req.body;
    const availability = new Availability({ userId, day, startTime, endTime });
    await availability.save();
    res.status(201).json(availability);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/shifts/:userId", async (req, res) => {
  try {
    const shifts = await Shift.find({ employeeId: req.params.userId });
    res.json(shifts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
