const express = require("express");
const User = require("../models/User.model");
const Shift = require("../models/Shifts.model");
const Availability = require("../models/Availibility.model");
const router = express.Router();

router.post("/shifts", async (req, res) => {
  try {
    const { adminId, employeeId, date, startTime, endTime, timeZone } =
      req.body;
    const employee = await User.findById(employeeId);
    const convertedStartTime = convertTimeZone(
      startTime,
      timeZone,
      employee.timeZone
    );
    const convertedEndTime = convertTimeZone(
      endTime,
      timeZone,
      employee.timeZone
    );

    const matchingAvailability = await Availability.findOne({
      userId: employeeId,
      day: date,
      startTime: { $lte: convertedStartTime },
      endTime: { $gte: convertedEndTime },
    });

    if (!matchingAvailability) {
      return res
        .status(400)
        .json({ error: "No matching availability found for this employee." });
    }

    const shift = new Shift({
      adminId,
      employeeId,
      date,
      startTime: convertedStartTime,
      endTime: convertedEndTime,
      timeZone,
    });
    await shift.save();
    res.status(201).json(shift);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
module.exports = router;
