const express = require("express");
const Shift = require("../models/Shifts.model");
const router = express.Router();

router.get("/shifts", async (req, res) => {
  try {
    const shifts = await Shift.find()
      .populate("adminId")
      .populate("employeeId");
    res.json(shifts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Shift.findByIdAndDelete(req.params.id);
    res.json({ message: "Shift deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
