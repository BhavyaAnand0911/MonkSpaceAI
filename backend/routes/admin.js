const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = require("../models/User.model");
const Shift = require("../models/Shifts.model");
const Availability = require("../models/Availibility.model");
const moment = require("moment-timezone");

const router = express.Router();

// function to convert the time zone
const convertTimeZone = (time, fromZone, toZone) => {
  return moment.tz(time, "HH:mm", fromZone).tz(toZone).format("HH:mm");
};

// api/admin/availability API endpoint - which responds with an array of available employees
router.get("/availability", async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).populate(
      "availability"
    );

    if (!employees.length) {
      return res.status(404).json({ error: "No employee availability found." });
    }

    const formattedEmployees = employees.map((emp) => ({
      _id: emp._id,
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

// api/admin/shifts API endpoint that creates new shifts and checks for any overlap while creating them
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

// api/admin/profile API endpoint that responds with the currently logged in admin details using the access token stored in local storage
router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized. No token provided." });
    }

    // Verify token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const admin = await User.findOne({ _id: userId, role: "admin" });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found." });
    }

    res.json({ name: admin.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
