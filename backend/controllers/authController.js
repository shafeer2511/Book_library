// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // assuming you have a User model

// Signup
const signup = async (req, res) => {
  try {
    const { user_name, email, password, genres } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ user_name, email, password: hashedPassword, genres });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error signing up", error });
  }
};

// Login
const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({
        message: "Invalid credentials",
      });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );

    res.json({
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        user_name: user.user_name,
        email: user.email,
        genres: user.genres,
      },
    });

  } catch (error) {

    res.status(500).json({
      message: "Error logging in",
      error,
    });

  }
};

// Logout
const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

module.exports = {
  signup, login, logout
};
