import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const existing = await User.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name: name.trim(),
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "Account created successfully",
      user: { id: user._id, name: user.name },
    });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return user profile
 */
router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ message: "Please provide both username and password" });
    }

    const user = await User.findOne({ name: name.trim() });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    res.json({
      message: "Signed in successfully",
      user: { id: user._id, name: user.name },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

export default router;

