const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AdminModel = require("../../lib/admin");
const TeacherModel = require("../../lib/teacher");
const connectToDataBase = require("../../lib/mongodb");

require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; // Use environment variables in production

// Helper function to determine user type
const findTeacherByEmail = async (email) => {
  await connectToDataBase();
  let user = await TeacherModel.findOne({ email }).exec();
  return user;
};

// Register Route
// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findTeacherByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.constructor.modelName.toLowerCase() }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
});

module.exports = router;
