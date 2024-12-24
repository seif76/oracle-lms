const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const StudentModel = require("../../lib/student");
const TeacherModel = require("../../lib/teacher");
const AdminModel = require("../../lib/admin");
const { connectToDataBase } = require("../../lib/mongodb");

require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; // Use environment variables in production

// Helper function to determine user type
const findUserByEmail = async (email) => {
  await connectToDataBase();
  let user = await StudentModel.findOne({ email }).exec();
  if (!user) user = await TeacherModel.findOne({ email }).exec();
  if (!user) user = await AdminModel.findOne({ email }).exec();
  return user;
};

// Register Route
router.post("/register", async (req, res) => {
  const { name, email, password, role, phone, subject } = req.body;

  try {
    await connectToDataBase();

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user based on role
    let newUser;
    if (role === "student") {
      newUser = new StudentModel({ name, email, password: hashedPassword, phone });
    } else if (role === "teacher") {
      newUser = new TeacherModel({ name, email, password: hashedPassword, subject });
    } else if (role === "admin") {
      newUser = new AdminModel({ name, email, password: hashedPassword });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
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
