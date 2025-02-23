const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const router = express.Router();

// api/auth/register API endpoint that takes name, email, password, role and timeZone as inputs and creates a new employee entry in thr DB
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, timeZone } = req.body;
    //  const salt = await bcrypt.genSalt(10);
    //  const hashedPassword = await bcrypt.hash(user.password, salt);
    //  user.password = hashedPassword;
    console.log(req.body);
    const salt = await bcrypt.genSalt(10);
    // hashing the password before saving in the database
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      timeZone,
    });
    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.json("Error is here");
    res.status(400).json({ error: err.message });
  }
});

// api/auth/login API endpoint that takes email and password as inputs and verifies and logs in the user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
