const express = require("express");
const mongoose = require("mongoose");

const User = require("../models/User.model");
const Shift = require("../models/Shifts.model");
const Availability = require("../models/Availibility.model");
const moment = require("moment-timezone"); // Ensure moment-timezone is installed

const router = express.Router();

const convertTimeZone = (time, fromZone, toZone) => {
  return moment.tz(time, "HH:mm", fromZone).tz(toZone).format("HH:mm");
};

router.get("/availability", async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).populate(
      "availability"
    );

    if (!employees.length) {
      return res.status(404).json({ error: "No employee availability found." });
    }

    const formattedEmployees = employees.map((emp) => ({
      _id: emp._id, // Ensure employee ID is sent
      name: emp.name,
      availability: emp.availability.map((avail) => ({
        date: avail.date,
        startTime: avail.startTime,
        endTime: avail.endTime,
      })),
    }));

    res.json(formattedEmployees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/shifts", async (req, res) => {
  try {
    const { adminId, employeeId, date, startTime, endTime, timeZone } =
      req.body;
    console.log(employeeId, "This is the empID");
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ error: "Invalid Employee ID format." });
    }
    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

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
      date,
      startTime: { $lte: convertedStartTime },
      endTime: { $gte: convertedEndTime },
    });
    console.log(matchingAvailability, "This is the availibility status");

    if (!matchingAvailability) {
      return res
        .status(400)
        .json({ error: "No matching availability found for this employee." });
    }
    const overlappingShift = await Shift.findOne({
      employeeId,
      date,
      $or: [
        { startTime: { $lt: convertedEndTime, $gte: convertedStartTime } },
        { endTime: { $gt: convertedStartTime, $lte: convertedEndTime } },
      ],
    });

    if (overlappingShift) {
      return res
        .status(400)
        .json({ error: "Shift overlaps with an existing shift." });
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
    res.status(201).json({ message: "Shift assigned successfully", shift });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
