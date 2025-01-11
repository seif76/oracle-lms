const express = require("express");
const mongoose = require("mongoose");
const Teacher = require("../lib/teacher");
const Student = require("../lib/student");
const Admin = require("../lib/admin");
const connectToDataBase = require("../lib/mongodb");

const usersController = express.Router();

// Helper function to get all users
const getAllUsers = async () => {
  const teachers = await Teacher.find({}).exec();
  const students = await Student.find({}).exec();
  const admins = await Admin.find({}).exec();
  return [
    ...teachers.map((teacher) => ({
      ...teacher.toObject(),
      role: "teacher",
    })),
    ...students.map((student) => ({
      ...student.toObject(),
      role: "student",
    })),
    ...admins.map((admin) => ({
      ...admin.toObject(),
      role: "admin",
    })),
  ];
};

// GET: Fetch all users
usersController.get("/users", async (req, res) => {
  try {
    await connectToDataBase(); // Ensure DB connection
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// GET: Fetch user by ID
usersController.get("/getById/:id", async (req, res) => {
  try {
    await connectToDataBase(); // Ensure DB connection
    const { id } = req.params;

    let user =
      (await Teacher.findById(id)) ||
      (await Student.findById(id)) ||
      (await Admin.findById(id));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Error fetching user by ID" });
  }
});

// POST: Create a new user
usersController.post("/users", async (req, res) => {
  try {
    await connectToDataBase(); // Ensure DB connection
    const { role, ...userData } = req.body;

    let newUser;
    if (role === "teacher") {
      newUser = new Teacher(userData);
    } else if (role === "student") {
      newUser = new Student(userData);
    } else if (role === "admin") {
      newUser = new Admin(userData);
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ message: "Error creating user" });
  }
});

// PUT: Update user by ID
usersController.put("/users/updateById/:id", async (req, res) => {
  try {
    await connectToDataBase(); // Ensure DB connection
    const { id } = req.params;
    const { role, ...userData } = req.body;

    let updatedUser;
    if (role === "teacher") {
      updatedUser = await Teacher.findByIdAndUpdate(id, userData, { new: true });
    } else if (role === "student") {
      updatedUser = await Student.findByIdAndUpdate(id, userData, { new: true });
    } else if (role === "admin") {
      updatedUser = await Admin.findByIdAndUpdate(id, userData, { new: true });
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(400).json({ message: "Error updating user" });
  }
});

// DELETE: Delete user by ID
usersController.delete("/users/deleteById/:id", async (req, res) => {
  try {
    await connectToDataBase(); // Ensure DB connection
    const { id } = req.params;
    console.log("the id is "+id)
    let deletedUser =
      (await Teacher.findByIdAndDelete(id).exec()) ||
      (await Student.findByIdAndDelete(id).exec()) ||
      (await Admin.findByIdAndDelete(id).exec());

      //let deletedUser;
    /*  if (role === "teacher") {
       const deletedUser = await Teacher.findByIdAndDelete(id).exec();
      } else if (role === "student") {
       const deletedUser = await Student.findByIdAndDelete(id).exec();
      } else if (role === "admin") {
       const deletedUser = await Admin.findByIdAndDelete(id).exec();
      } else {
        return res.status(400).json({ message: "Invalid user type" });
      }*/


    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

module.exports = usersController;
